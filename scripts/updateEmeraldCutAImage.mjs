import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import pg from 'pg';
import sharp from 'sharp';

dotenv.config();

// 1. Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true
  });
} else {
  console.error("❌ CLOUDINARY_URL not found in environment.");
  process.exit(1);
}

// 2. Configure PostgreSQL
const pool = new pg.Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.DB_USER || process.env.PGUSER,
        host: process.env.DB_HOST || process.env.PGHOST,
        database: process.env.DB_NAME || process.env.PGDATABASE,
        password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
        port: Number(process.env.DB_PORT || process.env.PGPORT) || 5432,
        ssl: { rejectUnauthorized: false }
      }
);

const SOURCE_IMAGE = "/Users/meetpatel/Desktop/BV/Vertical natural emerald step-cut gem.png";
const PUBLIC_ID = "Gemstone Shapes/Emerald/Green/A/emerald-green-natural-a-emerald-cut";
const ASSET_FOLDER = "Gemstone Shapes/Emerald/Green/A";
const CACHE_PATH = path.resolve("./scripts/uploaded_shapes_cache.json");
const REL_PATH = "emerald/green/a/emerald-green-natural-a-emerald-cut.png";

const LOCAL_ASSET_PATHS = [
  "/Users/meetpatel/Desktop/BV/BV_Gems_Individual_Shape_Assets 3/" + REL_PATH,
  "/Users/meetpatel/Desktop/BV/BV_Gems_Individual_Shape_Assets/" + REL_PATH,
  "/Users/meetpatel/Desktop/BV/BV_Gems_Individual_Shape_Assets 2/" + REL_PATH,
  "/Users/meetpatel/Desktop/BV/Oct19/BV_Gems_Individual_Shape_Assets/" + REL_PATH
];

async function processImage() {
  console.log(`🖼️ Processing source image: ${SOURCE_IMAGE}...`);
  if (!fs.existsSync(SOURCE_IMAGE)) {
    throw new Error(`Source file missing: ${SOURCE_IMAGE}`);
  }

  const img = sharp(SOURCE_IMAGE);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  // Transparent flood fill for outer background
  const out = Buffer.alloc(w * h * 4);
  const visited = new Uint8Array(w * h);
  const queue = [];

  const isBg = (x, y) => {
    const idx = (y * w + x) * 3;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    return r >= 242 && g >= 242 && b >= 242;
  };

  // Perimeter
  for (let x = 0; x < w; x++) {
    if (isBg(x, 0)) { queue.push(x, 0); visited[0 * w + x] = 1; }
    if (isBg(x, h - 1)) { queue.push(x, h - 1); visited[(h - 1) * w + x] = 1; }
  }
  for (let y = 0; y < h; y++) {
    if (isBg(0, y) && !visited[y * w + 0]) { queue.push(0, y); visited[y * w + 0] = 1; }
    if (isBg(w - 1, y) && !visited[y * w + (w - 1)]) { queue.push(w - 1, y); visited[y * w + (w - 1)] = 1; }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nidx = ny * w + nx;
        if (!visited[nidx] && isBg(nx, ny)) {
          visited[nidx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Populate RGBA
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const pIdx = y * w + x;
      const srcIdx = pIdx * 3;
      const destIdx = pIdx * 4;

      out[destIdx] = data[srcIdx];
      out[destIdx + 1] = data[srcIdx + 1];
      out[destIdx + 2] = data[srcIdx + 2];

      if (visited[pIdx]) {
        out[destIdx + 3] = 0;
      } else {
        out[destIdx + 3] = 255;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`   Bounding box of extracted gemstone: [${minX}, ${minY}] to [${maxX}, ${maxY}] (${maxX - minX + 1}x${maxY - minY + 1})`);

  // Crop tight and encode to PNG
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const transparentPng = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .png()
    .toBuffer();

  // Resize to height: 310px (matching standard catalog dimensions for emerald cut: ~250x308 in 800x800)
  const targetHeight = 310;
  const resizedGem = await sharp(transparentPng)
    .resize({ height: targetHeight, fit: 'inside' })
    .png()
    .toBuffer();

  const resizedMeta = await sharp(resizedGem).metadata();
  console.log(`   Resized gemstone dimensions: ${resizedMeta.width}x${resizedMeta.height}`);

  // Composite onto 800x800 transparent canvas centered
  const canvasSize = 800;
  const left = Math.round((canvasSize - resizedMeta.width) / 2);
  const top = Math.round((canvasSize - resizedMeta.height) / 2);

  const finalBuffer = await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{ input: resizedGem, left, top }])
  .png()
  .toBuffer();

  console.log(`   ✅ Created standardized 800x800 transparent canvas asset (gem centered at x=${left}, y=${top}).`);
  return finalBuffer;
}

async function main() {
  console.log("==================================================");
  console.log("💎 Replacing Emerald Emerald Cut A Grade Image");
  console.log("==================================================\n");

  // 1. Process image
  const finalImageBuffer = await processImage();
  const tempPath = '/tmp/emerald-green-natural-a-emerald-cut-vertical.png';
  fs.writeFileSync(tempPath, finalImageBuffer);

  // 2. Backup and sync local asset copies
  console.log("\n📁 Syncing to local asset directories...");
  for (const assetPath of LOCAL_ASSET_PATHS) {
    if (fs.existsSync(assetPath)) {
      const backupPath = assetPath.replace(/\.png$/, '_OLD_HORIZONTAL.png');
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(assetPath, backupPath);
        console.log(`   💾 Backed up old asset to: ${backupPath}`);
      }
    }
    fs.mkdirSync(path.dirname(assetPath), { recursive: true });
    fs.writeFileSync(assetPath, finalImageBuffer);
    console.log(`   ✅ Wrote new vertical asset to: ${assetPath}`);
  }

  // 3. Upload to Cloudinary
  console.log(`\n📤 Uploading to Cloudinary: ${PUBLIC_ID}...`);
  const uploadRes = await cloudinary.uploader.upload(tempPath, {
    public_id: PUBLIC_ID,
    asset_folder: ASSET_FOLDER,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
    tags: ["representative_gemstone_shape", "Emerald", "Emerald Cut", "A", "vertical_fix", "revision_6"]
  });

  console.log(`   ✅ Upload successful!`);
  console.log(`   Secure URL: ${uploadRes.secure_url}`);
  console.log(`   Public ID:  ${uploadRes.public_id}`);
  console.log(`   Format:     ${uploadRes.format}`);
  console.log(`   Dimensions: ${uploadRes.width}x${uploadRes.height}`);

  // 4. Update uploaded_shapes_cache.json
  if (fs.existsSync(CACHE_PATH)) {
    const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    cache[REL_PATH] = {
      secure_url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
      width: uploadRes.width,
      height: uploadRes.height,
      format: uploadRes.format,
      category: 'Emerald',
      color: 'Green',
      type: 'Natural',
      quality: 'A',
      shape: 'Emerald Cut',
      image_version: "vertical_1",
      uploaded_at: new Date().toISOString()
    };
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
    console.log(`\n💾 Saved updated entry to ${CACHE_PATH}`);
  }

  // 5. Update gemstone_specs in database
  console.log("\n🗄️ Updating PostgreSQL database...");
  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE gemstone_specs
      SET image_url = $1
      WHERE LOWER(collection_slug) = 'emerald'
        AND LOWER(shape) = 'emerald cut'
        AND quality = 'A'
        AND (type = 'Natural' OR type IS NULL)
      RETURNING id, collection_slug, shape, quality, type, size, ct_weight, image_url;
    `;

    const dbRes = await client.query(updateQuery, [uploadRes.secure_url]);
    console.log(`   🎉 Total gemstone_specs rows updated: ${dbRes.rowCount}\n`);
    console.table(dbRes.rows);

    // 6. Verify image is accessible via HTTP 200
    console.log("\n🌐 Verifying new image URL availability...");
    const checkResp = await fetch(uploadRes.secure_url);
    if (checkResp.status === 200) {
      console.log(`   ✅ Image is live and returns HTTP 200 OK (${checkResp.headers.get('content-type')}, ${checkResp.headers.get('content-length')} bytes)`);
    } else {
      console.warn(`   ⚠️ Warning: Image returned HTTP ${checkResp.status}`);
    }
  } finally {
    client.release();
    await pool.end();
  }

  console.log("\n✨ Done! Emerald Cut A Grade image replacement complete.");
}

main().catch(err => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
