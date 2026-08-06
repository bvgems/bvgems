import { v2 as cloudinary } from 'cloudinary';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (process.env.CLOUDINARY_URL) {
  const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true
  });
}

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

async function syncVideos() {
  try {
    console.log("Connecting to Database...");
    await client.connect();
    console.log("✅ Database connected.");

    console.log("Fetching videos from Cloudinary 'Gemstone Videos' folder using Admin API...");
    
    let allVideos = [];
    let nextCursor = null;

    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'Gemstone Videos/',
        resource_type: 'video',
        max_results: 500,
        next_cursor: nextCursor
      });
      allVideos = allVideos.concat(result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log(`Found ${allVideos.length} videos inside 'Gemstone Videos' folders in Cloudinary.`);

    const groupedVideos = {};

    for (const video of allVideos) {
      const public_id = video.public_id;
      const url = video.secure_url;
      
      const folderPath = video.folder || public_id.substring(0, public_id.lastIndexOf('/'));
      
      const parts = folderPath.split('/');
      if (parts.length < 4) continue;

      const gemstoneRaw = parts[1];
      const shapeColorRaw = parts[2];
      const gradeRaw = parts[3];

      let grade = gradeRaw.replace('grade-', '');
      if (grade.toLowerCase() === 'lab') grade = 'Lab Grown';

      let shape = '';
      let color = null;

      if (gemstoneRaw.toLowerCase() === 'sapphire') {
        const scParts = shapeColorRaw.split('-');
        if (scParts.length === 2) {
          color = capitalize(scParts[0]);
          shape = capitalize(scParts[1]);
        }
      } else {
        const sParts = shapeColorRaw.split('-');
        if (sParts.length === 2) {
          shape = capitalize(sParts[1]);
        }
      }
      
      const shapeMap = {
        'Emeraldcut': 'Emerald Cut',
        'Princesscut': 'Princess Cut',
        'Straightbaguette': 'Straight Baguette'
      };
      
      if (shapeMap[shape]) shape = shapeMap[shape];

      const key = JSON.stringify({ gemstoneRaw, shape, color, grade });
      if (!groupedVideos[key]) groupedVideos[key] = [];
      groupedVideos[key].push({ video_url: url, public_id: public_id });
    }

    for (const [keyStr, videoArray] of Object.entries(groupedVideos)) {
      const { gemstoneRaw, shape, color, grade } = JSON.parse(keyStr);

      console.log(`Processing -> Gemstone: ${gemstoneRaw}, Shape: ${shape}, Color: ${color}, Grade: ${grade} (${videoArray.length} videos)`);

      const videoJson = JSON.stringify(videoArray);
      let sql = '';
      let values = [];

      if (gemstoneRaw.toLowerCase() === 'sapphire') {
        sql = `
          UPDATE gemstone_specs 
          SET cloudinary_videos = $1::jsonb 
          WHERE LOWER(collection_slug) = LOWER($2) 
            AND shape = $3 
            AND color = $4 
            AND quality = $5
          RETURNING id;
        `;
        values = [videoJson, gemstoneRaw, shape, color, grade];
      } else {
        sql = `
          UPDATE gemstone_specs 
          SET cloudinary_videos = $1::jsonb 
          WHERE LOWER(collection_slug) = LOWER($2) 
            AND shape = $3 
            AND quality = $4
          RETURNING id;
        `;
        values = [videoJson, gemstoneRaw, shape, grade];
      }

      const res = await client.query(sql, values);
      if (res.rowCount > 0) {
        console.log(`✅ Successfully updated database for ${gemstoneRaw} ${shape} ${grade}`);
      } else {
        console.log(`⚠️ No matching row found in DB for Gemstone: ${gemstoneRaw}, Shape: ${shape}, Grade: ${grade}`);
      }
    }
    console.log("🎉 Sync complete!");
  } catch (error) {
    console.error("❌ Error syncing videos:", error);
  } finally {
    await client.end();
  }
}

syncVideos();
