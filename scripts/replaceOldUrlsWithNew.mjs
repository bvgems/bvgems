import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
});

const TABLE_PATH = path.resolve('./scripts/cloudinary_migration_table.json');

async function main() {
  console.log("==================================================");
  console.log("🔄 Step 3: Replacing All Old URLs with New URLs");
  console.log("==================================================\n");

  const table = JSON.parse(fs.readFileSync(TABLE_PATH, 'utf8'));

  // 1. Pre-flight verification of the Master Table
  const missingNewUrls = table.filter(e => !e.new_url || !e.new_url.startsWith('https://res.cloudinary.com/oko8ywzn/'));
  if (missingNewUrls.length > 0) {
    throw new Error(`Aborting! ${missingNewUrls.length} entries in master table are missing valid oko8ywzn new_url.`);
  }

  const folderMismatches = table.filter(e => e.new_public_id && e.new_public_id !== e.public_id);
  if (folderMismatches.length > 0) {
    throw new Error(`Aborting! ${folderMismatches.length} entries have public_id/folder mismatches.`);
  }

  console.log(`✅ Pre-flight passed: All ${table.length} assets have verified oko8ywzn URLs and 100% matching folder paths.\n`);

  const urlMap = new Map(); // old_url -> entry
  for (const entry of table) {
    urlMap.set(entry.old_url, entry);
  }

  const client = await pool.connect();

  try {
    // 2. Create safety backups of all 6 tables
    console.log("🛡️ Creating database safety backup tables...");
    const tablesToBackup = [
      "gemstone_specs",
      "free_size_gemstones",
      "gemstone_images",
      "user_carts",
      "user_recently_viewed",
      "checkout_carts"
    ];

    for (const tbl of tablesToBackup) {
      const backupName = `${tbl}_backup_20261027_cloud_mig`;
      await client.query(`DROP TABLE IF EXISTS "${backupName}"`);
      await client.query(`CREATE TABLE "${backupName}" AS SELECT * FROM "${tbl}"`);
      const cnt = await client.query(`SELECT count(*) FROM "${backupName}"`);
      console.log(`   ✅ Backup "${backupName}" created (${cnt.rows[0].count} rows)`);
    }

    await client.query("BEGIN");

    // 3. Replace in gemstone_specs.image_url
    let specsImgUpdated = 0;
    for (const entry of table) {
      for (const loc of entry.locations) {
        if (loc.table === "gemstone_specs" && loc.column === "image_url") {
          const res = await client.query(
            `UPDATE gemstone_specs SET image_url = $1 WHERE id = $2 AND image_url = $3`,
            [entry.new_url, loc.row_id, entry.old_url]
          );
          specsImgUpdated += res.rowCount;
        }
      }
    }
    console.log(`\n📌 gemstone_specs.image_url: updated ${specsImgUpdated} locations.`);

    // 4. Replace in gemstone_specs.cloudinary_videos
    const specsVideoRowIds = new Set();
    for (const entry of table) {
      for (const loc of entry.locations) {
        if (loc.table === "gemstone_specs" && loc.column === "cloudinary_videos") {
          specsVideoRowIds.add(loc.row_id);
        }
      }
    }

    let specsVidRowsUpdated = 0;
    let specsVidLinksReplaced = 0;
    for (const rowId of specsVideoRowIds) {
      const rowRes = await client.query(`SELECT cloudinary_videos FROM gemstone_specs WHERE id = $1`, [rowId]);
      if (rowRes.rows.length === 0) continue;
      const vids = rowRes.rows[0].cloudinary_videos;
      if (!Array.isArray(vids)) continue;

      let changed = false;
      const updatedVids = vids.map(v => {
        if (v && v.video_url && urlMap.has(v.video_url.trim())) {
          const mapped = urlMap.get(v.video_url.trim());
          changed = true;
          specsVidLinksReplaced++;
          return {
            ...v,
            video_url: mapped.new_url,
            public_id: mapped.public_id
          };
        }
        return v;
      });

      if (changed) {
        await client.query(
          `UPDATE gemstone_specs SET cloudinary_videos = $1::jsonb WHERE id = $2`,
          [JSON.stringify(updatedVids), rowId]
        );
        specsVidRowsUpdated++;
      }
    }
    console.log(`📌 gemstone_specs.cloudinary_videos: updated ${specsVidRowsUpdated} rows (${specsVidLinksReplaced} video links replaced).`);

    // 5. Replace in free_size_gemstones (image_url and video_urls)
    let freeImgUpdated = 0;
    const freeVidRowIds = new Set();
    for (const entry of table) {
      for (const loc of entry.locations) {
        if (loc.table === "free_size_gemstones" && loc.column === "image_url") {
          const res = await client.query(
            `UPDATE free_size_gemstones SET image_url = $1 WHERE id = $2 AND image_url = $3`,
            [entry.new_url, loc.row_id, entry.old_url]
          );
          freeImgUpdated += res.rowCount;
        } else if (loc.table === "free_size_gemstones" && loc.column === "video_urls") {
          freeVidRowIds.add(loc.row_id);
        }
      }
    }

    let freeVidRowsUpdated = 0;
    for (const rowId of freeVidRowIds) {
      const rowRes = await client.query(`SELECT video_urls FROM free_size_gemstones WHERE id = $1`, [rowId]);
      if (rowRes.rows.length === 0) continue;
      const vlist = rowRes.rows[0].video_urls;
      if (!Array.isArray(vlist)) continue;

      let changed = false;
      const updatedList = vlist.map(v => {
        if (typeof v === "string" && urlMap.has(v.trim())) {
          changed = true;
          return urlMap.get(v.trim()).new_url;
        } else if (v && typeof v === "object") {
          const u = v.video_url || v.url;
          if (u && urlMap.has(u.trim())) {
            changed = true;
            const mapped = urlMap.get(u.trim());
            return {
              ...v,
              ...(v.video_url ? { video_url: mapped.new_url } : {}),
              ...(v.url ? { url: mapped.new_url } : {})
            };
          }
        }
        return v;
      });

      if (changed) {
        await client.query(
          `UPDATE free_size_gemstones SET video_urls = $1 WHERE id = $2`,
          [updatedList, rowId]
        );
        freeVidRowsUpdated++;
      }
    }
    console.log(`📌 free_size_gemstones: updated ${freeImgUpdated} image_url rows and ${freeVidRowsUpdated} video_urls rows.`);

    // 6. Replace in gemstone_images.image_url
    let gemImagesUpdated = 0;
    for (const entry of table) {
      for (const loc of entry.locations) {
        if (loc.table === "gemstone_images" && loc.column === "image_url") {
          const res = await client.query(
            `UPDATE gemstone_images SET image_url = $1 WHERE id = $2 AND image_url = $3`,
            [entry.new_url, loc.row_id, entry.old_url]
          );
          gemImagesUpdated += res.rowCount;
        }
      }
    }
    console.log(`📌 gemstone_images.image_url: updated ${gemImagesUpdated} rows.`);

    // 7. Replace in user_carts, user_recently_viewed, checkout_carts
    for (const [tbl, pk, col] of [
      ["user_carts", "user_id", "cart"],
      ["user_recently_viewed", "user_id", "items"],
      ["checkout_carts", "id", "cart"]
    ]) {
      const rowIds = new Set();
      for (const entry of table) {
        for (const loc of entry.locations) {
          if (loc.table === tbl && loc.column === col) {
            rowIds.add(loc.row_id);
          }
        }
      }

      let tblUpdated = 0;
      for (const pkVal of rowIds) {
        const res = await client.query(`SELECT "${col}"::text as raw_text FROM "${tbl}" WHERE "${pk}" = $1`, [pkVal]);
        if (res.rows.length === 0) continue;
        let txt = res.rows[0].raw_text;
        let modified = false;

        for (const [oldUrl, entry] of urlMap.entries()) {
          if (txt.includes(oldUrl)) {
            txt = txt.split(oldUrl).join(entry.new_url);
            modified = true;
          }
        }

        if (modified) {
          await client.query(`UPDATE "${tbl}" SET "${col}" = $1::jsonb WHERE "${pk}" = $2`, [txt, pkVal]);
          tblUpdated++;
        }
      }
      console.log(`📌 ${tbl}.${col}: updated ${tblUpdated} rows.`);
    }

    await client.query("COMMIT");
    console.log("\n✅ All database replacements committed successfully!");

    // 8. Also update src/utils/constants.ts for the 4 dynamic paths if version changed
    const constantsPath = path.resolve("./src/utils/constants.ts");
    let constantsContent = fs.readFileSync(constantsPath, "utf8");
    let constantsReplacements = 0;
    for (const entry of table) {
      if (entry.locations.some(l => l.type === "codebase" && l.file === "src/utils/constants.ts")) {
        // Extract `image/upload/v.../filename` from old_url and new_url
        const oldSub = entry.old_url.split("res.cloudinary.com/dabdvgxd4/")[1];
        const newSub = entry.new_url.split("res.cloudinary.com/oko8ywzn/")[1];
        if (oldSub && newSub && constantsContent.includes(oldSub)) {
          constantsContent = constantsContent.split(oldSub).join(newSub);
          constantsReplacements++;
        }
      }
    }
    if (constantsReplacements > 0) {
      fs.writeFileSync(constantsPath, constantsContent, "utf8");
      console.log(`📌 src/utils/constants.ts: updated ${constantsReplacements} asset paths to new oko8ywzn versions.`);
    }

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Transaction rolled back due to error:", err);
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
