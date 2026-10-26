import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import pg from 'pg';
import sharp from 'sharp';

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
} else {
  console.error("❌ CLOUDINARY_URL not found in environment.");
  process.exit(1);
}

const pool = new pg.Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: Number(process.env.PGPORT) || 5432,
      }
);

const CACHE_PATH = path.resolve('./scripts/uploaded_shapes_cache.json');
const REL_PATH = 'emerald/green/a/emerald-green-natural-a-oval.png';
const PUBLIC_ID = 'Gemstone Shapes/Emerald/Green/A/emerald-green-natural-a-oval';

const ASSET_PATHS = [
  '/Users/meetpatel/Desktop/BV/BV_Gems_Individual_Shape_Assets 3/' + REL_PATH,
  '/Users/meetpatel/Desktop/BV/BV_Gems_Individual_Shape_Assets/' + REL_PATH,
  '/Users/meetpatel/Desktop/BV/BV_Gems_Individual_Shape_Assets 2/' + REL_PATH,
  '/Users/meetpatel/Desktop/BV/Oct19/BV_Gems_Individual_Shape_Assets/' + REL_PATH,
];

async function main() {
  console.log("==================================================");
  console.log("💎 Rotating Calibrated Emerald A Oval to Vertical");
  console.log("==================================================\n");

  const sourceFile = ASSET_PATHS[0];
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`Source file missing: ${sourceFile}`);
  }

  // 1. Rotate 90 deg clockwise using sharp
  console.log(`🔄 Rotating ${sourceFile} by 90 degrees clockwise...`);
  const rotatedBuffer = await sharp(sourceFile).rotate(90).png().toBuffer();

  // Save to temporary file for upload
  const tempRotatedFile = '/tmp/emerald-green-natural-a-oval-vertical.png';
  fs.writeFileSync(tempRotatedFile, rotatedBuffer);

  // Sync to all asset locations
  for (const targetPath of ASSET_PATHS) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, rotatedBuffer);
    console.log(`   ✅ Wrote vertical image to: ${targetPath}`);
  }

  // 2. Upload to Cloudinary
  console.log(`\n📤 Uploading vertical asset to Cloudinary: ${PUBLIC_ID}...`);
  const res = await cloudinary.uploader.upload(tempRotatedFile, {
    public_id: PUBLIC_ID,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
    tags: ["representative_gemstone_shape", "Emerald", "Oval", "A", "revision_5", "vertical_fix"]
  });

  console.log(`   ✅ Uploaded! Secure URL: ${res.secure_url}`);
  console.log(`   Dimensions: ${res.width}x${res.height}`);

  // 3. Update uploaded_shapes_cache.json
  if (fs.existsSync(CACHE_PATH)) {
    const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    cache[REL_PATH] = {
      secure_url: res.secure_url,
      public_id: res.public_id,
      width: res.width,
      height: res.height,
      format: res.format,
      category: 'Emerald',
      color: 'Green',
      type: 'Natural',
      quality: 'A',
      shape: 'Oval',
      uploaded_at: new Date().toISOString()
    };
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
    console.log(`\n💾 Saved updated cache entry to ${CACHE_PATH}`);
  }

  // 4. Update gemstone_specs in database
  console.log("\n🗄️ Updating gemstone_specs table in database...");
  const updateQuery = `
    UPDATE gemstone_specs
    SET image_url = $1
    WHERE LOWER(collection_slug) = 'emerald'
      AND LOWER(shape) = 'oval'
      AND LOWER(quality) = 'a'
      AND (LOWER(type) = 'natural' OR type IS NULL)
    RETURNING id, size, ct_weight, image_url;
  `;

  const dbRes = await pool.query(updateQuery, [res.secure_url]);
  console.log(`   🎉 Total gemstone_specs rows updated: ${dbRes.rowCount}`);
  console.table(dbRes.rows);

  await pool.end();
  console.log("\n✨ Done! Emerald A Oval is now vertical on Cloudinary and in the database.");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
