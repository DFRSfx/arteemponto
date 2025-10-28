-- Migration: Add imagens field to products table
-- Date: 2025-10-27
-- Description: Adds a LONGTEXT field to store JSON array of additional product images

USE arte_em_ponto;

-- Add imagens column if it doesn't exist
ALTER TABLE products
ADD COLUMN IF NOT EXISTS imagens LONGTEXT NULL DEFAULT NULL
COMMENT 'JSON array of additional product images (base64 or URLs)'
AFTER image;

-- Verify the column was added
DESCRIBE products;
