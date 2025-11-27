import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
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

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());

// CORS configuration - allow multiple origins from environment variable
const allowedOrigins = process.env.FRONTEND_URL?.split(',').map(url => url.trim()) || ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
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

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
});
