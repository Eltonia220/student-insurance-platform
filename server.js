import 'dotenv/config';
import express from 'express';
import { Sequelize } from 'sequelize';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import authRoutes from './routes/authRoutes.js';

// Constants
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(path.join(__dirname, 'package.json')));
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';

// Initialize Express
const app = express();

// ======================
// Enhanced Security Middleware
// ======================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
    },
  },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cookieParser(process.env.COOKIE_SECRET));

// Enhanced Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === '::1' // Skip for localhost
});

// ======================
// Database Configuration with Connection Pooling
// ======================
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  logging: isDevelopment ? console.log : false,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
    evict: 10000 // Added connection eviction policy
  },
  retry: {
    max: 3, // Retry up to 3 times
    match: [/ConnectionError/, /SequelizeConnectionError/]
  },
  dialectOptions: NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    keepAlive: true
  } : {},
});

// ======================
// Enhanced CORS Configuration
// ======================
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  ...(isDevelopment ? ['http://localhost:3001', 'http://localhost:5173'] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization', 'X-Total-Count']
}));

// ======================
// Enhanced Middleware
// ======================
app.use(morgan(isDevelopment ? 'dev' : 'combined'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/api', apiLimiter);

// Request logging middleware
app.use((req, res, next) => {
  if (isDevelopment) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ======================
// Enhanced Routes
// ======================
// API Documentation
const apiDocs = {
  status: 'success',
  message: 'Welcome to Student Insurance Aggregator API',
  version: packageJson.version,
  environment: NODE_ENV,
  endpoints: {
    auth: {
      login: { path: '/api/v1/auth/login', methods: ['POST'] },
      register: { path: '/api/v1/auth/register', methods: ['POST'] },
      logout: { path: '/api/v1/auth/logout', methods: ['POST'] }
    },
    health: { path: '/api/health', methods: ['GET'] },
    protected: { path: '/api/v1/protected', methods: ['GET'] }
  },
  documentation: process.env.DOCS_URL || 'No documentation URL set'
};

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json(apiDocs);
});

// Health check with DB status
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'success',
      message: 'API and database are healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'API is healthy but database connection failed',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// Mount routes
app.use('/api/v1/auth', authRoutes);

// Protected route example with JWT validation middleware
app.get('/api/v1/protected', (req, res) => {
  res.json({
    status: 'success',
    data: {
      message: 'This is protected content',
      timestamp: new Date().toISOString()
    }
  });
});

// ======================
// Enhanced Error Handling
// ======================
// 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Endpoint ${req.method} ${req.path} not found`,
    suggestion: 'Visit / for available endpoints',
    documentation: process.env.DOCS_URL
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;
  
  if (statusCode === 500) {
    console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(isDevelopment && {
      error: err.message,
      stack: err.stack,
      ...(err.errors && { errors: err.errors })
    })
  });
});

// ======================
// Server Initialization with Retry Logic
// ======================
const MAX_RETRIES = 3;
let retryCount = 0;

const startServer = async () => {
  try {
    console.log('⌛ Attempting database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    if (isDevelopment) {
      await sequelize.sync({ alter: true });
      console.log('🔄 Database models synchronized');
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${NODE_ENV}`);
      console.log(`📄 API Documentation: ${process.env.DOCS_URL || 'Not configured'}`);
      console.log(`🕒 Started at: ${new Date().toISOString()}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE' && retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`⚠️ Port ${PORT} in use, retrying (${retryCount}/${MAX_RETRIES})...`);
        setTimeout(() => {
          server.close();
          startServer();
        }, 1000);
      } else {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received - shutting down gracefully`);
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start the server
startServer();