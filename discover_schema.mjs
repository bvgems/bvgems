import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
});

async function main() {
  // free_size_gemstones: The 1 row that has price but not total_price
  console.log("=== free_size_gemstones: has price but NOT total_price ===");
  const r1 = await pool.query(`SELECT * FROM free_size_gemstones WHERE price IS NOT NULL AND price > 0 AND (total_price IS NULL OR total_price = 0)`);
  console.table(r1.rows);

  // free_size_gemstones: rows that have total_price but NOT price
  console.log("\n=== free_size_gemstones: has total_price but NOT price ===");
  const r2 = await pool.query(`SELECT count(*) as c FROM free_size_gemstones WHERE (price IS NULL OR price = 0) AND total_price IS NOT NULL AND total_price > 0`);
  console.log(`Count: ${r2.rows[0].c}`);

  // free_size_gemstones: rows that have BOTH prices
  console.log("\n=== free_size_gemstones: has BOTH prices ===");
  const r3 = await pool.query(`SELECT count(*) as c FROM free_size_gemstones WHERE price IS NOT NULL AND price > 0 AND total_price IS NOT NULL AND total_price > 0`);
  console.log(`Count: ${r3.rows[0].c}`);

  // What does 'price' mean in gemstone_specs - is it per stone or per carat?
  console.log("\n=== gemstone_specs: column check - is it per_carat or per_stone? ===");
  const r4 = await pool.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'gemstone_specs' 
      AND (lower(column_name) LIKE '%per%' OR lower(column_name) LIKE '%carat%' OR lower(column_name) LIKE '%stone%' OR lower(column_name) LIKE '%price%')
    ORDER BY column_name
  `);
  console.table(r4.rows);

  // What do the 27 null gemstone_type rows in free_size_gemstones look like?
  console.log("\n=== free_size_gemstones: rows with NULL gemstone_type ===");
  const r5 = await pool.query(`SELECT * FROM free_size_gemstones WHERE gemstone_type IS NULL LIMIT 5`);
  console.table(r5.rows);

  // Understand size format in gemstone_specs
  console.log("\n=== gemstone_specs: size formats (sample) ===");
  const r6 = await pool.query(`SELECT DISTINCT size FROM gemstone_specs ORDER BY size LIMIT 30`);
  for (const r of r6.rows) {
    console.log(`  "${r.size}"`);
  }

  // Understand dimension format in free_size_gemstones
  console.log("\n=== free_size_gemstones: dimension formats (sample) ===");
  const r7 = await pool.query(`SELECT DISTINCT dimension FROM free_size_gemstones ORDER BY dimension LIMIT 30`);
  for (const r of r7.rows) {
    console.log(`  "${r.dimension}"`);
  }

  process.exit(0);
}

main().catch(console.error);
