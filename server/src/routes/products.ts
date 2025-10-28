import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post(
  '/',
  ...requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category_id').isInt({ min: 1 }).withMessage('Category ID is required'),
    body('image').trim().notEmpty().withMessage('Image is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { name, description, price, category_id, image, stock, featured } = req.body;

      const [result]: any = await pool.query(
        'INSERT INTO products (name, description, price, category_id, image, stock, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, description, price, category_id, image, stock, featured || false]
      );

      const [newProduct]: any = await pool.query(
        'SELECT * FROM products WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json(newProduct[0]);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// Update product (admin only)
router.put(
  '/:id',
  ...requireAdmin,
  [
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('category_id').optional().isInt({ min: 1 }),
    body('image').optional().trim().notEmpty(),
    body('stock').optional().isInt({ min: 0 })
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { name, description, price, category_id, image, stock, featured } = req.body;

      const updates: string[] = [];
      const values: any[] = [];

      if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
      }
      if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
      }
      if (price !== undefined) {
        updates.push('price = ?');
        values.push(price);
      }
      if (category_id !== undefined) {
        updates.push('category_id = ?');
        values.push(category_id);
      }
      if (image !== undefined) {
        updates.push('image = ?');
        values.push(image);
      }
      if (stock !== undefined) {
        updates.push('stock = ?');
        values.push(stock);
      }
      if (featured !== undefined) {
        updates.push('featured = ?');
        values.push(featured);
      }

      if (updates.length === 0) {
        res.status(400).json({ error: 'No fields to update' });
        return;
      }

      values.push(req.params.id);

      await pool.query(
        `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      const [updatedProduct]: any = await pool.query(
        'SELECT * FROM products WHERE id = ?',
        [req.params.id]
      );

      if (updatedProduct.length === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(updatedProduct[0]);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
);

// Delete product (admin only)
router.delete('/:id', ...requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [result]: any = await pool.query(
      'DELETE FROM products WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
