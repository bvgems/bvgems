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

// Standard calibrated carat weights for Topaz (Specific Gravity ~3.53)
// Derived from industry standard calibrated charts (Stuller mounting catalog & gemological sizing matrices)
const WEIGHT_MAP = {
  // Cushions (square calibrated standard)
  "Cushion::7.00 x 7.00 mm": 2.00,
  "Cushion::8.00 x 8.00 mm": 2.90,
  "Cushion::9.00 x 9.00 mm": 4.00,
  "Cushion::10.00 x 10.00 mm": 5.25,
  "Cushion::12.00 x 12.00 mm": 8.50,

  // Emerald Cut
  "Emerald Cut::14.00 x 12.00 mm": 12.70, // Matches Swiss & Sky Blue 14x12 in Stuller

  // Heart
  "Heart::9.00 x 9.00 mm": 3.30,   // Matches Swiss & Sky Blue 9x9 in Stuller
  "Heart::10.00 x 10.00 mm": 4.90, // Matches Swiss & Sky Blue 10x10 in Stuller

  // Marquise
  "Marquise::5.00 x 2.50 mm": 0.18, // Matches Swiss & Sky Blue 5x2.5 in Stuller

  // Oval
  "Oval::18.00 x 13.00 mm": 16.05, // Matches Swiss Blue 18x13 in Stuller

  // Princess Cut (Square)
  "Princess Cut::6.50 mm": 1.65, // Matches London & Swiss Blue 6.5mm in Stuller
  "Princess Cut::8.00 mm": 2.75, // Matches Swiss & Sky Blue 8.0mm in Stuller

  // Round
  "Round::10.00 mm": 4.25, // Matches London Blue 10mm in Stuller
  "Round::12.00 mm": 6.00, // Standard calibrated 12mm round

  // Straight Baguette
  "Straight Baguette::6.00 x 3.00 mm": 0.45, // Matches London & Swiss Blue 6x3 in Stuller

  // Trillion
  "Trillion::8.00 x 8.00 mm": 2.20, // Matches Swiss Blue 8x8 in Stuller
  "Trillion::9.00 x 9.00 mm": 3.45  // Matches Swiss Blue 9x9 in Stuller
};

async function main() {
  const client = await pool.connect();

  try {
    console.log("==================================================");
    console.log("💎 Filling Missing Carat Weights for Calibrated Topaz");
    console.log("==================================================\n");

    // 1. Fetch all rows where ct_weight IS NULL
    const nullRows = await client.query(`
      SELECT id, collection_slug, color, shape, size
      FROM gemstone_specs
      WHERE ct_weight IS NULL
      ORDER BY shape, size, color;
    `);

    console.log(`Found ${nullRows.rows.length} rows with ct_weight IS NULL.\n`);

    let updatedCount = 0;
    await client.query("BEGIN");

    for (const row of nullRows.rows) {
      const key = `${row.shape.trim()}::${row.size.trim()}`;
      const weight = WEIGHT_MAP[key];

      if (weight === undefined) {
        throw new Error(`No weight defined for key: ${key} (Row ID: ${row.id})`);
      }

      await client.query(`
        UPDATE gemstone_specs
        SET ct_weight = $1
        WHERE id = $2;
      `, [weight, row.id]);

      console.log(`✅ Updated ID ${row.id}: ${row.color} ${row.shape} ${row.size} -> ${weight} ct`);
      updatedCount++;
    }

    await client.query("COMMIT");
    console.log(`\n🎉 Successfully updated all ${updatedCount} rows!`);

    // 2. Verify remaining NULL count across the entire gemstone_specs table
    const checkRes = await client.query(`
      SELECT collection_slug, 
             count(*) as total_rows, 
             count(CASE WHEN ct_weight IS NULL THEN 1 END) as missing_ct,
             count(CASE WHEN ct_weight IS NOT NULL THEN 1 END) as has_ct
      FROM gemstone_specs
      GROUP BY collection_slug
      ORDER BY missing_ct DESC, collection_slug ASC;
    `);

    console.log("\n📊 Final Status Across All Collections in gemstone_specs:");
    console.table(checkRes.rows);

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error filling carat weights:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
