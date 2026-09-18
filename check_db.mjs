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
  const result = await pool.query("SELECT count(*) FROM gemstone_specs WHERE lower(shape) = 'round'");
  console.log("Total round calibrated stones in DB:", result.rows[0].count);
  
  const allShapes = await pool.query("SELECT lower(shape) as shape, count(*) FROM gemstone_specs GROUP BY lower(shape) ORDER BY count(*) DESC");
  console.log("\nCounts by shape:");
  console.table(allShapes.rows);
  
  process.exit(0);
}

main().catch(console.error);
