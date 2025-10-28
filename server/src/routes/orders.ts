import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { requireAdmin, authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all orders (admin only)
router.get('/', ...requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [orders]: any = await pool.query(`
      SELECT
        o.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'id', oi.id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product', JSON_OBJECT(
              'id', p.id,
              'name', p.name,
              'image', p.image
            )
          )
        ) as order_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);

    // Parse JSON strings
    const parsedOrders = orders.map((order: any) => ({
      ...order,
      order_items: order.order_items ? JSON.parse(`[${order.order_items}]`) : []
    }));

    res.json(parsedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order (admin only)
router.get('/:id', ...requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [orders]: any = await pool.query(`
      SELECT
        o.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'id', oi.id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product', JSON_OBJECT(
              'id', p.id,
              'name', p.name,
              'image', p.image
            )
          )
        ) as order_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
      GROUP BY o.id
    `, [req.params.id]);

    if (orders.length === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const order = {
      ...orders[0],
      order_items: orders[0].order_items ? JSON.parse(`[${orders[0].order_items}]`) : []
    };

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order (public/authenticated)
router.post(
  '/',
  [
    body('customer_name').trim().notEmpty().withMessage('Customer name is required'),
    body('customer_email').isEmail().withMessage('Valid email is required'),
    body('customer_phone').trim().notEmpty().withMessage('Phone is required'),
    body('customer_address').trim().notEmpty().withMessage('Address is required'),
    body('customer_city').trim().notEmpty().withMessage('City is required'),
    body('customer_postal_code').trim().notEmpty().withMessage('Postal code is required'),
    body('payment_method').trim().notEmpty().withMessage('Payment method is required'),
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('items.*.product_id').isInt().withMessage('Product ID must be an integer'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be positive')
  ],
  async (req, res) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const {
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_city,
        customer_postal_code,
        payment_method,
        items
      } = req.body;

      // Calculate total
      const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

      // Create order
      const [orderResult]: any = await connection.query(
        `INSERT INTO orders (
          customer_name, customer_email, customer_phone,
          customer_address, customer_city, customer_postal_code,
          payment_method, total, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customer_name, customer_email, customer_phone,
          customer_address, customer_city, customer_postal_code,
          payment_method, total, 'pending'
        ]
      );

      const orderId = orderResult.insertId;

      // Create order items
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );

        // Update product stock
        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      await connection.commit();

      const [newOrder]: any = await connection.query(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );

      res.status(201).json(newOrder[0]);
    } catch (error) {
      await connection.rollback();
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    } finally {
      connection.release();
    }
  }
);

// Update order status (admin only)
router.patch(
  '/:id/status',
  ...requireAdmin,
  [
    body('status')
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status')
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { status } = req.body;

      await pool.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, req.params.id]
      );

      const [updatedOrder]: any = await pool.query(
        'SELECT * FROM orders WHERE id = ?',
        [req.params.id]
      );

      if (updatedOrder.length === 0) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.json(updatedOrder[0]);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: 'Failed to update order' });
    }
  }
);

// Delete order (admin only)
router.delete('/:id', ...requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [result]: any = await pool.query(
      'DELETE FROM orders WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
