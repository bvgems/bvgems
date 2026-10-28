import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';
import xlsx from 'xlsx';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const EXCEL_PATH = "/Users/meetpatel/Desktop/BV/shrey-bhai-AI-missingSizes-from-DB/newCopy of BV_Gems_Calibrated_Missing_Sizes_and_Weights.xlsx";

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 5432),
  ssl: { rejectUnauthorized: false }
});

function normalizeSize(str) {
  if (!str) return "";
  const s = String(str).trim();
  const m = s.match(/^(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)\s*(?:mm)?$/);
  if (m) {
    return `${parseFloat(m[1]).toFixed(2)} x ${parseFloat(m[2]).toFixed(2)} mm`;
  }
  const m1 = s.match(/^(\d+(?:\.\d+)?)\s*(?:mm)?$/);
  if (m1) {
    return `${parseFloat(m1[1]).toFixed(2)} mm`;
  }
  return s;
}

async function main() {
  console.log("==================================================");
  console.log("💎 Inserting Missing Sizes and Variant Gaps into DB");
  console.log("==================================================\n");

  const client = await pool.connect();

  try {
    // 1. Fetch all existing records and distinct valid combinations
    console.log("1. Inspecting existing gemstone_specs table...");
    const existingRes = await client.query(`
      SELECT id, collection_slug, shape, size, color, quality, type, cut, image_url, cloudinary_videos
      FROM gemstone_specs
    `);
    console.log(`   Found ${existingRes.rows.length} existing rows in gemstone_specs.`);

    const existingKeys = new Set();
    const supportedCombos = new Set();
    const templateMap = new Map();

    for (const r of existingRes.rows) {
      const gem = (r.collection_slug || "").trim().toLowerCase();
      const shape = (r.shape || "").trim().toLowerCase();
      const size = (r.size || "").trim().toLowerCase();
      const color = (r.color || "").trim().toLowerCase();
      const quality = (r.quality || "").trim().toLowerCase();
      const type = (r.type || "").trim().toLowerCase();

      existingKeys.add(`${gem}|${shape}|${size}|${color}|${quality}|${type}`);
      supportedCombos.add(`${gem}|${color}|${quality}|${type}`);

      const tKey = `${gem}|${shape}|${color}|${quality}|${type}`;
      if (!templateMap.has(tKey) && r.image_url) {
        templateMap.set(tKey, {
          cut: r.cut,
          image_url: r.image_url,
          cloudinary_videos: r.cloudinary_videos || []
        });
      }
    }

    // 2. Read Excel file
    console.log(`\n2. Reading Excel file from: ${EXCEL_PATH}`);
    const wb = xlsx.readFile(EXCEL_PATH);

    // Candidates from "Missing sizes"
    const wsMS = wb.Sheets["Missing sizes"];
    const dataMS = xlsx.utils.sheet_to_json(wsMS, { header: 1, range: 4 }).slice(1);
    const msCandidates = [];
    const msSkipped = [];

    for (const r of dataMS) {
      if (!r || !r[0]) continue;
      const gem = String(r[0] || "").trim();
      const type = String(r[1] || "").trim();
      const shape = String(r[2] || "").trim();
      const size = normalizeSize(r[3]);
      const colors = String(r[4] || "").split(",").map(c => c.trim()).filter(Boolean);
      const grades = String(r[5] || "").split(",").map(g => g.trim()).filter(Boolean);
      const ct_weight = r[6] != null && !isNaN(Number(r[6])) ? Number(r[6]) : null;

      for (const c of colors) {
        for (const g of grades) {
          const comboKey = `${gem.toLowerCase()}|${c.toLowerCase()}|${g.toLowerCase()}|${type.toLowerCase()}`;
          const existKey = `${gem.toLowerCase()}|${shape.toLowerCase()}|${size.toLowerCase()}|${c.toLowerCase()}|${g.toLowerCase()}|${type.toLowerCase()}`;

          if (existingKeys.has(existKey)) {
            continue; // already exists
          }

          if (!supportedCombos.has(comboKey)) {
            msSkipped.push({ gem, type, shape, size, color: c, quality: g, reason: "Quality not offered for this gem/color in DB" });
            continue;
          }

          msCandidates.push({
            source: "Missing sizes",
            collection_slug: gem,
            type,
            shape,
            size,
            color: c,
            quality: g,
            ct_weight
          });
        }
      }
    }

    // Candidates from "Variant gaps"
    const wsVG = wb.Sheets["Variant gaps"];
    const dataVG = xlsx.utils.sheet_to_json(wsVG, { header: 1, range: 4 }).slice(1);
    const vgCandidates = [];
    const vgSkipped = [];

    for (const r of dataVG) {
      if (!r || !r[0]) continue;
      const gem = String(r[0] || "").trim();
      const type = String(r[1] || "").trim();
      const color = String(r[2] || "").trim();
      const shape = String(r[3] || "").trim();
      const size = normalizeSize(r[4]);
      const grades = String(r[5] || "").split(",").map(g => g.trim()).filter(Boolean);
      const ct_weight = r[7] != null && !isNaN(Number(r[7])) ? Number(r[7]) : null;

      for (const g of grades) {
        const comboKey = `${gem.toLowerCase()}|${color.toLowerCase()}|${g.toLowerCase()}|${type.toLowerCase()}`;
        const existKey = `${gem.toLowerCase()}|${shape.toLowerCase()}|${size.toLowerCase()}|${color.toLowerCase()}|${g.toLowerCase()}|${type.toLowerCase()}`;

        if (existingKeys.has(existKey)) {
          continue;
        }

        if (!supportedCombos.has(comboKey)) {
          vgSkipped.push({ gem, type, shape, size, color, quality: g, reason: "Quality not offered for this gem/color in DB" });
          continue;
        }

        vgCandidates.push({
          source: "Variant gaps",
          collection_slug: gem,
          type,
          shape,
          size,
          color,
          quality: g,
          ct_weight
        });
      }
    }

    console.log(`   - Valid candidates from Missing sizes: ${msCandidates.length} (Skipped unsupported qualities: ${msSkipped.length})`);
    console.log(`   - Valid candidates from Variant gaps:  ${vgCandidates.length} (Skipped unsupported qualities: ${vgSkipped.length})`);

    const combinedCandidates = [...msCandidates, ...vgCandidates];
    console.log(`   - Total candidates to insert:         ${combinedCandidates.length}\n`);

    // 3. Begin Transaction
    console.log("3. Beginning Database Transaction...");
    await client.query("BEGIN");

    let insertedCount = 0;
    const insertedIds = [];

    const insertSql = `
      INSERT INTO gemstone_specs (
        collection_slug,
        shape,
        size,
        ct_weight,
        cut,
        quality,
        price,
        type,
        color,
        image_url,
        is_available,
        search_vector,
        cloudinary_videos
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, to_tsvector('english', $12), $13::jsonb
      )
      RETURNING id;
    `;

    for (const c of combinedCandidates) {
      const tKey = `${c.collection_slug.toLowerCase()}|${c.shape.toLowerCase()}|${c.color.toLowerCase()}|${c.quality.toLowerCase()}|${c.type.toLowerCase()}`;
      const t = templateMap.get(tKey) || {};

      const cut = t.cut || null;
      const imageUrl = t.image_url || null;
      const price = null; // Missing from local Excel file -> NULL as requested
      const isAvailable = true;
      const cloudinaryVideos = JSON.stringify(t.cloudinary_videos || []);
      const searchContent = `${c.collection_slug} ${c.shape} ${c.size} ${c.color} ${c.quality} ${c.type} ${cut || ''}`.trim();

      const values = [
        c.collection_slug,
        c.shape,
        c.size,
        c.ct_weight,
        cut,
        c.quality,
        price,
        c.type,
        c.color,
        imageUrl,
        isAvailable,
        searchContent,
        cloudinaryVideos
      ];

      const res = await client.query(insertSql, values);
      insertedIds.push(res.rows[0].id);
      insertedCount++;
    }

    await client.query("COMMIT");
    console.log(`✅ Transaction committed successfully! Inserted ${insertedCount} rows.`);

    // 4. Verify post-insertion count
    const postCount = await client.query(`SELECT count(*) FROM gemstone_specs`);
    console.log(`\n4. Database verification:`);
    console.log(`   - Total rows in gemstone_specs now: ${postCount.rows[0].count} (was ${existingRes.rows.length})`);
    console.log(`   - Net rows added:                    ${insertedCount}`);

    // Save summary log
    const logData = {
      timestamp: new Date().toISOString(),
      total_inserted: insertedCount,
      inserted_ids: insertedIds,
      from_missing_sizes: msCandidates.length,
      from_variant_gaps: vgCandidates.length,
      skipped_missing_sizes_unsupported_qualities: msSkipped.length,
      skipped_variant_gaps_unsupported_qualities: vgSkipped.length,
      columns_set_to_null: ["price"],
      columns_mapped_from_existing_templates: ["cut", "image_url", "cloudinary_videos"]
    };

    const LOG_PATH = "./scripts/missing_sizes_insertion_log.json";
    fs.writeFileSync(LOG_PATH, JSON.stringify(logData, null, 2), "utf8");
    console.log(`   - Full audit log saved to: ${LOG_PATH}`);

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error occurred, transaction rolled back!", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
