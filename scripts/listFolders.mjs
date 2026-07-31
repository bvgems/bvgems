import { v2 as cloudinary } from 'cloudinary';
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

async function listAllFolders() {
  try {
    let nextCursor = null;
    const folders = new Set();
    do {
      const searchAPI = cloudinary.search
        .expression('resource_type:video')
        .max_results(500);
      if (nextCursor) searchAPI.next_cursor(nextCursor);
      
      const result = await searchAPI.execute();
      result.resources.forEach(v => {
        folders.add(v.asset_folder || "(root)");
      });
      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log([...folders].sort().join('\n'));
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

listAllFolders();
