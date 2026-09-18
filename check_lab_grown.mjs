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
  const result = await pool.query("SELECT * FROM gemstone_specs WHERE lower(type) = 'lab grown' AND (lower(color) LIKE '%natural%' OR lower(collection_slug) LIKE '%natural%' OR lower(quality) LIKE '%natural%') LIMIT 5");
  console.log(result.rows);
  process.exit(0);
}

main().catch(console.error);
