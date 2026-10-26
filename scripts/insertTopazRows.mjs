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
  const client = await pool.connect();
  try {
    console.log("1. Creating safety backup table...");
    await client.query("DROP TABLE IF EXISTS gemstone_specs_backup_20261026_topaz");
    await client.query("CREATE TABLE gemstone_specs_backup_20261026_topaz AS SELECT * FROM gemstone_specs");
    const backupCount = await client.query("SELECT COUNT(*) FROM gemstone_specs_backup_20261026_topaz");
    console.log(`✅ Safety backup created with ${backupCount.rows[0].count} rows.`);

    console.log("\n2. Loading prepared Topaz rows...");
    const rows = JSON.parse(fs.readFileSync(path.resolve('./scripts/prepared_topaz_rows.json'), 'utf-8'));
    console.log(`Loaded ${rows.length} rows.`);

    // Check if any Topaz rows already exist
    const existing = await client.query("SELECT COUNT(*) FROM gemstone_specs WHERE collection_slug = 'Topaz'");
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`⚠️ Found ${existing.rows[0].count} existing Topaz rows. Deleting before re-insert...`);
      await client.query("DELETE FROM gemstone_specs WHERE collection_slug = 'Topaz'");
    }

    console.log("\n3. Inserting rows into gemstone_specs...");
    await client.query("BEGIN");

    const insertSql = `
      INSERT INTO gemstone_specs (
        collection_slug,
        color,
        shape,
        size,
        quality,
        type,
        cut,
        ct_weight,
        price,
        image_url,
        is_available,
        search_vector,
        cloudinary_videos
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        to_tsvector('english', $3 || ' ' || $1 || ' ' || $4 || ' ' || coalesce($2, '')),
        '[]'::jsonb
      ) RETURNING id
    `;

    let inserted = 0;
    for (const r of rows) {
      await client.query(insertSql, [
        r.collection_slug,
        r.color,
        r.shape,
        r.size,
        r.quality,
        r.type,
        r.cut,
        r.ct_weight,
        r.price,
        r.image_url,
        r.is_available
      ]);
      inserted++;
    }

    await client.query("COMMIT");
    console.log(`✅ Successfully inserted ${inserted} Topaz rows!`);

    // Verify
    const verifyRes = await client.query(`
      SELECT color, shape, count(*) as count
      FROM gemstone_specs
      WHERE collection_slug = 'Topaz'
      GROUP BY color, shape
      ORDER BY color, shape
    `);
    console.log("\nTopaz rows by variant and shape:");
    console.table(verifyRes.rows);

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error during insertion:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
