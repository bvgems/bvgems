import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import pg from 'pg';

dotenv.config();

// Configure Cloudinary
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
  'alexandrite/green-purple/lab-grown/alexandrite-green-purple-lab-grown-lab-grown-oval.png',
  'citrine/orange/aa/citrine-orange-natural-aa-oval.png',
  'emerald/green/a/emerald-green-natural-a-oval.png',
  'sapphire/blue/a/sapphire-blue-natural-a-oval.png',
  'sapphire/purple/a/sapphire-purple-natural-a-oval.png',
  'sapphire/red/a/sapphire-red-natural-a-oval.png'
];

async function run() {
  console.log('🚀 Starting Cloudinary upload and DB update for 6 vertical ovals...');

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const urlMap = {}; // old_url -> new_url

  for (const rel of filesToUpdate) {
    const oldEntry = cache[rel];
    if (!oldEntry) {
      console.error(`❌ Cache entry not found for ${rel}`);
      continue;
    }

    const localPath = path.join(ASSETS_ROOT, rel);
    console.log(`\n📤 Uploading vertical asset: ${rel}`);
    console.log(`   Public ID: ${oldEntry.public_id}`);

    const res = await cloudinary.uploader.upload(localPath, {
      public_id: oldEntry.public_id,
      overwrite: true,
      invalidate: true,
      resource_type: 'image'
    });

    console.log(`   ✅ New URL: ${res.secure_url}`);
    urlMap[oldEntry.secure_url] = res.secure_url;

    // Update cache entry
    cache[rel] = {
      ...oldEntry,
      secure_url: res.secure_url,
      width: res.width,
      height: res.height,
      uploaded_at: new Date().toISOString()
    };
  }

  // Save updated cache
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  console.log(`\n💾 Saved updated cache to ${CACHE_PATH}`);

  // Update Database
  console.log('\n🗄️ Updating PostgreSQL database rows...');
  let totalUpdated = 0;

  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    const updateResult = await pool.query(
      'UPDATE gemstone_specs SET image_url = $1 WHERE image_url = $2 RETURNING id',
      [newUrl, oldUrl]
    );
    console.log(`   Updated ${updateResult.rowCount} rows: ${oldUrl.split('/').pop()} -> ${newUrl.split('/').pop()}`);
    totalUpdated += updateResult.rowCount;
  }

  console.log(`\n🎉 Total database rows updated: ${totalUpdated}`);

  // Verification query
  const check = await pool.query(`
    SELECT collection_slug, color, quality, shape, image_url 
    FROM gemstone_specs 
    WHERE shape = 'Oval' 
      AND (
        (collection_slug = 'Alexandrite') OR
        (collection_slug = 'Citrine' AND quality = 'AA') OR
        (collection_slug = 'Emerald' AND quality = 'A') OR
        (collection_slug = 'Sapphire' AND color = 'Blue' AND quality = 'A') OR
        (collection_slug = 'Sapphire' AND color = 'Purple' AND quality = 'A') OR
        (collection_slug = 'Sapphire' AND color = 'Red' AND quality = 'A')
      )
    GROUP BY collection_slug, color, quality, shape, image_url
    ORDER BY collection_slug, color;
  `);

  console.log('\n📋 Verified distinct DB specs:');
  for (const row of check.rows) {
    console.log(`   ${row.collection_slug} | ${row.color} | ${row.quality} | ${row.shape} | ${row.image_url}`);
  }

  await pool.end();
  console.log('\n✨ Complete!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
