import express from 'express';
import pool from '../config/database.js';
import { requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics (admin only)
router.get('/dashboard', ...requireAdmin, async (req: AuthRequest, res) => {
  try {
    // Get total orders
    const [orderCount]: any = await pool.query(
      'SELECT COUNT(*) as total FROM orders'
    );
    const totalOrders = orderCount[0].total;

    // Get total revenue
    const [revenueResult]: any = await pool.query(
      'SELECT SUM(total) as revenue FROM orders'
    );
    const totalRevenue = revenueResult[0].revenue || 0;

    // Get total products
    const [productCount]: any = await pool.query(
      'SELECT COUNT(*) as total FROM products'
    );
    const totalProducts = productCount[0].total;

    // Get pending orders
    const [pendingCount]: any = await pool.query(
      "SELECT COUNT(*) as total FROM orders WHERE status = 'pending'"
    );
    const pendingOrders = pendingCount[0].total;

    // Get recent orders
    const [recentOrders] = await pool.query(`
      SELECT * FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Get low stock products
    const [lowStockProducts] = await pool.query(`
      SELECT * FROM products
      WHERE stock <= 10
      ORDER BY stock ASC
      LIMIT 5
    `);

    // Get sales by category
    const [categorySales]: any = await pool.query(`
      SELECT
        p.category,
        SUM(oi.quantity) as quantity,
        SUM(oi.price * oi.quantity) as total
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.category
      ORDER BY total DESC
    `);

    const salesByCategory: Record<string, { total: number; quantity: number }> = {};
    categorySales.forEach((row: any) => {
      salesByCategory[row.category] = {
        total: parseFloat(row.total),
        quantity: row.quantity
      };
    });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      totalProducts,
      pendingOrders,
      recentOrders,
      lowStockProducts,
      salesByCategory
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
