import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  sourcemap: true,
  external: [
    'express',
    'cors',
    'helmet',
    'dotenv',
    'bcrypt',
    'jsonwebtoken',
    'multer',
    'mysql2',
    'nodemailer',
    'passport',
    'passport-google-oauth20',
    'google-auth-library',
    'sharp',
    'express-validator',
  ],
  logLevel: 'info',
  banner: {
    js: `import { createRequire as __createRequire } from 'module';
import { fileURLToPath as __fileURLToPath } from 'url';
import { dirname as __dirnameFunc } from 'path';
var require = __createRequire(import.meta.url);
var __filename = __fileURLToPath(import.meta.url);
var __dirname = __dirnameFunc(__filename);`,
  },
});

console.log('✅ Build completed successfully!');
