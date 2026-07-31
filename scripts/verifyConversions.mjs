import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
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
} else {
  console.error("❌ Cloudinary credentials not found.");
  process.exit(1);
}

async function verifyAllConversions() {
  console.log("Fetching all videos from Cloudinary 'Gemstone Videos' folder...");
  
  let allVideos = [];
  let nextCursor = null;

  try {
    do {
      const searchAPI = cloudinary.search
        .expression('folder:"Gemstone Videos/*" AND resource_type:video')
        .sort_by('public_id', 'asc')
        .max_results(500);

      if (nextCursor) {
        searchAPI.next_cursor(nextCursor);
      }

      const result = await searchAPI.execute();
      allVideos = allVideos.concat(result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log(`Found ${allVideos.length} videos. Verifying MP4 conversions...\n`);

    let completed = 0;
    let pending = 0;

    for (const video of allVideos) {
      try {
        // Fetch full details of the resource to see derived assets
        const details = await cloudinary.api.resource(video.public_id, { resource_type: 'video' });
        
        const hasMp4 = details.derived && details.derived.some(d => d.format === 'mp4' || (d.transformation && d.transformation.includes('mp4')));

        if (hasMp4) {
          completed++;
        } else {
          pending++;
          console.log(`⏳ Still processing: ${video.public_id}`);
        }
      } catch (err) {
        console.error(`❌ Error checking: ${video.public_id}`, err.message);
      }
    }

    console.log(`\n🎉 Verification Complete!`);
    console.log(`✅ Fully Converted to MP4: ${completed}`);
    if (pending > 0) {
      console.log(`⏳ Still Processing in Background: ${pending}`);
    } else {
      console.log(`🚀 ALL VIDEOS ARE 100% READY!`);
    }

  } catch (error) {
    console.error("❌ Error fetching videos:", error);
  }
}

verifyAllConversions();
