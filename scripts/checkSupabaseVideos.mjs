import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

async function run() {
  console.log("Connecting to Supabase Database...");
  try {
    await client.connect();
    console.log("✅ Connected!\n");

    const result = await client.query(`
      SELECT collection_slug, shape, color, quality, cloudinary_videos 
      FROM gemstone_specs 
      WHERE cloudinary_videos IS NOT NULL 
      LIMIT 10
    `);

    if (result.rows.length === 0) {
      console.log("No videos found in database.");
      return;
    }

    console.log(`Checking ${result.rows.length} rows from database...`);
    
    for (const row of result.rows) {
      const name = `${row.collection_slug} ${row.shape} ${row.color || ''} ${row.quality}`.trim();
      const videos = row.cloudinary_videos;
      
      console.log(`\n💎 ${name}`);
      videos.forEach((vid, i) => {
        console.log(`   Video ${i + 1} URL: ${vid.video_url}`);
        if (vid.video_url.endsWith('.mp4')) {
          console.log(`   ✅ Confirmed: Extension is .mp4`);
        } else {
          console.log(`   ❌ Warning: Extension is NOT .mp4`);
        }
      });
    }

  } catch (err) {
    console.error("Database connection error", err);
  } finally {
    await client.end();
  }
}

run();
