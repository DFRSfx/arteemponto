import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/database.js';
import authRouter from './routes/auth.js';
import googleAuthRouter from './routes/google-auth.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import statsRouter from './routes/stats.js';
import usersRouter from './routes/users.js';
import passwordResetRouter from './routes/password-reset.js';
import heroSlidesRouter from './routes/hero-slides.js';
import cartRouter from './routes/cart.js';
import favoritesRouter from './routes/favorites.js';
import shippingAddressesRouter from './routes/shipping-addresses.js';
import paymentRouter from './routes/payment.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy for reverse proxies (Render, Koyeb, Vercel)
app.set('trust proxy', 1);

// Security middleware with relaxed CSP for development and CDN images
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
const rawOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, '');

    const isAllowed =
      rawOrigins.includes('*') ||
      rawOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('arteemponto.pt') ||
      cleanOrigin.includes('dariosoares.dev') ||
      cleanOrigin.includes('localhost');

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Raw body parser for Stripe webhook (must be before express.json())
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Regular body parser for other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory (fallback / local dev)
app.use(express.static(path.join(__dirname, '../public')));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Arte em Ponto API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      googleAuth: '/api/auth/google',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      heroSlides: '/api/hero-slides',
      cart: '/api/cart',
      favorites: '/api/favorites',
      shippingAddresses: '/api/shipping-addresses',
      payment: '/api/payment',
      health: '/api/health'
    }
  });
});

// Health check endpoint with database diagnostics
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      database: 'failed',
      message: err.message,
      code: err.code || 'UNKNOWN',
      host: process.env.DB_HOST ? `${process.env.DB_HOST.substring(0, 4)}***` : (process.env.DATABASE_URL ? 'using_database_url' : 'not_set'),
      database_name: process.env.DB_NAME || 'not_set',
      ssl: process.env.DB_SSL || 'auto'
    });
  }
});

// Fallback health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/auth/google', googleAuthRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/stats', statsRouter);
app.use('/api/users', usersRouter);
app.use('/api/password-reset', passwordResetRouter);
app.use('/api/hero-slides', heroSlidesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/shipping-addresses', shippingAddressesRouter);
app.use('/api/payment', paymentRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
