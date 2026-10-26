import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("❌ Cloudinary credentials not found in .env file.");
  process.exit(1);
}

if (process.env.CLOUDINARY_URL) {
  const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true
  });
}

const TOPAZ_ROOT = "/Users/meetpatel/Desktop/BV/BV_Gems_Topaz_AA_Images";
const ASSET_MAP_PATH = path.join(TOPAZ_ROOT, "asset-map.json");
const OUTPUT_MAP_PATH = path.resolve("./scripts/topaz_cloudinary_map.json");

const shapeMap = {
  "cushion": "Cushion",
  "emerald-cut": "Emerald Cut",
  "heart": "Heart",
  "marquise": "Marquise",
  "oval": "Oval",
  "pear": "Pear",
  "princess-cut": "Princess Cut",
  "round": "Round",
  "straight-baguette": "Straight Baguette",
  "trillion": "Trillion"
};

const varietyMap = {
  "swiss-blue": { name: "Swiss Blue", folderColor: "Swiss_Blue" },
  "london-blue": { name: "London Blue", folderColor: "London_Blue" },
  "sky-blue": { name: "Sky Blue", folderColor: "Sky_Blue" }
};

async function main() {
  const assetMap = JSON.parse(fs.readFileSync(ASSET_MAP_PATH, 'utf-8'));
  console.log(`Loaded asset-map.json with ${assetMap.length} items.`);

  const resultMap = {};

  for (const item of assetMap) {
    const fullPath = path.join(TOPAZ_ROOT, item.asset_path);
    if (!fs.existsSync(fullPath)) {
      console.error(`File missing: ${fullPath}`);
      continue;
    }

    const variety = item.variety; // "Sky Blue", "Swiss Blue", "London Blue"
    const shape = item.shape; // "Round", "Oval", etc.
    const quality = "AA";

    const cleanFolderColor = variety.replace(/\s+/g, '_');
    const folder = `Gemstone Shapes/Topaz/${cleanFolderColor}/${quality}`;
    const filenameNoExt = path.basename(item.asset_path, '.png');
    // ensure public_id has natural in it to match standard schema: topaz-swiss-blue-natural-aa-round
    const publicId = filenameNoExt.replace(/-aa-/, '-natural-aa-');

    console.log(`Uploading ${variety} ${shape} (${item.asset_path})...`);
    const res = await cloudinary.uploader.upload(fullPath, {
      folder: folder,
      public_id: publicId,
      overwrite: true,
      resource_type: "image",
      tags: ["representative_gemstone_shape", "Topaz", shape, quality, variety]
    });

    const key = `${variety}::${shape}`;
    resultMap[key] = {
      variety,
      shape,
      quality,
      public_id: res.public_id,
      url: res.secure_url
    };
    console.log(`  -> ${res.secure_url}`);
  }

  fs.writeFileSync(OUTPUT_MAP_PATH, JSON.stringify(resultMap, null, 2), 'utf-8');
  console.log(`\n✅ Finished uploading ${Object.keys(resultMap).length} images. Saved map to ${OUTPUT_MAP_PATH}`);
}

main().catch(console.error);
