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

async function restoreFolders() {
  console.log("Connecting to Database...");
  await client.connect();

  console.log("Fetching all videos from Supabase...");
  const result = await client.query(`SELECT collection_slug, shape, color, quality, cloudinary_videos FROM gemstone_specs WHERE cloudinary_videos IS NOT NULL`);
  
  let success = 0;
  let fail = 0;

  for (const row of result.rows) {
    if (!row.cloudinary_videos) continue;
    
    // Construct the folder path based on the database row!
    const gemstone = toTitleCase(row.collection_slug);
    const shape = toTitleCase(row.shape);
    const color = row.color ? toTitleCase(row.color) : null;
    const grade = row.quality;

    let targetFolder = `Gemstone Videos/${gemstone}/${shape}`;
    if (color && color.toLowerCase() !== 'null') {
      targetFolder += `/${color}`;
    }
    targetFolder += `/${grade}`;
    
    // Some folders might use exact strings that are slightly different, e.g. 'Lab Grown' vs 'Lab'. 
    // Let's print the folder to verify.
    // console.log("Target Folder:", targetFolder);

    for (const video of row.cloudinary_videos) {
      const url = video.video_url;
      // Extract the filename from the URL, e.g. IMG_0215_xxwdrr.mov
      const filenameMatch = url.match(/\/v[0-9]+\/(.*?)\.mov$/i);
      if (filenameMatch) {
        let publicId = filenameMatch[1];
        // The script saved them as _mp4
        const newPublicId = publicId + '_mp4';

        try {
          console.log(`Restoring ${newPublicId} -> ${targetFolder}`);
          await cloudinary.api.update(newPublicId, {
            asset_folder: targetFolder,
            resource_type: "video"
          });
          success++;
        } catch (err) {
          console.error(`❌ Failed to move ${newPublicId}:`, err.message);
          fail++;
        }
      }
    }
  }

  console.log(`\n🎉 Restore Complete! Moved: ${success}, Failed: ${fail}`);
  await client.end();
}

restoreFolders();
