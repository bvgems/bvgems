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
  const r1 = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'gemstone_specs' AND column_name LIKE '%video%'
  `);
  console.log("gemstone_specs video columns:");
  console.table(r1.rows);

  const r2 = await pool.query(`
    SELECT cloudinary_videos 
    FROM gemstone_specs 
    WHERE cloudinary_videos IS NOT NULL 
    LIMIT 1
  `);
  console.log("\nSample data from gemstone_specs:");
  console.log(JSON.stringify(r2.rows, null, 2));

  process.exit(0);
}

main().catch(console.error);
