import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import MpesaRoutes from './routes/MpesaRoutes.js';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// ES module __dirname simulation
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// Enhanced Middleware Configuration
// ======================
app.use(express.json({
  limit: '10kb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf.toString());
    } catch (e) {
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(helmet());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// ======================
// Route Mounting (Must come after body parsers)
// ======================
app.use('/api/mpesa', (req, res, next) => {
  console.log(`M-Pesa router accessed for: ${req.originalUrl}`);
  next();
}, MpesaRoutes);

// ======================
// CORS Configuration
// ======================
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:8080',
  process.env.NODE_ENV === 'development' && 'http://localhost:3001'
].filter(Boolean);

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
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));

// ======================
// Database Configuration
// ======================
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
});

// ======================
// Models
// ======================
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' }
}, {
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// ======================
// JWT Configuration
// ======================
const JWT_CONFIG = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET),
  alg: 'HS256',
  expiration: process.env.JWT_EXPIRES_IN || '2h'
};

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const createToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_CONFIG.alg })
    .setIssuedAt()
    .setExpirationTime(JWT_CONFIG.expiration)
    .sign(JWT_CONFIG.secret);
};

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'Authentication required' });
    }

    const { payload } = await jwtVerify(token, JWT_CONFIG.secret);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ status: 'fail', message: 'User no longer exists' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
};

// ======================
// Routes
// ======================
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is healthy' });
});

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ status: 'fail', message: 'Passwords do not match' });
    }

    const user = await User.create({ name, email, password });
    const token = await createToken({ id: user.id, role: user.role });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    handleError(res, error, 'Registration failed');
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    }

    const token = await createToken({ id: user.id, role: user.role });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    handleError(res, error, 'Login failed');
  }
});

authRouter.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
});

app.use('/api/v1/auth', authRouter);

// Protected Route Example
app.get('/api/v1/protected', authenticate, (req, res) => {
  res.json({
    status: 'success',
    data: {
      message: 'Protected content',
      user: req.user
    }
  });
});

// ======================
// Route Debugging
// ======================
function debugRoutes() {
  console.log('\n🔍 Active Routes:');
  app._router.stack.forEach(layer => {
    if (layer.route) {
      console.log(`DIRECT: ${Object.keys(layer.route.methods)[0].toUpperCase()} ${layer.route.path}`);
    } else if (layer.name === 'router') {
      console.log(`MOUNTED: ${layer.regexp}`);
      layer.handle.stack.forEach(sublayer => {
        if (sublayer.route) {
          console.log(`  ${Object.keys(sublayer.route.methods)[0].toUpperCase()} ${sublayer.route.path}`);
        }
      });
    }
  });
}

// ======================
// Error Handling
// ======================
function handleError(res, error, defaultMessage) {
  console.error('❌ Error:', error);

  if (error.message.includes('JSON')) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid JSON in request body',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      status: 'fail',
      message: error.errors.map(e => e.message).join('; ')
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      status: 'fail',
      message: 'Email already in use'
    });
  }

  res.status(500).json({
    status: 'error',
    message: defaultMessage || 'An error occurred',
    ...(process.env.NODE_ENV === 'development' && {
      error: error.message,
      stack: error.stack
    })
  });
}

app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  handleError(res, err, 'Internal Server Error');
});

// ======================
// Server Startup
// ======================
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({
      alter: process.env.NODE_ENV === 'development',
      logging: false
    });

    debugRoutes();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('\n🛠️ Test M-Pesa endpoints:');
      console.log(`POST http://localhost:${PORT}/api/mpesa/stk-push`);
      console.log(`GET  http://localhost:${PORT}/api/mpesa/test`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};

startServer();