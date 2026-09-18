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
    SELECT * FROM gemstone_specs 
    WHERE lower(collection_slug) LIKE '%sapphire%' 
      AND lower(shape) LIKE '%pear%'
      AND lower(color) LIKE '%blue%'
      AND lower(type) = 'natural'
      AND ct_weight BETWEEN 0.4 AND 0.6
  `;
  const result = await pool.query(query);
  console.log("Found:", result.rows.length, "items");
  if (result.rows.length > 0) {
    console.log(result.rows.map(r => ({
      id: r.id, 
      slug: r.collection_slug, 
      shape: r.shape, 
      color: r.color, 
      ct_weight: r.ct_weight, 
      type: r.type, 
      size: r.size
    })));
  }
  process.exit(0);
}

main().catch(console.error);
