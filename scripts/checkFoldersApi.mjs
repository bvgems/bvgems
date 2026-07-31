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

async function checkFolders() {
  try {
    const root = await cloudinary.api.root_folders();
    console.log("Root Folders:", JSON.stringify(root.folders, null, 2));
    
    // Check inside Gemstone Videos
    if (root.folders.find(f => f.name === 'Gemstone Videos')) {
      const sub = await cloudinary.api.sub_folders('Gemstone Videos');
      console.log("\nSubfolders in Gemstone Videos:", JSON.stringify(sub.folders, null, 2));
      
      if (sub.folders.length > 0) {
        const subsub = await cloudinary.api.sub_folders(`Gemstone Videos/${sub.folders[0].name}`);
        console.log(`\nSubfolders in ${sub.folders[0].name}:`, JSON.stringify(subsub.folders, null, 2));
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

checkFolders();
