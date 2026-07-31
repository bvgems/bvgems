import { v2 as cloudinary } from 'cloudinary';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
cloudinary.config({
  cloud_name: url.hostname,
  api_key: url.username,
  api_secret: url.password,
  secure: true
});

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

function toTitleCase(str) {
  if (!str) return null;
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function restoreRootFolders() {
  console.log("Connecting to Database...");
  await client.connect();

  console.log("Fetching root videos from Cloudinary...");
  const searchAPI = cloudinary.search.expression('resource_type:video AND folder:""').max_results(500);
  const result = await searchAPI.execute();
  const rootVideos = result.resources.filter(v => v.public_id.endsWith('_mp4'));
  
  console.log(`Found ${rootVideos.length} gemstone videos in root. Mapping...`);

  const dbResult = await client.query(`SELECT collection_slug, shape, color, quality, cloudinary_videos FROM gemstone_specs WHERE cloudinary_videos IS NOT NULL`);
  
  for (const video of rootVideos) {
    const publicId = video.public_id; // e.g. IMG_0792_v4cjhf_mp4
    const originalFilename = publicId.replace('_mp4', ''); // e.g. IMG_0792_v4cjhf
    
    // Find the row in DB
    let targetRow = null;
    for (const row of dbResult.rows) {
      if (row.cloudinary_videos) {
        for (const dbVideo of row.cloudinary_videos) {
          if (dbVideo.video_url && dbVideo.video_url.includes(originalFilename)) {
            targetRow = row;
            break;
          }
        }
      }
      if (targetRow) break;
    }

    if (targetRow) {
      const gemstone = toTitleCase(targetRow.collection_slug);
      const shape = toTitleCase(targetRow.shape);
      const color = targetRow.color ? toTitleCase(targetRow.color) : null;
      const grade = targetRow.quality;

      let targetFolder = `Gemstone Videos/${gemstone}/${shape}`;
      if (gemstone !== 'Alexandrite' && color && color.toLowerCase() !== 'null') {
        targetFolder += `/${color}`;
      }
      targetFolder += `/${grade}`;

      console.log(`Moving ${publicId} -> ${targetFolder}`);
      try {
        await cloudinary.api.update(publicId, {
          asset_folder: targetFolder,
          resource_type: "video"
        });
      } catch (err) {
        console.error(`❌ Failed to move ${publicId}:`, err.message);
      }
    } else {
      console.log(`⚠️  Could not find database row for ${publicId}`);
    }
  }

  await client.end();
}

restoreRootFolders();
