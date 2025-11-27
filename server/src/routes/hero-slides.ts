import express from 'express';
import pool from '../config/database.js';
import { requireAdmin } from '../middleware/auth.js';
import { upload } from '../config/upload.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import sharp from 'sharp';

const router = express.Router();

interface HeroSlide extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  image_data?: Buffer;
  mime_type?: string;
  text_color: 'white' | 'dark';
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Get slide image by ID (public)
router.get('/image/:id', async (req, res) => {
  try {
    const [slides] = await pool.query<HeroSlide[]>(
      'SELECT image_data, mime_type FROM hero_slides WHERE id = ?',
      [req.params.id]
    );

    if (slides.length === 0 || !slides[0].image_data) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const slide = slides[0];

    // Set CORS and security headers for images
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    res.contentType(slide.mime_type || 'image/webp');
    res.send(slide.image_data);
  } catch (error) {
    console.error('Error fetching slide image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Get all active slides (public) - without image data
router.get('/', async (req, res) => {
  try {
    const [slides] = await pool.query<HeroSlide[]>(
      'SELECT id, title, description, button_text, button_link, text_color, display_order, is_active, created_at, updated_at FROM hero_slides WHERE is_active = TRUE ORDER BY display_order ASC'
    );

    // Add image URL to each slide
    const slidesWithImages = slides.map(slide => ({
      ...slide,
      background_image: `/hero-slides/image/${slide.id}?v=${new Date(slide.updated_at).getTime()}`
    }));

    res.json(slidesWithImages);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    res.status(500).json({ error: 'Failed to fetch slides' });
  }
});

// Get all slides including inactive (admin only) - without image data
router.get('/all', ...requireAdmin, async (req, res) => {
  try {
    const [slides] = await pool.query<HeroSlide[]>(
      'SELECT id, title, description, button_text, button_link, text_color, display_order, is_active, created_at, updated_at FROM hero_slides ORDER BY display_order ASC'
    );

    // Add image URL to each slide
    const slidesWithImages = slides.map(slide => ({
      ...slide,
      background_image: `/hero-slides/image/${slide.id}?v=${new Date(slide.updated_at).getTime()}`
    }));

    res.json(slidesWithImages);
  } catch (error) {
    console.error('Error fetching all hero slides:', error);
    res.status(500).json({ error: 'Failed to fetch slides' });
  }
});

// Get single slide
router.get('/:id', async (req, res) => {
  try {
    const [slides] = await pool.query<HeroSlide[]>(
      'SELECT * FROM hero_slides WHERE id = ?',
      [req.params.id]
    );

    if (slides.length === 0) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    res.json(slides[0]);
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    res.status(500).json({ error: 'Failed to fetch slide' });
  }
});

// Create new slide (admin only)
router.post('/', ...requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      button_text,
      button_link,
      text_color = 'white',
      display_order = 0,
      is_active = 'true'
    } = req.body;

    if (!title || !button_text || !button_link || !req.file) {
      return res.status(400).json({ error: 'Missing required fields or image' });
    }

    // Optimize, compress and convert to WebP
    const optimizedImage = await sharp(req.file.buffer)
      .resize(1920, 1080, { fit: 'cover', position: 'center' })
      .webp({ quality: 85, effort: 6 })
      .toBuffer();

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO hero_slides
       (title, description, button_text, button_link, image_data, mime_type, text_color, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, button_text, button_link, optimizedImage, 'image/webp', text_color, display_order, is_active === 'true']
    );

    const [newSlide] = await pool.query<HeroSlide[]>(
      'SELECT id, title, description, button_text, button_link, text_color, display_order, is_active FROM hero_slides WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      ...newSlide[0],
      background_image: `/hero-slides/image/${result.insertId}?v=${Date.now()}`
    });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    res.status(500).json({ error: 'Failed to create slide' });
  }
});

// Update slide (admin only)
router.put('/:id', ...requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      button_text,
      button_link,
      text_color,
      display_order,
      is_active
    } = req.body;

    // If new image is uploaded, optimize it
    let updateQuery = `UPDATE hero_slides
                       SET title = ?, description = ?, button_text = ?, button_link = ?,
                           text_color = ?, display_order = ?, is_active = ?`;
    let params: any[] = [title, description, button_text, button_link, text_color, display_order, is_active === 'true' || is_active === true];

    if (req.file) {
      const optimizedImage = await sharp(req.file.buffer)
        .resize(1920, 1080, { fit: 'cover', position: 'center' })
        .webp({ quality: 85, effort: 6 })
        .toBuffer();

      updateQuery += `, image_data = ?, mime_type = ?`;
      params.push(optimizedImage, 'image/webp');
    }

    updateQuery += ` WHERE id = ?`;
    params.push(req.params.id);

    const [result] = await pool.query<ResultSetHeader>(updateQuery, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    const [updatedSlide] = await pool.query<HeroSlide[]>(
      'SELECT id, title, description, button_text, button_link, text_color, display_order, is_active FROM hero_slides WHERE id = ?',
      [req.params.id]
    );

    res.json({
      ...updatedSlide[0],
      background_image: `/hero-slides/image/${req.params.id}?v=${Date.now()}`
    });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    res.status(500).json({ error: 'Failed to update slide' });
  }
});

// Delete slide (admin only)
router.delete('/:id', ...requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM hero_slides WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    res.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    res.status(500).json({ error: 'Failed to delete slide' });
  }
});

// Reorder slides (admin only)
router.post('/reorder', ...requireAdmin, async (req, res) => {
  try {
    const { slides } = req.body; // Array of { id, display_order }

    if (!Array.isArray(slides)) {
      return res.status(400).json({ error: 'Invalid slides array' });
    }

    // Update display order for each slide
    for (const slide of slides) {
      await pool.query(
        'UPDATE hero_slides SET display_order = ? WHERE id = ?',
        [slide.display_order, slide.id]
      );
    }

    res.json({ message: 'Slides reordered successfully' });
  } catch (error) {
    console.error('Error reordering slides:', error);
    res.status(500).json({ error: 'Failed to reorder slides' });
  }
});

export default router;
