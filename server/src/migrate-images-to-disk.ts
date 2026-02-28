/**
 * One-time migration script: reads images from the product_images table (BLOB)
 * and saves them as WebP files to server/public/produtos/{productId}/.
 * Then updates products.images with the array of file paths.
 *
 * Run with: npm run migrate-images
 */

import pool from './config/database.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public/produtos');

async function run() {
  console.log('🚀 Starting image migration from DB blobs to disk...\n');

  // Fetch all rows ordered so display_order determines the file index
  const [rows]: any = await pool.query(
    `SELECT id, product_id, image_data, mime_type, display_order
     FROM product_images
     ORDER BY product_id ASC, display_order ASC, id ASC`
  );

  if (rows.length === 0) {
    console.log('ℹ️  No rows found in product_images table — nothing to migrate.');
    process.exit(0);
  }

  const productIds = [...new Set(rows.map((r: any) => r.product_id as number))];
  console.log(`Found ${rows.length} image(s) across ${productIds.length} product(s).\n`);

  // Group rows by product
  const byProduct = new Map<number, typeof rows>();
  for (const row of rows) {
    if (!byProduct.has(row.product_id)) byProduct.set(row.product_id, []);
    byProduct.get(row.product_id)!.push(row);
  }

  let totalSaved = 0;
  let totalFailed = 0;

  for (const [productId, images] of byProduct) {
    console.log(`📦 Product ${productId} — ${images.length} image(s):`);

    const dir = path.join(publicDir, String(productId));
    fs.mkdirSync(dir, { recursive: true });

    const paths: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const row = images[i];
      const index = i + 1;
      const filename = `image-${index}-${productId}.webp`;
      const filepath = path.join(dir, filename);
      const publicPath = `/produtos/${productId}/${filename}`;

      try {
        // Skip if already saved (re-run safe)
        if (fs.existsSync(filepath)) {
          console.log(`  ⏭️  Already exists, skipping: ${filename}`);
          paths.push(publicPath);
          continue;
        }

        const buffer: Buffer = Buffer.isBuffer(row.image_data)
          ? row.image_data
          : Buffer.from(row.image_data);

        await sharp(buffer)
          .webp({ quality: 80, effort: 6, smartSubsample: true })
          .toFile(filepath);

        const stat = fs.statSync(filepath);
        console.log(`  ✅ ${filename}  (${(stat.size / 1024).toFixed(1)} KB)`);
        paths.push(publicPath);
        totalSaved++;
      } catch (err: any) {
        console.error(`  ❌ Failed (db id=${row.id}): ${err.message}`);
        totalFailed++;
      }
    }

    if (paths.length > 0) {
      await pool.query(
        'UPDATE products SET images = ? WHERE id = ?',
        [JSON.stringify(paths), productId]
      );
      console.log(`  📝 products.images updated → ${paths.length} path(s)\n`);
    } else {
      console.log(`  ⚠️  No images saved — products.images not updated\n`);
    }
  }

  console.log('─'.repeat(50));
  console.log(`✨ Done! Saved: ${totalSaved}  Failed: ${totalFailed}`);

  await (pool as any).end?.();
  process.exit(totalFailed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('💥 Migration error:', err);
  process.exit(1);
});
