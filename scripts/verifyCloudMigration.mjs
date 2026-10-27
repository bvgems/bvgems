import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
});

async function main() {
  console.log("==================================================");
  console.log("🔍 Step 4: End-to-End Cloud Migration Verification");
  console.log("==================================================\n");

  // 1. Check all active tables in PostgreSQL
  const tablesRes = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  console.log("1️⃣ Checking all active PostgreSQL tables for Cloudinary references:");
  let totalRemainingDab = 0;

  for (const { table_name } of tablesRes.rows) {
    if (table_name.includes("backup") || table_name.includes("archive")) continue;
    const dabRes = await pool.query(`SELECT count(*) FROM "${table_name}" t WHERE t::text LIKE '%dabdvgxd4%'`);
    const okoRes = await pool.query(`SELECT count(*) FROM "${table_name}" t WHERE t::text LIKE '%oko8ywzn%'`);
    const dabCount = parseInt(dabRes.rows[0].count);
    const okoCount = parseInt(okoRes.rows[0].count);
    totalRemainingDab += dabCount;

    if (dabCount > 0 || okoCount > 0) {
      console.log(`   - ${table_name.padEnd(24)} | oko8ywzn rows: ${String(okoCount).padStart(4)} | dabdvgxd4 rows: ${dabCount}`);
    }
  }

  console.log(`\n   👉 Total remaining 'dabdvgxd4' references in active DB tables: ${totalRemainingDab}`);
  if (totalRemainingDab !== 0) {
    throw new Error(`Found ${totalRemainingDab} remaining dabdvgxd4 references in active tables!`);
  }

  // 2. Verify sample migrated URLs in DB return HTTP 200 on oko8ywzn
  console.log("\n2️⃣ Testing live HTTP status of migrated assets on oko8ywzn:");
  const sampleVideoRes = await pool.query(`
    SELECT cloudinary_videos->0->>'video_url' as url, cloudinary_videos->0->>'public_id' as pid
    FROM gemstone_specs
    WHERE jsonb_array_length(cloudinary_videos) > 0
    LIMIT 5;
  `);
  const sampleFreeRes = await pool.query(`
    SELECT image_url as url FROM free_size_gemstones WHERE image_url IS NOT NULL LIMIT 5;
  `);
  const sampleExtraRes = await pool.query(`
    SELECT image_url as url FROM gemstone_images WHERE image_url IS NOT NULL LIMIT 5;
  `);

  const testUrls = [
    ...sampleVideoRes.rows.map(r => ({ type: "Video (gemstone_specs)", url: r.url })),
    ...sampleFreeRes.rows.map(r => ({ type: "Free-Size Image", url: r.url })),
    ...sampleExtraRes.rows.map(r => ({ type: "Comparison Image (gemstone_images)", url: r.url }))
  ];

  for (const item of testUrls) {
    const res = await fetch(item.url, { method: "HEAD" });
    console.log(`   [${res.status === 200 ? "✅ 200 OK" : "❌ " + res.status}] ${item.type}: ${item.url}`);
    if (res.status !== 200) {
      throw new Error(`Asset returned ${res.status}: ${item.url}`);
    }
  }

  await pool.end();
  console.log("\n✨ All verifications passed with 100% precision!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
