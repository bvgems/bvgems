import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
});

const CACHE_PATH = path.resolve('./scripts/uploaded_shapes_cache.json');

async function main() {
  console.log("==================================================");
  console.log("🚀 Updating gemstone_specs with new Cloudinary Shape Assets");
  console.log("==================================================\n");

  // 1. Verify safety backup exists
  const backupCheck = await pool.query(`
    SELECT to_regclass('public.gemstone_specs_image_backup') as backup_table;
  `);

  if (!backupCheck.rows[0].backup_table) {
    console.error("❌ CRITICAL: Safety backup table 'gemstone_specs_image_backup' does not exist! Aborting.");
    process.exit(1);
  }

  const backupCount = await pool.query(`SELECT count(*) FROM gemstone_specs_image_backup`);
  console.log(`✅ Verified safety backup: ${backupCount.rows[0].count} records secured.`);

  // 2. Read Upload Cache
  if (!fs.existsSync(CACHE_PATH)) {
    console.error(`❌ Cache file not found: ${CACHE_PATH}`);
    process.exit(1);
  }

  const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
  console.log(`📦 Loaded ${Object.keys(cache).length} uploaded shape assets from cache.\n`);

  // Fallbacks for the 3 empty source files:
  const aaEmeraldTrillion = cache['emerald/green/aa/emerald-green-natural-aa-trillion.png']?.secure_url;
  const aaBlackPear = cache['sapphire/black/aa/sapphire-black-natural-aa-pear.png']?.secure_url;
  const aBlueEmeraldCut = cache['sapphire/blue/a/sapphire-blue-natural-a-emerald-cut.png']?.secure_url;

  let totalUpdatedRows = 0;
  let updatedCategories = {};

  for (const [assetPath, data] of Object.entries(cache)) {
    const { category, shape, color, quality, type, secure_url } = data;
    if (!secure_url) continue;

    const isLab = quality.toLowerCase().includes('lab') || (type && type.toLowerCase().includes('lab'));
    let query = '';
    let params = [];

    if (category.toLowerCase() === 'sapphire') {
      if (isLab) {
        query = `
          UPDATE gemstone_specs
          SET image_url = $1
          WHERE LOWER(collection_slug) = 'sapphire'
            AND LOWER(shape) = LOWER($2)
            AND LOWER(color) LIKE LOWER($3) || '%'
            AND (LOWER(quality) = 'lab grown' OR LOWER(type) LIKE '%lab%')
          RETURNING id;
        `;
        params = [secure_url, shape, color];
      } else {
        query = `
          UPDATE gemstone_specs
          SET image_url = $1
          WHERE LOWER(collection_slug) = 'sapphire'
            AND LOWER(shape) = LOWER($2)
            AND LOWER(color) LIKE LOWER($3) || '%'
            AND LOWER(quality) = LOWER($4)
            AND (LOWER(type) = 'natural' OR type IS NULL)
          RETURNING id;
        `;
        params = [secure_url, shape, color, quality];
      }
    } else {
      if (isLab) {
        query = `
          UPDATE gemstone_specs
          SET image_url = $1
          WHERE LOWER(collection_slug) = LOWER($2)
            AND LOWER(shape) = LOWER($3)
            AND (LOWER(quality) = 'lab grown' OR LOWER(type) LIKE '%lab%')
          RETURNING id;
        `;
        params = [secure_url, category, shape];
      } else {
        query = `
          UPDATE gemstone_specs
          SET image_url = $1
          WHERE LOWER(collection_slug) = LOWER($2)
            AND LOWER(shape) = LOWER($3)
            AND LOWER(quality) = LOWER($4)
            AND (LOWER(type) = 'natural' OR type IS NULL)
          RETURNING id;
        `;
        params = [secure_url, category, shape, quality];
      }
    }

    const res = await pool.query(query, params);
    const count = res.rowCount || 0;
    if (count > 0) {
      totalUpdatedRows += count;
      updatedCategories[category] = (updatedCategories[category] || 0) + count;
    }
  }

  // Apply fallback for the 3 empty files so those SKUs also have clean illustrations
  if (aaEmeraldTrillion) {
    const res = await pool.query(`
      UPDATE gemstone_specs
      SET image_url = $1
      WHERE LOWER(collection_slug) = 'emerald'
        AND LOWER(shape) = 'trillion'
        AND LOWER(quality) = 'a'
        AND (LOWER(type) = 'natural' OR type IS NULL)
      RETURNING id;
    `, [aaEmeraldTrillion]);
    if (res.rowCount > 0) {
      totalUpdatedRows += res.rowCount;
      updatedCategories['Emerald'] = (updatedCategories['Emerald'] || 0) + res.rowCount;
      console.log(`✨ Applied Emerald Trillion (A) fallback -> ${res.rowCount} rows`);
    }
  }

  if (aaBlackPear) {
    const res = await pool.query(`
      UPDATE gemstone_specs
      SET image_url = $1
      WHERE LOWER(collection_slug) = 'sapphire'
        AND LOWER(color) LIKE 'black%'
        AND LOWER(shape) = 'pear'
        AND LOWER(quality) = 'a'
        AND (LOWER(type) = 'natural' OR type IS NULL)
      RETURNING id;
    `, [aaBlackPear]);
    if (res.rowCount > 0) {
      totalUpdatedRows += res.rowCount;
      updatedCategories['Sapphire'] = (updatedCategories['Sapphire'] || 0) + res.rowCount;
      console.log(`✨ Applied Black Sapphire Pear (A) fallback -> ${res.rowCount} rows`);
    }
  }

  if (aBlueEmeraldCut) {
    const res = await pool.query(`
      UPDATE gemstone_specs
      SET image_url = $1
      WHERE LOWER(collection_slug) = 'sapphire'
        AND LOWER(color) LIKE 'blue%'
        AND LOWER(shape) = 'emerald cut'
        AND (LOWER(quality) = 'lab grown' OR LOWER(type) LIKE '%lab%')
      RETURNING id;
    `, [aBlueEmeraldCut]);
    if (res.rowCount > 0) {
      totalUpdatedRows += res.rowCount;
      updatedCategories['Sapphire'] = (updatedCategories['Sapphire'] || 0) + res.rowCount;
      console.log(`✨ Applied Blue Sapphire Lab Emerald Cut fallback -> ${res.rowCount} rows`);
    }
  }

  console.log("\n==================================================");
  console.log(`🎉 Database Update Complete!`);
  console.log(`Total gemstone_specs rows updated with new Cloudinary assets: ${totalUpdatedRows} / 2882`);
  console.log("Breakdown by Category:");
  console.table(Object.entries(updatedCategories).map(([Category, Rows]) => ({ Category, Rows })));
  console.log("==================================================");

  // 3. Verification Sample
  console.log("\n🔎 Sampling updated records from each category:");
  const sample = await pool.query(`
    SELECT DISTINCT ON (collection_slug) collection_slug, shape, quality, image_url
    FROM gemstone_specs
    WHERE image_url LIKE '%Gemstone%20Shapes%' OR image_url LIKE '%Gemstone Shapes%'
    ORDER BY collection_slug, id;
  `);
  console.table(sample.rows);

  await pool.end();
}

main().catch(err => {
  console.error("❌ Fatal error during DB update:", err);
  pool.end();
});
