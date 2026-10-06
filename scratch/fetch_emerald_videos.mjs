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
    SELECT id, collection_slug, shape, quality, type, size, cloudinary_videos 
    FROM gemstone_specs 
    WHERE collection_slug ILIKE '%emerald%' 
      AND cloudinary_videos IS NOT NULL 
      AND jsonb_typeof(cloudinary_videos) = 'array'
      AND jsonb_array_length(cloudinary_videos) > 0
  `);
  console.log("Total emerald with videos:", r1.rows.length);
  const shapes = [...new Set(r1.rows.map(r => r.shape))];
  console.log("Shapes with videos:", shapes);
  
  if (shapes.length > 0) {
     console.log("\nSample videos for shape:", shapes[0]);
     const sample = r1.rows.filter(r => r.shape === shapes[0]).slice(0, 2);
     console.log(JSON.stringify(sample, null, 2));
  }
  process.exit(0);
}

main().catch(console.error);
