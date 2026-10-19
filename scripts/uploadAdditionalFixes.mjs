import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import pg from 'pg';

dotenv.config();

if (process.env.CLOUDINARY_URL) {
  const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true
  });
}

const ASSETS_ROOT = '/Users/meetpatel/Desktop/BV/Oct19/BV_Gems_Individual_Shape_Assets';
const CACHE_PATH = path.resolve('./scripts/uploaded_shapes_cache.json');
const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));

const filesToUpdate = [
  'sapphire/pink/lab-grown/sapphire-pink-lab-grown-lab-grown-trillion.png',
  'sapphire/white/aa/sapphire-white-natural-aa-princess-cut.png'
];

async function run() {
  console.log('🚀 Uploading fixed pink trillion and white princess cut...');
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const urlMap = {};

  for (const rel of filesToUpdate) {
    const oldEntry = cache[rel];
    if (!oldEntry) continue;

    const localPath = path.join(ASSETS_ROOT, rel);
    console.log(`\n📤 Uploading fixed asset: ${rel}`);
    const res = await cloudinary.uploader.upload(localPath, {
      public_id: oldEntry.public_id,
      overwrite: true,
      invalidate: true,
      resource_type: 'image'
    });

    console.log(`   ✅ New URL: ${res.secure_url}`);
    urlMap[oldEntry.secure_url] = res.secure_url;

    cache[rel] = {
      ...oldEntry,
      secure_url: res.secure_url,
      width: res.width,
      height: res.height,
      uploaded_at: new Date().toISOString()
    };
  }

  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');

  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    const res = await pool.query(
      'UPDATE gemstone_specs SET image_url = $1 WHERE image_url = $2 RETURNING id',
      [newUrl, oldUrl]
    );
    console.log(`Updated ${res.rowCount} rows in DB for ${newUrl.split('/').pop()}`);
  }

  await pool.end();
  console.log('✨ Done!');
}

run().catch(console.error);
