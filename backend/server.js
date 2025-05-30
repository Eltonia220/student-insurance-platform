import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
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
import transactionRoutes from './routes/transactionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';



// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// ES module __dirname simulation
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// Enhanced JSON Middleware (PowerShell fix)
// ======================
app.use(express.json({
  limit: '10kb',
  verify: (req, res, buf) => {
    try {
      const raw = buf.toString('utf8');
      // Fix PowerShell escaped quotes
      const sanitized = raw.replace(/\\"/g, '"');
      JSON.parse(sanitized);
    } catch (e) {
      console.error('❌ JSON Parse Error:', e.message);
      console.error('Raw Input:', buf.toString('utf8'));
      throw new Error(`Invalid JSON: ${e.message}`);
    }
  }
}));

// PowerShell curl fix middleware
app.use((req, res, next) => {
  if (req.headers['user-agent']?.includes('curl')) {
    try {
      if (Buffer.isBuffer(req.body)) {
        const raw = req.body.toString('utf8');
        req.body = JSON.parse(raw.replace(/\\"/g, '"'));
      }
    } catch (e) {
      console.warn('PowerShell JSON fix failed, falling back');
    }
  }
  next();
});

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(helmet());

// ======================
// Request Debugging Middleware
// ======================
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// CORS Configuration - Move this BEFORE route mounting
// ======================
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ======================
// Route Mounting (Must come after body parsers)
// ======================
app.use('/api/mpesa', MpesaRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api', notificationRoutes);





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
  console.log('\n🔍 Registered Routes:');
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
// Enhanced Error Handling
// ======================
function handleError(res, error, defaultMessage) {
  console.error('❌ Full Error:', {
    message: error.message,
    stack: error.stack,
    rawBody: error.rawBody
  });

  if (error.message.includes('JSON') || error.message.includes('Unexpected token')) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid JSON format',
      suggestion: 'For PowerShell, use: $body = @{phoneNumber="254...";amount=10} | ConvertTo-Json -Compress',
      ...(process.env.NODE_ENV === 'development' && {
        detail: error.message,
        example: 'Valid JSON: {"phoneNumber":"254712345678","amount":10}'
      })
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
      console.log('PowerShell:');
      console.log('  $body = @{phoneNumber="254712345678";amount=10} | ConvertTo-Json -Compress');
      console.log('  curl.exe -X POST http://localhost:3001/api/mpesa/stk-push -H "Content-Type: application/json" -d $body');
      console.log('\nRegular CURL:');
      console.log('  curl -X POST http://localhost:3001/api/mpesa/stk-push \\');
      console.log('    -H "Content-Type: application/json" \\');
      console.log('    -d \'{"phoneNumber":"254712345678","amount":10}\'');
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};

startServer();