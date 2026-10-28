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

const PACK_DIR = '/Users/meetpatel/Desktop/BV/BV_Gems_Elongated_Cushion_Image_Pack';
const PACK_IMAGES_DIR = path.join(PACK_DIR, 'images');
const PACK_BACKUP_DIR = path.join(PACK_DIR, 'images_backup_raw');
const CSV_PATH = path.join(PACK_DIR, 'ASSET_MAP.csv');
const CACHE_PATH = path.resolve('./scripts/uploaded_shapes_cache.json');

const LOCAL_ASSET_ROOTS = [
  '/Users/meetpatel/Desktop/BV/BV_Gems_Individual_Shape_Assets 3',
  '/Users/meetpatel/Desktop/BV/BV_Gems_Individual_Shape_Assets',
  '/Users/meetpatel/Desktop/BV/BV_Gems_Individual_Shape_Assets 2',
  '/Users/meetpatel/Desktop/BV/Oct19/BV_Gems_Individual_Shape_Assets'
];

function parseCsvLine(line) {
  const parts = [];
  let cur = '', inQuotes = false;
  for (const ch of line) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ',' && !inQuotes) {
      parts.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  parts.push(cur.trim());
  return parts;
}

function findBotEdgeAtX(data, w, h, x, startY, minY) {
  for (let y = startY; y > minY; y--) {
    const i = (y * w + x) * 3;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = (r + g + b) / 3;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (lum >= 232) continue;

    const iUp = ((y - 2) * w + x) * 3;
    const rU = data[iUp], gU = data[iUp + 1], bU = data[iUp + 2];
    const lumU = (rU + gU + bU) / 3;
    const satU = Math.max(rU, gU, bU) - Math.min(rU, gU, bU);
    const dLum = lumU - lum;
    const dSat = satU - sat;

    const isShadow = (lum > 90) && (sat < 140) && (dLum >= -24 && dLum <= 1.2) && (dSat < 18);
    if (!isShadow) {
      return y - 2;
    }
  }
  return minY;
}

async function processStoneImage(inputPath) {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const ch = info.channels;

  // If already processed to 800x800 RGBA transparent canvas, read from backup if available
  const topY = new Int32Array(w).fill(-1);
  let minX = w, maxX = 0;
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < Math.floor(h * 0.6); y++) {
      const i = (y * w + x) * ch;
      if (Math.min(data[i], data[i + 1], data[i + 2]) < 240) {
        topY[x] = y;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        break;
      }
    }
  }

  const cx = Math.round((minX + maxX) / 2);
  const topCenter = topY[cx];
  const botArray = [];
  for (let dx = -60; dx <= 60; dx += 4) {
    botArray.push(findBotEdgeAtX(data, w, h, cx + dx, h - 20, Math.floor(h / 2)));
  }
  botArray.sort((a, b) => a - b);
  const botCenter = botArray[Math.floor(botArray.length / 2)];
  const cy = (topCenter + botCenter) / 2;
  const cyInt = Math.round(cy);

  const rowLeft = new Int32Array(h).fill(-1);
  const rowRight = new Int32Array(h).fill(-1);

  for (let y = topCenter; y <= cyInt; y++) {
    let l = -1, r = -1;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * ch;
      if (Math.min(data[i], data[i + 1], data[i + 2]) < 240) { l = x; break; }
    }
    for (let x = w - 1; x >= 0; x--) {
      const i = (y * w + x) * ch;
      if (Math.min(data[i], data[i + 1], data[i + 2]) < 240) { r = x; break; }
    }
    rowLeft[y] = l;
    rowRight[y] = r;
  }

  for (let y = topCenter + 1; y <= cyInt; y++) {
    if (rowLeft[y] === -1 || (rowLeft[y - 1] !== -1 && rowLeft[y] > rowLeft[y - 1])) rowLeft[y] = rowLeft[y - 1];
    if (rowRight[y] === -1 || (rowRight[y - 1] !== -1 && rowRight[y] < rowRight[y - 1])) rowRight[y] = rowRight[y - 1];
  }

  for (let y = cyInt + 1; y < h; y++) {
    const mirrorY = Math.round(2 * cy - y);
    if (mirrorY >= topCenter && mirrorY <= cyInt) {
      rowLeft[y] = rowLeft[mirrorY];
      rowRight[y] = rowRight[mirrorY];
    }
  }

  // Enforce convexity of topY[x] outward from cx
  for (let x = cx - 1; x >= minX; x--) {
    if (topY[x] === -1 || topY[x] < topY[x + 1]) topY[x] = topY[x + 1];
  }
  for (let x = cx + 1; x <= maxX; x++) {
    if (topY[x] === -1 || topY[x] < topY[x - 1]) topY[x] = topY[x - 1];
  }

  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const l = rowLeft[y], r = rowRight[y];
    if (l === -1 || r === -1 || l >= r) continue;
    for (let x = l; x <= r; x++) {
      const tY = topY[x] !== -1 ? topY[x] : topCenter;
      const bY = Math.round(2 * cy - tY);
      if (y < tY || y > bY) continue;

      const pIdx = y * w + x;
      const srcIdx = pIdx * ch;
      const dstIdx = pIdx * 4;
      out[dstIdx] = data[srcIdx];
      out[dstIdx + 1] = data[srcIdx + 1];
      out[dstIdx + 2] = data[srcIdx + 2];

      const distEdge = Math.min(x - l, r - x, y - tY, bY - y);
      out[dstIdx + 3] = distEdge === 0 ? 160 : 255;
    }
  }

  const minY = topCenter;
  const maxY = Math.round(2 * cy - topCenter);
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const wasHorizontal = cropW > cropH;

  let extracted = sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: minX, top: minY, width: cropW, height: cropH });

  // Rotate horizontal stones 90 degrees clockwise so all stones are vertical
  if (wasHorizontal) {
    extracted = extracted.rotate(90);
  }

  const rotatedBuf = await extracted.png().toBuffer();

  // Standardize to height: 320px inside an 800x800 transparent canvas
  const resizedGem = await sharp(rotatedBuf)
    .resize({ height: 320, fit: 'inside' })
    .png()
    .toBuffer();

  const meta = await sharp(resizedGem).metadata();
  const canvasSize = 800;
  const left = Math.round((canvasSize - meta.width) / 2);
  const top = Math.round((canvasSize - meta.height) / 2);

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

  return {
    buffer: finalBuffer,
    wasHorizontal,
    gemWidth: meta.width,
    gemHeight: meta.height
  };
}

async function main() {
  console.log("==================================================");
  console.log("💎 Processing & Uploading 30 Vertical Elongated Cushion Assets");
  console.log("==================================================\n");

  const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));

  // Build lookup map from existing cache entries
  const comboMap = new Map();
  for (const [relPath, entry] of Object.entries(cache)) {
    const key = `${entry.category.toLowerCase()}|${entry.color.replace(/\s*-\s*/g, '-').toLowerCase()}|${entry.quality.toLowerCase()}`;
    if (!comboMap.has(key) || entry.shape === 'Cushion') {
      comboMap.set(key, { relPath, entry });
    }
  }

  // Parse ASSET_MAP.csv
  const csvLines = fs.readFileSync(CSV_PATH, 'utf-8').trim().split(/\r?\n/).slice(1);
  console.log(`📋 Found ${csvLines.length} Elongated Cushion assets in ASSET_MAP.csv.\n`);

  fs.mkdirSync(PACK_BACKUP_DIR, { recursive: true });

  let rotatedCount = 0;
  let alreadyVerticalCount = 0;
  const uploadedItems = [];

  for (let idx = 0; idx < csvLines.length; idx++) {
    const [filename, gemstone, colorOrVariety, sourceType, quality] = parseCsvLine(csvLines[idx]);
    const key = `${gemstone.toLowerCase()}|${colorOrVariety.replace(/\s*-\s*/g, '-').toLowerCase()}|${quality.toLowerCase()}`;
    const match = comboMap.get(key);
    if (!match) {
      throw new Error(`No matching category/color/quality in cache for: ${key} (${filename})`);
    }

    const packImgPath = path.join(PACK_IMAGES_DIR, filename);
    const backupImgPath = path.join(PACK_BACKUP_DIR, filename);

    // Ensure raw backup exists before modifying packImgPath
    if (!fs.existsSync(backupImgPath)) {
      fs.copyFileSync(packImgPath, backupImgPath);
    }

    // Process from raw backup so re-runs are idempotent
    const { buffer, wasHorizontal, gemWidth, gemHeight } = await processStoneImage(backupImgPath);
    if (wasHorizontal) rotatedCount++;
    else alreadyVerticalCount++;

    // 1. Overwrite image in BV_Gems_Elongated_Cushion_Image_Pack/images with vertical standardized PNG
    fs.writeFileSync(packImgPath, buffer);

    // 2. Write to all local BV_Gems_Individual_Shape_Assets* directories
    const targetRelPath = match.relPath.replace(/-(cushion|oval)\.png$/, '-elongated-cushion.png');
    for (const rootDir of LOCAL_ASSET_ROOTS) {
      if (fs.existsSync(rootDir)) {
        const destPath = path.join(rootDir, targetRelPath);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, buffer);
      }
    }

    // 3. Upload to Cloudinary
    const targetPublicId = match.entry.public_id.replace(/-(cushion|oval)$/, '-elongated-cushion');
    const assetFolder = targetPublicId.split('/').slice(0, -1).join('/');

    const uploadRes = await cloudinary.uploader.upload(packImgPath, {
      public_id: targetPublicId,
      asset_folder: assetFolder,
      overwrite: true,
      invalidate: true,
      resource_type: 'image',
      tags: ['representative_gemstone_shape', match.entry.category, 'Elongated Cushion', match.entry.quality, 'vertical_standardized']
    });

    console.log(`[${idx + 1}/${csvLines.length}] ✅ ${filename} (${wasHorizontal ? 'Rotated 90° -> Vertical' : 'Already Vertical'}, gem=${gemWidth}x${gemHeight} on 800x800)`);
    console.log(`   -> ${uploadRes.secure_url}`);

    const newCacheEntry = {
      secure_url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
      width: uploadRes.width,
      height: uploadRes.height,
      format: uploadRes.format,
      category: match.entry.category,
      color: match.entry.color,
      type: match.entry.type,
      quality: match.entry.quality,
      shape: 'Elongated Cushion',
      uploaded_at: new Date().toISOString()
    };

    cache[targetRelPath] = newCacheEntry;
    uploadedItems.push({ relPath: targetRelPath, ...newCacheEntry });
  }

  // Save updated cache
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  console.log(`\n💾 Saved 30 new Elongated Cushion entries to ${CACHE_PATH}`);
  console.log(`   Rotated 90° to vertical: ${rotatedCount}, Already vertical: ${alreadyVerticalCount}`);

  // Update database rows for Elongated Cushion
  console.log("\n🗄️ Updating PostgreSQL gemstone_specs for 'Elongated Cushion' rows...");
  const client = await pool.connect();
  let totalDbUpdated = 0;

  try {
    await client.query('BEGIN');

    for (const item of uploadedItems) {
      const isLab = item.quality.toLowerCase().includes('lab') || (item.type && item.type.toLowerCase().includes('lab'));
      let query = '';
      let params = [];

      if (item.category.toLowerCase() === 'sapphire') {
        if (isLab) {
          query = `
            UPDATE gemstone_specs
            SET image_url = $1
            WHERE LOWER(collection_slug) = 'sapphire'
              AND LOWER(shape) = 'elongated cushion'
              AND LOWER(color) LIKE LOWER($2) || '%'
              AND (LOWER(quality) = 'lab grown' OR LOWER(type) LIKE '%lab%')
            RETURNING id, size, quality;
          `;
          params = [item.secure_url, item.color];
        } else {
          query = `
            UPDATE gemstone_specs
            SET image_url = $1
            WHERE LOWER(collection_slug) = 'sapphire'
              AND LOWER(shape) = 'elongated cushion'
              AND LOWER(color) LIKE LOWER($2) || '%'
              AND LOWER(quality) = LOWER($3)
              AND (LOWER(type) = 'natural' OR type IS NULL)
            RETURNING id, size, quality;
          `;
          params = [item.secure_url, item.color, item.quality];
        }
      } else {
        if (isLab) {
          query = `
            UPDATE gemstone_specs
            SET image_url = $1
            WHERE LOWER(collection_slug) = LOWER($2)
              AND LOWER(shape) = 'elongated cushion'
              AND (LOWER(quality) = 'lab grown' OR LOWER(type) LIKE '%lab%')
            RETURNING id, size, quality;
          `;
          params = [item.secure_url, item.category];
        } else {
          query = `
            UPDATE gemstone_specs
            SET image_url = $1
            WHERE LOWER(collection_slug) = LOWER($2)
              AND LOWER(shape) = 'elongated cushion'
              AND LOWER(quality) = LOWER($3)
              AND (LOWER(type) = 'natural' OR type IS NULL)
            RETURNING id, size, quality;
          `;
          params = [item.secure_url, item.category, item.quality];
        }
      }

      const res = await client.query(query, params);
      if (res.rowCount > 0) {
        totalDbUpdated += res.rowCount;
        console.log(`   Updated ${res.rowCount} DB rows for ${item.category} (${item.color}, ${item.quality}) Elongated Cushion -> ${item.secure_url}`);
      }
    }

    await client.query('COMMIT');
    console.log(`\n🎉 Total 'Elongated Cushion' rows updated in gemstone_specs: ${totalDbUpdated}`);

    const verifyRes = await client.query(`
      SELECT id, collection_slug, color, type, quality, shape, size, image_url
      FROM gemstone_specs
      WHERE shape = 'Elongated Cushion'
      ORDER BY collection_slug, quality, size;
    `);
    console.table(verifyRes.rows);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }

  console.log("\n✨ All 30 Elongated Cushion assets rotated to vertical, standardized, uploaded to Cloudinary, and linked in DB!");
}

main().catch(err => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
