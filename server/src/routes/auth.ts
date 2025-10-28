import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email válido é obrigatório'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password deve ter no mínimo 6 caracteres'),
    body('name').trim().notEmpty().withMessage('Nome é obrigatório')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password, name } = req.body;

      // Check if user already exists
      const [existingUsers]: any = await pool.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        res.status(400).json({ error: 'Email já registado' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const [result]: any = await pool.query(
        'INSERT INTO users (email, password, name, role, status) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, name, 'customer', 'active']
      );

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: result.insertId,
          email,
          role: 'customer'
        },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        message: 'Utilizador criado com sucesso',
        token,
        user: {
          id: result.insertId,
          email,
          name,
          role: 'customer'
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Erro ao criar utilizador' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email válido é obrigatório'),
    body('password').notEmpty().withMessage('Password é obrigatória')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Find user
      const [rows]: any = await pool.query(
        'SELECT id, email, password, name, role, status FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        res.status(401).json({ error: 'Email ou password incorretos' });
        return;
      }

      const user = rows[0];

      // Check if account is active
      if (user.status !== 'active') {
        res.status(401).json({ error: 'Conta suspensa ou inativa' });
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        res.status(401).json({ error: 'Email ou password incorretos' });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        message: 'Login efetuado com sucesso',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }
);

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const [rows]: any = await pool.query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Utilizador não encontrado' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Erro ao obter utilizador' });
  }
});

// Verify token (for frontend)
router.post('/verify', authenticateToken, (req: AuthRequest, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

export default router;
