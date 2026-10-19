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
  'emerald/green/a/emerald-green-natural-a-emerald-cut.png',
  'ruby/red/aa/ruby-red-natural-aa-straight-baguette.png',
  'sapphire/red/a/sapphire-red-natural-a-emerald-cut.png',
  'tanzanite/purple/aa/tanzanite-purple-natural-aa-marquise.png',
  'sapphire/blue/aa/sapphire-blue-natural-aa-cushion.png'
];

async function run() {
  console.log('🚀 Starting Cloudinary upload and DB update for targeted stone fixes...');

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const urlMap = {}; // old_url -> new_url

  for (const rel of filesToUpdate) {
    const oldEntry = cache[rel];
    if (!oldEntry) {
      console.error(`❌ Cache entry not found for ${rel}`);
      continue;
    }

    const localPath = path.join(ASSETS_ROOT, rel);
    console.log(`\n📤 Uploading fixed asset: ${rel}`);
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

  // Also upload Teal sapphire asset
  console.log('\n📤 Uploading dedicated Teal Sapphire asset...');
  const tealLocalPath = path.resolve('public/assets/teal-800.png');
  const tealRes = await cloudinary.uploader.upload(tealLocalPath, {
    public_id: 'Gemstone Shapes/Sapphire/Teal/sapphire-teal-round',
    overwrite: true,
    invalidate: true,
    resource_type: 'image'
  });
  console.log(`   ✅ Teal URL: ${tealRes.secure_url}`);

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

  // Also let's check if any rows matched our criteria directly
  // For Blue Sapphire Cushion AA
  const scCheck = await pool.query(`
    SELECT count(*) FROM gemstone_specs 
    WHERE collection_slug = 'Sapphire' AND color = 'Blue' AND quality = 'AA' AND shape = 'Cushion'
  `);
  console.log(`\nBlue Sapphire Cushion AA rows in DB: ${scCheck.rows[0].count}`);

  const scUrlCheck = await pool.query(`
    SELECT DISTINCT image_url FROM gemstone_specs 
    WHERE collection_slug = 'Sapphire' AND color = 'Blue' AND quality = 'AA' AND shape = 'Cushion'
  `);
  console.log('Blue Sapphire Cushion AA active image_url in DB:', scUrlCheck.rows.map(r => r.image_url));

  // If the active URL is not the new URL, update them!
  const aaCushionUrl = cache['sapphire/blue/aa/sapphire-blue-natural-aa-cushion.png'].secure_url;
  const fixSc = await pool.query(`
    UPDATE gemstone_specs 
    SET image_url = $1 
    WHERE collection_slug = 'Sapphire' AND color = 'Blue' AND quality = 'AA' AND shape = 'Cushion'
    RETURNING id
  `, [aaCushionUrl]);
  console.log(`Ensured Blue Sapphire Cushion AA rows have correct URL (updated ${fixSc.rowCount} rows)`);

  await pool.end();
  console.log('\n✨ Complete!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
