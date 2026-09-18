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
  const query = `
  SELECT *
  FROM (
      SELECT *,
             ROW_NUMBER() OVER (PARTITION BY collection_slug ORDER BY id) AS row_num
      FROM gemstone_specs
  ) AS ranked
  WHERE row_num <= 10
`;
  const result = await pool.query(query);
  console.log("Total items in data payload:", result.rows.length);
  
  const roundInData = result.rows.filter(r => r.shape && r.shape.toLowerCase() === 'round').length;
  console.log("Round items in data payload:", roundInData);
  process.exit(0);
}

main().catch(console.error);
