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
    SELECT collection_slug, shape, quality, size, type, cloudinary_videos 
    FROM gemstone_specs 
    WHERE lower(collection_slug) = 'emerald' 
      AND cloudinary_videos IS NOT NULL 
      AND jsonb_array_length(cloudinary_videos) > 0
    ORDER BY shape, quality, size
  `;
  
  const result = await pool.query(query);
  
  console.log(`Found ${result.rows.length} rows with videos for emerald.\n`);
  
  // Group by shape, quality, type to avoid too much noise if there are many sizes with the same videos.
  // Actually, wait, they might be using different videos per size. Let's group by the actual video URLs
  // to avoid printing the exact same video link 100 times for 100 different sizes.
  
  const videoGroups = {};
  
  for (const row of result.rows) {
    const key = `${row.shape} | ${row.quality} | ${row.type}`;
    if (!videoGroups[key]) {
      videoGroups[key] = new Set();
    }
    
    for (const vid of row.cloudinary_videos) {
      if (vid.video_url) {
        videoGroups[key].add(vid.video_url);
      }
    }
  }
  
  for (const [key, urls] of Object.entries(videoGroups)) {
    if (urls.size > 0) {
      console.log(`=== ${key} ===`);
      for (const url of urls) {
        console.log(`- ${url}`);
      }
      console.log('');
    }
  }

  process.exit(0);
}

main().catch(console.error);
