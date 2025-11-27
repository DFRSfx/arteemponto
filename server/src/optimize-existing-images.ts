import pool from './config/database.js';
import sharp from 'sharp';

/**
 * Script to optimize existing images in the database
 * This will:
 * 1. Fetch all images from product_images table
 * 2. Convert them to WebP format with compression
 * 3. Update the database with optimized images
 */

interface ProductImage {
  id: number;
  product_id: number;
  image_data: Buffer;
  mime_type: string;
  file_size: number;
  is_primary: boolean;
  display_order: number;
}

async function optimizeImages() {
  let connection;

  try {
    console.log('🚀 Starting image optimization process...\n');

    // Get all images from database
    const [images]: any = await pool.query(
      'SELECT id, product_id, image_data, mime_type, file_size, is_primary, display_order FROM product_images'
    );

    if (images.length === 0) {
      console.log('✅ No images found in database.');
      return;
    }

    console.log(`📊 Found ${images.length} image(s) to optimize\n`);

    let optimizedCount = 0;
    let totalOriginalSize = 0;
    let totalNewSize = 0;

    // Process each image
    for (let i = 0; i < images.length; i++) {
      const image: ProductImage = images[i];
      const originalSize = image.file_size;

      try {
        console.log(`\n📸 Processing image ${i + 1}/${images.length}:`);
        console.log(`   ID: ${image.id}, Product: ${image.product_id}`);
        console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB (${image.mime_type})`);

        // Check if WebP is already optimized (skip if less than 250KB)
        if (image.mime_type === 'image/webp' && originalSize < 250000) {
          console.log('   ⏭️  Already optimized WebP, skipping...');
          continue;
        }

        // If WebP but large, we'll re-optimize it
        if (image.mime_type === 'image/webp') {
          console.log('   🔄 Re-optimizing large WebP...');
        }

        // Get image metadata
        const metadata = await sharp(image.image_data).metadata();
        const { width, height } = metadata;

        // Define max dimensions
        const maxWidth = 1920;
        const maxHeight = 1080;

        // Prepare resize options
        const shouldResize =
          (typeof width === 'number' && width > maxWidth) ||
          (typeof height === 'number' && height > maxHeight);

        // Convert and compress to WebP
        let sharpInstance = sharp(image.image_data);

        if (shouldResize) {
          sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true,
          });
          console.log(`   📐 Resizing from ${width}x${height} to fit ${maxWidth}x${maxHeight}`);
        }

        const processedBuffer = await sharpInstance
          .webp({
            quality: 80,
            effort: 6,
            smartSubsample: true,
          })
          .toBuffer();

        const newSize = processedBuffer.length;
        const compression = ((1 - newSize / originalSize) * 100).toFixed(2);

        console.log(`   ✅ Optimized: ${(newSize / 1024).toFixed(2)} KB (image/webp)`);
        console.log(`   💾 Compression: ${compression}% reduction`);

        // Update database
        await pool.query(
          'UPDATE product_images SET image_data = ?, mime_type = ?, file_size = ? WHERE id = ?',
          [processedBuffer, 'image/webp', newSize, image.id]
        );

        console.log(`   💿 Updated in database`);

        totalOriginalSize += originalSize;
        totalNewSize += newSize;
        optimizedCount++;

      } catch (error) {
        console.error(`   ❌ Error processing image ${image.id}:`, error);
        continue;
      }
    }

    // Summary
    const totalCompression = totalOriginalSize > 0
      ? ((1 - totalNewSize / totalOriginalSize) * 100).toFixed(2)
      : 0;

    console.log('\n' + '='.repeat(60));
    console.log('📊 OPTIMIZATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Images optimized: ${optimizedCount}/${images.length}`);
    console.log(`📦 Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📦 Total new size: ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`💾 Total space saved: ${((totalOriginalSize - totalNewSize) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📉 Total compression: ${totalCompression}%`);
    console.log('='.repeat(60));
    console.log('\n✨ Image optimization completed!\n');

  } catch (error) {
    console.error('❌ Fatal error during optimization:', error);
    throw error;
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the script
optimizeImages()
  .then(() => {
    console.log('🎉 Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
