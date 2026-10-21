import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/database.js';
import { uploadToR2, publicCdnUrl, bucketName } from './config/r2.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  console.log('🚀 Starting migration to Cloudflare R2...');
  console.log(`📦 Target Bucket: ${bucketName}`);
  console.log(`🌐 Public CDN URL: ${publicCdnUrl}\n`);

  let totalUploaded = 0;
  let totalErrors = 0;

  // 1. Migrate Products Images
  const produtosDir = path.join(__dirname, '../public/produtos');
  if (fs.existsSync(produtosDir)) {
    console.log('📁 Migrating product images...');
    const productDirs = fs.readdirSync(produtosDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const dirName of productDirs) {
      const productDirPath = path.join(produtosDir, dirName);
      const files = fs.readdirSync(productDirPath).filter(f => f.endsWith('.webp'));

      for (const file of files) {
        const filePath = path.join(productDirPath, file);
        const fileBuffer = fs.readFileSync(filePath);
        const r2Key = `produtos/${dirName}/${file}`;

        try {
          await uploadToR2(r2Key, fileBuffer, 'image/webp');
          totalUploaded++;
          process.stdout.write(`  ✅ Uploaded: ${r2Key}\n`);
        } catch (err: any) {
          totalErrors++;
          console.error(`  ❌ Failed to upload ${r2Key}:`, err.message);
        }
      }
    }
  }

  // 2. Migrate Hero Slides Images
  const heroSlidesDir = path.join(__dirname, '../public/hero-slides');
  if (fs.existsSync(heroSlidesDir)) {
    console.log('\n📁 Migrating hero slides images...');
    const files = fs.readdirSync(heroSlidesDir).filter(f => f.endsWith('.webp'));

    for (const file of files) {
      const filePath = path.join(heroSlidesDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      const r2Key = `hero-slides/${file}`;

      try {
        await uploadToR2(r2Key, fileBuffer, 'image/webp');
        totalUploaded++;
        process.stdout.write(`  ✅ Uploaded: ${r2Key}\n`);
      } catch (err: any) {
        totalErrors++;
        console.error(`  ❌ Failed to upload ${r2Key}:`, err.message);
      }
    }
  }

  // 3. Update Database records to use CDN URLs
  console.log('\n🔄 Updating database product image URLs...');
  try {
    const [products]: any = await pool.query('SELECT id, images FROM products');
    let updatedDbCount = 0;

    for (const product of products) {
      if (!product.images) continue;

      let images: string[] = [];
      try {
        images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      } catch {
        continue;
      }

      if (!Array.isArray(images)) continue;

      let changed = false;
      const updatedImages = images.map(img => {
        if (img && typeof img === 'string') {
          // If it's a relative path like /produtos/1/image-1-1.webp
          if (img.startsWith('/produtos/')) {
            changed = true;
            return `${publicCdnUrl}${img}`;
          }
          // If it points to old onrender domain or localhost
          if (img.includes('onrender.com/produtos/') || img.includes('localhost:3001/produtos/')) {
            changed = true;
            const subPath = img.substring(img.indexOf('/produtos/'));
            return `${publicCdnUrl}${subPath}`;
          }
        }
        return img;
      });

      if (changed) {
        await pool.query('UPDATE products SET images = ? WHERE id = ?', [
          JSON.stringify(updatedImages),
          product.id,
        ]);
        updatedDbCount++;
      }
    }

    console.log(`  ✅ Updated ${updatedDbCount} products in the database with CDN URLs.`);
  } catch (dbErr: any) {
    console.error('  ⚠️ Database update notice:', dbErr.message);
  }

  console.log('\n──────────────────────────────────────────');
  console.log(`✨ Migration finished!`);
  console.log(`📊 Uploaded: ${totalUploaded} files | Errors: ${totalErrors}`);
  console.log('──────────────────────────────────────────\n');

  process.exit(totalErrors > 0 ? 1 : 0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
