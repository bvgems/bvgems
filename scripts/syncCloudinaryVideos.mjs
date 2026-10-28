import { v2 as cloudinary } from 'cloudinary';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

const { Client } = pg;

// Load environment variables from parent or current directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

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
    secure: true,
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const client = new Client({
  user: process.env.DB_USER || process.env.PGUSER,
  host: process.env.DB_HOST || process.env.PGHOST,
  database: process.env.DB_NAME || process.env.PGDATABASE,
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
  port: Number(process.env.DB_PORT || process.env.PGPORT || 5432),
  ssl: { rejectUnauthorized: false },
});

const SHAPE_MAP = {
  round: 'Round',
  oval: 'Oval',
  pear: 'Pear',
  cushion: 'Cushion',
  heart: 'Heart',
  marquise: 'Marquise',
  trillion: 'Trillion',
  emeraldcut: 'Emerald Cut',
  'emerald cut': 'Emerald Cut',
  princesscut: 'Princess Cut',
  'princess cut': 'Princess Cut',
  straightbaguette: 'Straight Baguette',
  'straight baguette': 'Straight Baguette',
  baguette: 'Straight Baguette',
};

const GEMSTONE_MAP = {
  alexandrite: 'Alexandrite',
  amethyst: 'Amethyst',
  aquamarine: 'Aquamarine',
  citrine: 'Citrine',
  emerald: 'Emerald',
  morganite: 'Morganite',
  paraibatourmaline: 'Paraiba Tourmaline',
  'paraiba tourmaline': 'Paraiba Tourmaline',
  peridot: 'Peridot',
  ruby: 'Ruby',
  sapphire: 'Sapphire',
  tanzanite: 'Tanzanite',
  topaz: 'Topaz',
};

const COLOR_MAP = {
  blue: 'Blue',
  pink: 'Pink',
  yellow: 'Yellow',
  orange: 'Orange',
  green: 'Green',
  purple: 'Purple',
  white: 'White',
  red: 'Red',
  black: 'Black',
  teal: 'Teal',
  peach: 'Peach',
  brown: 'Brown',
  skyblue: 'Sky Blue',
  'sky_blue': 'Sky Blue',
  'sky blue': 'Sky Blue',
  swissblue: 'Swiss Blue',
  'swiss_blue': 'Swiss Blue',
  'swiss blue': 'Swiss Blue',
  londonblue: 'London Blue',
  'london_blue': 'London Blue',
  'london blue': 'London Blue',
};

function normalizeShape(raw) {
  if (!raw) return '';
  const key = raw.trim().toLowerCase();
  if (SHAPE_MAP[key]) return SHAPE_MAP[key];
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

function normalizeGemstone(raw) {
  if (!raw) return '';
  const key = raw.trim().toLowerCase();
  return GEMSTONE_MAP[key] || raw.trim();
}

function normalizeColor(raw) {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  return COLOR_MAP[key] || (raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase());
}

function normalizeGrade(raw) {
  if (!raw) return '';
  const cleaned = raw.replace(/^grade-/i, '').trim();
  if (cleaned.toLowerCase() === 'lab' || cleaned.toLowerCase() === 'lab grown' || cleaned.toLowerCase() === 'lab_grown') {
    return 'Lab Grown';
  }
  return cleaned.toUpperCase();
}

/**
 * Parses a folder path under "Gemstone Videos/..." into { gemstone, shape, color, grade }
 * Expected structure: "Gemstone Videos/{Gemstone}/{shape-or-color-shape}/grade-{Grade}"
 */
function parseGemstoneVideoFolder(folderPath) {
  if (!folderPath || !folderPath.startsWith('Gemstone Videos/')) return null;
  const parts = folderPath.split('/');
  if (parts.length < 4) return null;

  const gemstone = normalizeGemstone(parts[1]);
  const shapeColorRaw = parts[2];
  const grade = normalizeGrade(parts[3]);

  let shape = '';
  let color = null;

  if (shapeColorRaw.toLowerCase().startsWith('shape-')) {
    shape = normalizeShape(shapeColorRaw.slice('shape-'.length));
  } else {
    const dashIdx = shapeColorRaw.lastIndexOf('-');
    if (dashIdx !== -1) {
      const colorPart = shapeColorRaw.slice(0, dashIdx);
      const shapePart = shapeColorRaw.slice(dashIdx + 1);
      color = normalizeColor(colorPart);
      shape = normalizeShape(shapePart);
    } else {
      shape = normalizeShape(shapeColorRaw);
    }
  }

  if (!gemstone || !shape || !grade) return null;
  return { gemstone, shape, color, grade };
}

async function fetchAllGemstoneVideosFromCloudinary() {
  const allVideos = [];
  let nextCursor = undefined;

  // Use Admin API resources endpoint for real-time consistency (no search index lag)
  do {
    const res = await cloudinary.api.resources({
      resource_type: 'video',
      type: 'upload',
      max_results: 500,
      next_cursor: nextCursor,
      tags: true,
      context: true,
    });
    allVideos.push(...res.resources);
    nextCursor = res.next_cursor;
  } while (nextCursor);

  // Filter to videos whose UI folder (asset_folder), legacy folder, or public_id is inside "Gemstone Videos/"
  return allVideos.filter((v) => {
    const folderPath =
      v.asset_folder ||
      v.folder ||
      (v.public_id.includes('/') ? v.public_id.substring(0, v.public_id.lastIndexOf('/')) : '');
    return folderPath.startsWith('Gemstone Videos/');
  });
}

async function syncVideos() {
  try {
    console.log("==================================================");
    console.log("🎬 Syncing 'Gemstone Videos' (Cloudinary -> DB)");
    console.log("==================================================\n");

    await client.connect();
    console.log("✅ Connected to PostgreSQL database.");

    // 1. Load existing video metadata from DB so we preserve custom attributes (e.g., emerald_type, label)
    const existingRes = await client.query(`
      SELECT id, collection_slug, shape, color, quality, cloudinary_videos
      FROM gemstone_specs
      WHERE cloudinary_videos IS NOT NULL
        AND jsonb_typeof(cloudinary_videos) = 'array'
        AND jsonb_array_length(cloudinary_videos) > 0
    `);

    const existingVideoMetaByPublicId = new Map();
    const existingOrderByPublicId = new Map();
    let orderCounter = 0;
    for (const row of existingRes.rows) {
      for (const vid of row.cloudinary_videos) {
        if (vid && vid.public_id) {
          if (!existingOrderByPublicId.has(vid.public_id)) {
            existingOrderByPublicId.set(vid.public_id, orderCounter++);
          }
          if (!existingVideoMetaByPublicId.has(vid.public_id)) {
            const extra = {};
            for (const [k, val] of Object.entries(vid)) {
              if (k !== 'public_id' && k !== 'video_url') {
                extra[k] = val;
              }
            }
            existingVideoMetaByPublicId.set(vid.public_id, extra);
          }
        }
      }
    }

    // 2. Fetch all current videos inside "Gemstone Videos/*" from Cloudinary
    console.log("☁️  Fetching real-time videos from Cloudinary 'Gemstone Videos/*'...");
    const cldVideos = await fetchAllGemstoneVideosFromCloudinary();
    console.log(`   Found ${cldVideos.length} videos inside 'Gemstone Videos/*' in Cloudinary.\n`);

    // Keep existing relative order for existing videos; sort newly added videos by public_id
    cldVideos.sort((a, b) => {
      const idxA = existingOrderByPublicId.has(a.public_id) ? existingOrderByPublicId.get(a.public_id) : Number.MAX_SAFE_INTEGER;
      const idxB = existingOrderByPublicId.has(b.public_id) ? existingOrderByPublicId.get(b.public_id) : Number.MAX_SAFE_INTEGER;
      if (idxA !== idxB) return idxA - idxB;
      return a.public_id.localeCompare(b.public_id);
    });

    // 3. Group videos by (gemstone, shape, color, grade)
    const groupedVideos = new Map();

    for (const video of cldVideos) {
      const folderPath =
        video.asset_folder ||
        video.folder ||
        (video.public_id.includes('/') ? video.public_id.substring(0, video.public_id.lastIndexOf('/')) : '');

      const parsed = parseGemstoneVideoFolder(folderPath);
      if (!parsed) {
        console.warn(`⚠️  Skipping unrecognized folder structure: "${folderPath}" (public_id: ${video.public_id})`);
        continue;
      }

      const key = JSON.stringify(parsed);
      if (!groupedVideos.has(key)) {
        groupedVideos.set(key, []);
      }

      const preservedExtra = existingVideoMetaByPublicId.get(video.public_id) || {};
      const videoEntry = {
        public_id: video.public_id,
        video_url: video.secure_url,
        ...preservedExtra,
      };

      // Auto-detect emerald_type if not already set and filename/display_name mentions colombian or zambian
      if (parsed.gemstone.toLowerCase() === 'emerald' && !videoEntry.emerald_type) {
        const nameHint = `${video.display_name || ''} ${video.public_id || ''}`.toLowerCase();
        if (nameHint.includes('colombian')) videoEntry.emerald_type = 'colombian';
        else if (nameHint.includes('zambian')) videoEntry.emerald_type = 'zambian';
      }

      groupedVideos.get(key).push(videoEntry);
    }

    let groupsUpdated = 0;
    let groupsUnchanged = 0;
    let rowsUpdatedTotal = 0;
    const touchedRowIds = new Set();

    // 4. Add / Update / Partial-Remove for all active folders in Cloudinary
    for (const [keyStr, videoArray] of groupedVideos.entries()) {
      const { gemstone, shape, color, grade } = JSON.parse(keyStr);
      const videoJson = JSON.stringify(videoArray);

      let selectSql = '';
      let selectParams = [];

      if (color) {
        selectSql = `
          SELECT id, cloudinary_videos
          FROM gemstone_specs
          WHERE LOWER(TRIM(collection_slug)) = LOWER($1)
            AND LOWER(TRIM(shape)) = LOWER($2)
            AND LOWER(TRIM(color)) = LOWER($3)
            AND LOWER(TRIM(quality)) = LOWER($4)
        `;
        selectParams = [gemstone, shape, color, grade];
      } else {
        selectSql = `
          SELECT id, cloudinary_videos
          FROM gemstone_specs
          WHERE LOWER(TRIM(collection_slug)) = LOWER($1)
            AND LOWER(TRIM(shape)) = LOWER($2)
            AND LOWER(TRIM(quality)) = LOWER($3)
        `;
        selectParams = [gemstone, shape, grade];
      }

      const matchingRows = await client.query(selectSql, selectParams);
      if (matchingRows.rowCount === 0) {
        continue;
      }

      const idsToUpdate = [];
      for (const r of matchingRows.rows) {
        touchedRowIds.add(r.id);
        const currentStr = JSON.stringify(r.cloudinary_videos || []);
        if (currentStr !== videoJson) {
          idsToUpdate.push(r.id);
        }
      }

      if (idsToUpdate.length > 0) {
        await client.query(
          `UPDATE gemstone_specs SET cloudinary_videos = $1::jsonb WHERE id = ANY($2::int[])`,
          [videoJson, idsToUpdate]
        );
        groupsUpdated++;
        rowsUpdatedTotal += idsToUpdate.length;
        console.log(
          `🔄 Updated: ${gemstone} | ${shape}${color ? ` (${color})` : ''} | ${grade} -> ${videoArray.length} video(s) across ${idsToUpdate.length} row(s)`
        );
      } else {
        groupsUnchanged++;
      }
    }

    // 5. Handle full removal: any DB rows that previously had videos, whose Cloudinary folder now has 0 videos
    const clearedRowIds = [];
    const clearedDescriptions = new Set();

    for (const row of existingRes.rows) {
      if (!touchedRowIds.has(row.id)) {
        clearedRowIds.push(row.id);
        clearedDescriptions.add(`${row.collection_slug} | ${row.shape}${row.color ? ` (${row.color.trim()})` : ''} | ${row.quality}`);
      }
    }

    if (clearedRowIds.length > 0) {
      await client.query(
        `UPDATE gemstone_specs SET cloudinary_videos = '[]'::jsonb WHERE id = ANY($1::int[])`,
        [clearedRowIds]
      );
      for (const desc of clearedDescriptions) {
        console.log(`🗑️  Cleared (0 videos left in Cloudinary): ${desc}`);
      }
      rowsUpdatedTotal += clearedRowIds.length;
    }

    console.log("\n==================================================");
    console.log("🎉 Sync Complete!");
    console.log(`   - Stone Groups Updated:   ${groupsUpdated}`);
    console.log(`   - Stone Groups Cleared:   ${clearedDescriptions.size}`);
    console.log(`   - Stone Groups Unchanged: ${groupsUnchanged}`);
    console.log(`   - Total DB Rows Updated:  ${rowsUpdatedTotal}`);
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Error during video sync:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

syncVideos();
