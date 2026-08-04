import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    name?: string;
  };
}

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Middleware to authenticate users using JWT tokens
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token = '';
  const reqContext = `[${req.ip || 'unknown IP'}] ${req.method} ${req.originalUrl}`;

  try {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1] || '';

    if (!token) {
      console.log(`❌ No token provided for ${reqContext}`);
      res.status(401).json({ error: 'Token de acesso necessário' });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Check if user still exists and is active
    const [rows]: any = await pool.query(
      'SELECT id, email, name, role, status FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) {
      console.log(`❌ User not found: ${decoded.userId} for ${reqContext}`);
      res.status(401).json({ error: 'Utilizador não encontrado' });
      return;
    }

    const user = rows[0];

    if (user.status !== 'active') {
      console.log(`❌ User inactive: ${user.id} (status: ${user.status}) for ${reqContext}`);
      res.status(401).json({ error: 'Conta suspensa ou inativa' });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Tentar descodificar sem verificar só para saber quem era o utilizador
      let userInfo = '';
      try {
        if (token) {
          const decoded = jwt.decode(token) as JwtPayload | null;
          if (decoded && decoded.email) {
            userInfo = ` (User: ${decoded.userId} - ${decoded.email})`;
          }
        }
      } catch (e) {
        // Ignorar erros de descodificação
      }
      
      console.log(`❌ JWT Error for ${reqContext}${userInfo}: ${error.message}`);
      res.status(403).json({ error: 'Token inválido ou expirado' });
      return;
    }
    
    console.error(`❌ Auth error for ${reqContext}:`, error);
    res.status(500).json({ error: 'Falha na autenticação' });
  }
};

/**
 * Middleware factory to require specific roles
 * Usage: requireRole('admin', 'customer')
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Permissão negada',
        required: allowedRoles,
        current: req.user.role
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to require admin role
 */
export const requireAdmin = [
  authenticateToken,
  requireRole('admin')
];

/**
 * Legacy name for backward compatibility
 */
export const authenticateAdmin = requireAdmin;

/**
 * Optional authentication - doesn't fail if no token, just doesn't set req.user
 * Useful for endpoints that work for both authenticated and anonymous users
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // No token, just continue without setting user
      next();
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Check if user still exists and is active
    const [rows]: any = await pool.query(
      'SELECT id, email, name, role, status FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length > 0 && rows[0].status === 'active') {
      const user = rows[0];
      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };
    }

    next();
  } catch (error) {
    // Token is invalid, but we don't fail - just continue without user
    next();
  }
};
