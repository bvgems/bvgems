import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("❌ Cloudinary credentials not found in .env file.");
  process.exit(1);
}

// Explicitly configure Cloudinary since imports evaluate before dotenv in ES modules
if (process.env.CLOUDINARY_URL) {
  const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true
  });
}

// ---------------------------------------------------------
// EDIT THESE ARRAYS BASED ON YOUR ACTUAL REQUIREMENTS
// ---------------------------------------------------------
// Gemstones that don't need color in the folder structure

const NON_SAPPHIRE_GEMSTONES = [
  "Alexandrite",
  "Emerald",
  "Ruby",
  "Aquamarine",
  "Morganite",
  "Amethyst",
  "Citrine",
  "Peridot",
  "Tanzanite",
  "Paraiba Tourmaline"
];

// All available shapes
const SHAPES = [
  "pear",
  "round",
  "oval",
  "cushion",
  "emeraldCut",
  "marquise",
  "princessCut",
  "trillion",
  "heart",
  "straightBaguette"
];

// Quality grades
const GRADES = ["A", "AA", "B", "Lab"]; // 'Lab' translates to 'grade-Lab'

// Sapphire colors
const SAPPHIRE_COLORS = [
  "pink",
  "blue",
  "yellow",
  "orange",
  "green",
  "purple",
];
// ---------------------------------------------------------

async function createFolders() {
  const foldersToCreate = [];

  // 1. Build paths for Non-Sapphire Gemstones
  for (const gem of NON_SAPPHIRE_GEMSTONES) {
    for (const shape of SHAPES) {
      for (const grade of GRADES) {
        foldersToCreate.push(`Gemstone Videos/${gem}/shape-${shape}/grade-${grade}`);
      }
    }
  }

  // 2. Build paths for Sapphire (which includes color)
  for (const color of SAPPHIRE_COLORS) {
    for (const shape of SHAPES) {
      for (const grade of GRADES) {
        foldersToCreate.push(`Gemstone Videos/Sapphire/${color}-${shape}/grade-${grade}`);
      }
    }
  }

  console.log(`Preparing to create ${foldersToCreate.length} folders in Cloudinary...`);

  // Cloudinary has rate limits for the Admin API.
  // We process them in sequence with a slight delay to be safe.

  const remainingFolders = foldersToCreate;
  console.log(`Attempting to create or verify ${remainingFolders.length} folders...`);

  let rateLimited = false;

  for (let i = 0; i < remainingFolders.length; i++) {
    if (rateLimited) break;

    const folder = remainingFolders[i];
    try {
      await cloudinary.api.create_folder(folder);
      console.log(`[${i + 1}/${foldersToCreate.length}] ✅ Created: ${folder}`);
    } catch (error) {
      const httpCode = error?.error?.http_code || error?.http_code;
      const message = error?.message || error?.error?.message || "";

      // 409 means the folder already exists
      if (httpCode === 409 || message.includes("already exists")) {
        console.log(`[${i + 1}/${foldersToCreate.length}] ⏭️  Exists: ${folder}`);
      } else if (httpCode === 420 || httpCode === 429 || message.includes("Rate limit")) {
        console.error(`\n❌ Cloudinary Admin API Rate Limit Exceeded at index ${i}.`);
        console.error(`You can only make 500 Admin API requests per hour.`);
        console.error(`Please wait an hour, then modify line 98 to: const remainingFolders = foldersToCreate.slice(${i});`);
        rateLimited = true;
      } else {
        console.error(`[${i + 1}/${foldersToCreate.length}] ❌ Error creating ${folder}:`, message || error);
      }
    }

    // Add a 150ms delay to avoid hitting rate limits
    await new Promise(r => setTimeout(r, 150));
  }

  console.log("🎉 Folder creation complete!");
}

createFolders();
