import 'dotenv/config';
import express from 'express';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// ======================
// Security Middleware
// ======================
app.use(helmet());
app.use(cookieParser());

// Rate Limiting - More granular control
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply to all API routes
app.use('/api', apiLimiter);

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
    max: 10, // Increased for better performance
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
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name is required'
      },
      len: {
        args: [2, 50],
        msg: 'Name must be between 2-50 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 128]
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  }
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
// Middleware
// ======================
// Enhanced CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
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

// Request logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ======================
// JWT Utilities
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

// ======================
// Authentication Middleware
// ======================
const authenticate = async (req, res, next) => {
  try {
    // Get the token from cookies or the Authorization header
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

    // Log the token for debugging purposes
    console.log('Token:', token);  // This logs the token to the console

    // If there's no token, respond with an error
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required'
      });
    }

    // If there is a token, validate it (this is where you continue with your existing logic)
    const { payload } = await jwtVerify(token, JWT_CONFIG.secret);

    // Find the user by ID from the token payload
    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User no longer exists'
      });
    }

    // Check if the password was changed after the token was issued
    if (user.changedPasswordAfter(payload.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'Password changed. Please log in again'
      });
    }

    // Attach the user to the request object for further use in routes
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid token'
    });
  }
};

// Add method to User model
User.prototype.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// ======================
// Routes
// ======================
// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy'
  });
});

// Auth Routes
const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match'
      });
    }

    const user = await User.create({ name, email, password });
    const token = await createToken({ id: user.id, role: user.role });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
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
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials'
      });
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
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
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

// Protected Routes
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
// Error Handling
// ======================
function handleError(res, error, defaultMessage) {
  console.error(error);

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
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Not Found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  handleError(res, err, 'Internal Server Error');
});

// ======================
// Server Initialization
// ======================
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({
      alter: process.env.NODE_ENV === 'development',
      logging: false
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
