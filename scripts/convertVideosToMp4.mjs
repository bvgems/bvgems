import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') }); // Overrides if running inside bvgems

// Explicitly configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true
  });
} else if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("❌ Cloudinary credentials not found in .env file.");
  process.exit(1);
}

async function convertAllVideos() {
  console.log("Fetching all videos from Cloudinary 'Gemstone Videos' folder...");
  
  let allVideos = [];
  let nextCursor = null;

  try {
    do {
      const searchAPI = cloudinary.search
        .expression('folder:"Gemstone Videos/*" AND resource_type:video')
        .sort_by('public_id', 'asc')
        .max_results(500); // 500 is the absolute max Cloudinary allows per page

      if (nextCursor) {
        searchAPI.next_cursor(nextCursor);
      }

      const result = await searchAPI.execute();
      allVideos = allVideos.concat(result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log(`Found ${allVideos.length} videos inside 'Gemstone Videos'. Starting conversion...`);

    let successCount = 0;
    let failCount = 0;

    for (const video of allVideos) {
      console.log(`Processing: ${video.public_id}`);
      try {
        // Trigger an explicit eager transformation in the background
        await cloudinary.uploader.explicit(video.public_id, {
          type: "upload",
          resource_type: "video",
          eager: [
            { format: "mp4", video_codec: "auto", quality: "auto" }
          ],
          eager_async: true
        });
        successCount++;
        console.log(`✅ Background MP4 conversion triggered for: ${video.public_id}`);
      } catch (err) {
        failCount++;
        console.error(`❌ Failed to trigger conversion for: ${video.public_id}`, err.message || err);
      }
    }

    console.log(`\n🎉 Process Complete!`);
    console.log(`Successfully queued: ${successCount}`);
    console.log(`Failed to queue: ${failCount}`);
    console.log(`Cloudinary is now converting these videos in the background. It may take 5-10 minutes to process all of them.`);

  } catch (error) {
    console.error("❌ Error fetching videos from Cloudinary:", error);
  }
}

convertAllVideos();
