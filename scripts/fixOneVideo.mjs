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

async function fixOne() {
  try {
    // Try to move one of the videos back into its Gemstone folder using dynamic folders API
    console.log("Updating asset_folder for IMG_0215_xxwdrr_mp4...");
    const result = await cloudinary.api.update("IMG_0215_xxwdrr_mp4", {
      asset_folder: "Gemstone Videos/Alexandrite/Princess Cut/Lab Grown",
      resource_type: "video"
    });
    console.log("Success!", result.asset_folder);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

fixOne();
