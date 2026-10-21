import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const accountId = process.env.R2_ACCOUNT_ID || 'c399f84836491150fe0c599472222fbe';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
export const bucketName = process.env.R2_BUCKET_NAME || 'arteemponto-images';
export const publicCdnUrl = (process.env.R2_PUBLIC_URL || 'https://cdn.arteemponto.pt').replace(/\/$/, '');

export const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
 * Uploads a buffer directly to Cloudflare R2
 */
export const uploadToR2 = async (
  key: string,
  buffer: Buffer,
  contentType: string = 'image/webp'
): Promise<string> => {
  const cleanKey = key.replace(/^\/+/, '');

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return `${publicCdnUrl}/${cleanKey}`;
};

/**
 * Deletes a single object from R2 by key or full URL
 */
export const deleteFromR2 = async (keyOrUrl: string): Promise<void> => {
  if (!keyOrUrl) return;

  let cleanKey = keyOrUrl;
  if (cleanKey.startsWith('http')) {
    try {
      const url = new URL(cleanKey);
      cleanKey = url.pathname;
    } catch {
      // fallback
    }
  }
  cleanKey = cleanKey.replace(/^\/+/, '');

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: cleanKey,
      })
    );
  } catch (err) {
    console.error(`Failed to delete ${cleanKey} from R2:`, err);
  }
};

/**
 * Deletes all objects under a specific prefix in R2
 */
export const deletePrefixFromR2 = async (prefix: string): Promise<void> => {
  const cleanPrefix = prefix.replace(/^\/+/, '');

  try {
    const listResult = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: cleanPrefix,
      })
    );

    if (listResult.Contents && listResult.Contents.length > 0) {
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: listResult.Contents.map(obj => ({ Key: obj.Key! })),
          },
        })
      );
      console.log(`Deleted ${listResult.Contents.length} objects with prefix: ${cleanPrefix}`);
    }
  } catch (err) {
    console.error(`Failed to delete prefix ${cleanPrefix} from R2:`, err);
  }
};
