import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
cloudinary.config({
  cloud_name: url.hostname,
  api_key: url.username,
  api_secret: url.password,
  secure: true
});

async function testDerivedUrl() {
  try {
    const searchAPI = cloudinary.search
      .expression('folder:"Gemstone Videos/*" AND resource_type:video')
      .max_results(1);
    
    const result = await searchAPI.execute();
    if (result.resources.length === 0) {
      console.log("No videos found.");
      return;
    }
    
    const video = result.resources[0];
    console.log(`Fetching details for: ${video.public_id}`);
    
    const details = await cloudinary.api.resource(video.public_id, { resource_type: 'video' });
    
    console.log(`Original URL: ${details.secure_url}`);
    
    if (details.derived && details.derived.length > 0) {
      console.log(`\nFound ${details.derived.length} derived assets!`);
      details.derived.forEach((d, i) => {
        console.log(`\n--- Derived Asset ${i + 1} ---`);
        console.log(`Format: ${d.format}`);
        console.log(`Transformation String: ${d.transformation}`);
        console.log(`Secure URL: ${d.secure_url}`);
      });
    } else {
      console.log("No derived assets found.");
    }
  } catch (error) {
    console.error("Error:", error.message || error);
  }
}

testDerivedUrl();
