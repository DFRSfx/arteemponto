import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { requireAdmin, AuthRequest } from '../middleware/auth.js';
import { upload, processImages } from '../config/upload.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        GROUP_CONCAT(pi.id ORDER BY pi.display_order) as image_ids
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC`
    );

    // Convert image_ids to array of image URLs with cache busting
    const products = rows.map((product: any) => ({
      ...product,
      images: product.image_ids ?
        product.image_ids.split(',').map((id: string) => `/products/image/${id}?v=${new Date(product.updated_at).getTime()}`) :
        []
    }));

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product image by ID (serves BLOB as image)
router.get('/image/:imageId', async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT image_data, mime_type FROM product_images WHERE id = ?',
      [req.params.imageId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    const image = rows[0];

    // Set CORS and security headers for images
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    res.contentType(image.mime_type);
    res.send(image.image_data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        GROUP_CONCAT(pi.id ORDER BY pi.display_order) as image_ids
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = ?
      GROUP BY p.id`,
      [req.params.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const product = {
      ...rows[0],
      images: rows[0].image_ids ?
        rows[0].image_ids.split(',').map((id: string) => `/products/image/${id}?v=${new Date(rows[0].updated_at).getTime()}`) :
        []
    };

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only) - with file upload
router.post(
  '/',
  ...requireAdmin,
  upload.array('images', 10), // Max 10 images
  processImages, // Process and convert images to WebP
  async (req: AuthRequest, res) => {
    try {
      const { name, description, price, category, stock, featured, colors } = req.body;
      const files = req.files as Express.Multer.File[];

      if (!name || !description || !price || !category) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      if (!files || files.length === 0) {
        res.status(400).json({ error: 'At least one image is required' });
        return;
      }

      // Parse colors if provided
      let colorsArray = [];
      if (colors) {
        try {
          colorsArray = typeof colors === 'string' ? JSON.parse(colors) : colors;
        } catch (e) {
          console.error('Error parsing colors:', e);
        }
      }
      const colorsJson = JSON.stringify(colorsArray);

      // Insert product (without images field since we'll use separate table)
      const [result]: any = await pool.query(
        'INSERT INTO products (name, description, price, category_id, stock, featured, colors) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, description, price, category, stock || 0, featured === 'true', colorsJson]
      );

      const productId = result.insertId;

      // Insert images into product_images table
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await pool.query(
          'INSERT INTO product_images (product_id, image_data, mime_type, file_size, is_primary, display_order) VALUES (?, ?, ?, ?, ?, ?)',
          [productId, file.buffer, file.mimetype, file.size, i === 0, i]
        );
      }

      const [newProduct]: any = await pool.query(
        `SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?`,
        [productId]
      );

      res.status(201).json(newProduct[0]);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// Update product (admin only) - with file upload
router.put(
  '/:id',
  ...requireAdmin,
  upload.array('images', 10), // Max 10 images
  processImages, // Process and convert images to WebP
  async (req: AuthRequest, res) => {
    try {
      console.log('🔄 UPDATE Product ID:', req.params.id);
      console.log('📝 Request body:', req.body);
      console.log('📸 Files received:', req.files ? (req.files as Express.Multer.File[]).length : 0);
      
      const { name, description, price, category, stock, featured, existingImages, colors } = req.body;
      const files = req.files as Express.Multer.File[];

      if (files && files.length > 0) {
        console.log('📤 Files details:');
        files.forEach((file, idx) => {
          console.log(`  File ${idx + 1}:`, file.originalname, file.mimetype, file.size);
        });
      }

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
      if (category !== undefined) {
        updates.push('category_id = ?');
        values.push(category);
      }
      if (stock !== undefined) {
        updates.push('stock = ?');
        values.push(stock);
      }
      if (featured !== undefined) {
        updates.push('featured = ?');
        values.push(featured === 'true');
      }

      // Handle colors
      if (colors !== undefined) {
        try {
          const colorsArray = typeof colors === 'string' ? JSON.parse(colors) : colors;
          updates.push('colors = ?');
          values.push(JSON.stringify(colorsArray));
        } catch (e) {
          console.error('Error parsing colors:', e);
        }
      }

      if (updates.length > 0) {
        values.push(req.params.id);
        await pool.query(
          `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
      }

      // Handle images - keep only the existing ones specified
      if (existingImages) {
        console.log('🗂️ Processing existing images:', existingImages);
        try {
          const keepIds = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
          console.log('✅ Parsed keepIds:', keepIds);
          if (Array.isArray(keepIds) && keepIds.length > 0) {
            // Delete all images not in the keep list
            await pool.query(
              `DELETE FROM product_images WHERE product_id = ? AND id NOT IN (?)`,
              [req.params.id, keepIds]
            );
            console.log('🗑️ Deleted images not in keep list');
          } else {
            // No existing images to keep, delete all
            await pool.query(
              'DELETE FROM product_images WHERE product_id = ?',
              [req.params.id]
            );
            console.log('🗑️ Deleted all existing images');
          }
        } catch (e) {
          console.error('❌ Error parsing existing images:', e);
        }
      }

      // Add new uploaded images
      if (files && files.length > 0) {
        console.log('➕ Adding new images:', files.length);
        // Get current max display_order
        const [maxOrder]: any = await pool.query(
          'SELECT COALESCE(MAX(display_order), -1) as max_order FROM product_images WHERE product_id = ?',
          [req.params.id]
        );
        
        let nextOrder = (maxOrder[0]?.max_order || -1) + 1;
        console.log('📊 Starting display_order:', nextOrder);

        for (const file of files) {
          console.log(`💾 Inserting image: order=${nextOrder}, size=${file.size}, type=${file.mimetype}`);
          await pool.query(
            'INSERT INTO product_images (product_id, image_data, mime_type, file_size, is_primary, display_order) VALUES (?, ?, ?, ?, ?, ?)',
            [req.params.id, file.buffer, file.mimetype, file.size, nextOrder === 0, nextOrder]
          );
          nextOrder++;
        }
        console.log('✅ All images inserted successfully');
      } else {
        console.log('ℹ️ No new images to add');
      }

      const [updatedProduct]: any = await pool.query(
        `SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          GROUP_CONCAT(pi.id ORDER BY pi.display_order) as image_ids
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = ?
        GROUP BY p.id`,
        [req.params.id]
      );

      if (updatedProduct.length === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      const product = {
        ...updatedProduct[0],
        images: updatedProduct[0].image_ids ?
          updatedProduct[0].image_ids.split(',').map((id: string) => `/products/image/${id}?v=${Date.now()}`) :
          []
      };

      res.json(product);
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
