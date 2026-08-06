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

async function debug() {
  try {
    let nextCursor = null;
    let allVideos = [];
    do {
      const searchAPI = cloudinary.search
        .expression('resource_type:video AND folder:"Gemstone Videos/*"')
        .max_results(500);
      if (nextCursor) searchAPI.next_cursor(nextCursor);
      const result = await searchAPI.execute();
      allVideos = allVideos.concat(result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log(`Found ${allVideos.length} total videos`);
    for (const v of allVideos) {
      if (v.folder.includes('grade-A')) {
        console.log("Found grade-A video in results:", v.folder, v.public_id);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
debug();
