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

async function replaceVideos() {
  console.log("Fetching all videos from Cloudinary 'Gemstone Videos' folder...");
  
  let allVideos = [];
  let nextCursor = null;

  try {
    do {
      const searchAPI = cloudinary.search
        .expression('folder:"Gemstone Videos/*" AND resource_type:video')
        .max_results(500);

      if (nextCursor) {
        searchAPI.next_cursor(nextCursor);
      }

      const result = await searchAPI.execute();
      allVideos = allVideos.concat(result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log(`Found ${allVideos.length} videos. Processing safe replacement...`);

    let successCount = 0;
    let skipCount = 0;

    for (const video of allVideos) {
      if (video.format !== 'mov') {
        console.log(`⏭️  Skipping (already not a MOV): ${video.public_id}`);
        skipCount++;
        continue;
      }

      console.log(`\n🔄 Replacing: ${video.public_id}`);
      
      // Since we already pre-generated highly optimized MP4s, we will upload THAT specific URL!
      // This means the upload is incredibly fast and pre-compressed.
      const optimizedMp4Url = video.secure_url.replace('/upload/', '/upload/q_auto,vc_auto/').replace(/\.mov$/i, '.mp4');
      
      // We will append _mp4 to the public_id to prevent any conflicts.
      const newPublicId = video.public_id + '_mp4';

      try {
        console.log(`   ⬆️  Uploading new Master MP4...`);
        const uploadResult = await cloudinary.uploader.upload(optimizedMp4Url, {
          resource_type: "video",
          public_id: newPublicId,
          // Extract the folder from the public_id
          folder: video.public_id.substring(0, video.public_id.lastIndexOf('/'))
        });

        if (uploadResult && uploadResult.secure_url) {
          console.log(`   ✅ Successfully created new MP4: ${uploadResult.public_id}`);
          console.log(`   🗑️  Safely deleting old MOV file...`);
          
          await cloudinary.uploader.destroy(video.public_id, { resource_type: 'video' });
          console.log(`   ✅ Old MOV deleted.`);
          successCount++;
        } else {
          throw new Error("Upload succeeded but returned no secure_url. Aborting deletion to be safe.");
        }
      } catch (err) {
        console.error(`   ❌ Failed to process ${video.public_id}. MOV was NOT deleted to ensure no data loss.`, err.message);
      }
    }

    console.log(`\n🎉 Process Complete!`);
    console.log(`Successfully replaced: ${successCount}`);
    console.log(`Skipped: ${skipCount}`);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

replaceVideos();
