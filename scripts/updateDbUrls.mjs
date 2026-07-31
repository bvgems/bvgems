import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

async function updateDbUrls() {
  console.log("Connecting to Database...");
  await client.connect();

  const result = await client.query(`SELECT id, collection_slug, shape, color, quality, cloudinary_videos FROM gemstone_specs WHERE cloudinary_videos IS NOT NULL`);
  
  let updatedCount = 0;

  for (const row of result.rows) {
    if (!row.cloudinary_videos) continue;
    
    let changed = false;
    const newVideos = row.cloudinary_videos.map(video => {
      let url = video.video_url;
      if (url.includes('.mov')) {
        // Remove the version number (e.g. /v1234567/) and change .mov to _mp4.mp4
        url = url.replace(/\/v\d+\//, '/').replace(/\.mov$/i, '_mp4.mp4');
        
        // Also remove any url optimizations since they are native mp4s now
        // e.g. remove /upload/vc_auto,q_auto/ or /upload/q_auto,vc_auto/
        url = url.replace(/\/upload\/(.*?)\//, '/upload/');

        changed = true;
      }
      return {
        ...video,
        video_url: url,
        file_extension: 'mp4'
      };
    });

    if (changed) {
      await client.query(`UPDATE gemstone_specs SET cloudinary_videos = $1 WHERE id = $2`, [JSON.stringify(newVideos), row.id]);
      updatedCount++;
    }
  }

  console.log(`\n🎉 DB Rewrite Complete! Updated ${updatedCount} gemstone records.`);
  await client.end();
}

updateDbUrls();
