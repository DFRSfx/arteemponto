import pool from '../config/database.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'mbway' | 'multibanco' | 'paypal';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name?: string;
  product_image?: string;
}

export interface Order {
  id: number;
  user_id?: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address: string;
  customer_city: string;
  customer_postal_code: string;
  payment_method: PaymentMethod;
  payment_intent_id?: string;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  notes?: string;
  tracking_token?: string;
  created_at: Date;
  updated_at: Date;
  items?: OrderItem[];
}

export class OrderModel {
  // Find order by ID
  static async findById(id: number): Promise<Order | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;

    const order = rows[0] as Order;
    order.items = await this.getOrderItems(id);
    return order;
  }

  // Get order items
  static async getOrderItems(orderId: number): Promise<OrderItem[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT oi.*, p.name as product_name, p.images as product_images
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows.map(row => ({
      id: row.id,
      order_id: row.order_id,
      product_id: row.product_id,
      quantity: row.quantity,
      price: row.price,
      product_name: row.product_name,
      product_image: row.product_images ? JSON.parse(row.product_images)[0] : null
    }));
  }

  // Find orders by user ID
  static async findByUserId(userId: number): Promise<Order[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows as Order[];
  }

  // Update order status
  static async updateStatus(id: number, status: OrderStatus): Promise<void> {
    await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
  }

  // Update payment status
  static async updatePaymentStatus(id: number, paymentStatus: PaymentStatus): Promise<void> {
    await pool.query(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      [paymentStatus, id]
    );
  }
}
