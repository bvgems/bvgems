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

const ASSETS_ROOT = "/Users/meetpatel/Desktop/BV/Oct19/BV_Gems_Individual_Shape_Assets";
const MANIFEST_PATH = path.join(ASSETS_ROOT, "manifest.csv");
const CACHE_PATH = path.resolve("./scripts/uploaded_shapes_cache.json");

// Read Cache if exists
let cache = {};
if (fs.existsSync(CACHE_PATH)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    console.log(`📦 Loaded existing cache with ${Object.keys(cache).length} entries.`);
  } catch (err) {
    console.warn("⚠️ Could not parse cache, starting fresh.");
  }
}

function saveCache() {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
}

async function uploadSingleAsset(asset) {
  const fullLocalPath = path.join(ASSETS_ROOT, asset.asset_path);
  if (!fs.existsSync(fullLocalPath)) {
    throw new Error(`File not found: ${fullLocalPath}`);
  }

  // Folder: Gemstone Shapes / Category / Color / Quality
  // Clean special characters for folder naming
  const cleanColor = asset.color.replace(/\s*-\s*/g, '-').replace(/\s+/g, '_');
  const cleanQuality = asset.quality.replace(/\s+/g, '_');
  const folder = `Gemstone Shapes/${asset.category}/${cleanColor}/${cleanQuality}`;
  const publicId = asset.filename.replace(/\.png$/i, '');

  const result = await cloudinary.uploader.upload(fullLocalPath, {
    folder: folder,
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    tags: ["representative_gemstone_shape", asset.category, asset.shape, asset.quality]
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    category: asset.category,
    color: asset.color,
    type: asset.type,
    quality: asset.quality,
    shape: asset.shape,
    uploaded_at: new Date().toISOString()
  };
}

async function main() {
  console.log("==================================================");
  console.log("💎 Uploading Representative Shape Assets to Cloudinary");
  console.log("==================================================\n");

  const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf-8').trim();
  const lines = manifestContent.split('\n');
  const header = lines[0].split(',').map(h => h.trim());

  const assets = lines.slice(1).map(line => {
    const parts = line.split(',');
    return {
      asset_path: parts[0]?.trim(),
      filename: parts[1]?.trim(),
      category: parts[2]?.trim(),
      color: parts[3]?.trim(),
      type: parts[4]?.trim(),
      quality: parts[5]?.trim(),
      shape: parts[6]?.trim()
    };
  }).filter(a => a.asset_path && a.filename);

  console.log(`Total assets in manifest: ${assets.length}`);

  const toUpload = assets.filter(a => !cache[a.asset_path]?.secure_url);
  console.log(`Assets remaining to upload: ${toUpload.length}\n`);

  if (toUpload.length === 0) {
    console.log("🎉 All assets are already uploaded to Cloudinary!");
    return;
  }

  const CONCURRENCY = 4;
  let completed = 0;
  let errors = 0;

  for (let i = 0; i < toUpload.length; i += CONCURRENCY) {
    const chunk = toUpload.slice(i, i + CONCURRENCY);

    await Promise.all(
      chunk.map(async (asset) => {
        try {
          const res = await uploadSingleAsset(asset);
          cache[asset.asset_path] = res;
          completed++;
          console.log(`[${completed + (assets.length - toUpload.length)}/${assets.length}] ✅ Uploaded: ${asset.category} > ${asset.shape} (${asset.quality})`);
        } catch (err) {
          errors++;
          console.error(`❌ Failed: ${asset.asset_path}:`, err.message);
        }
      })
    );

    // Save cache after every chunk
    saveCache();

    // Small delay to be polite to Cloudinary API
    await new Promise(r => setTimeout(r, 150));
  }

  console.log("\n==================================================");
  console.log(`🎉 Upload batch complete! Successfully uploaded: ${completed}, Errors: ${errors}`);
  console.log(`Total in cache: ${Object.keys(cache).length} / ${assets.length}`);
  console.log("==================================================");
}

main().catch(console.error);
