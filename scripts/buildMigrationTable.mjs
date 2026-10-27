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

const URL_PATTERN = /^https:\/\/res\.cloudinary\.com\/dabdvgxd4\/(image|video)\/upload\/(?:v\d+\/)?(.+)\.([a-zA-Z0-9]+)$/;

async function main() {
  console.log("==================================================");
  console.log("📋 Step 1: Building Master URL Location & Asset Table");
  console.log("==================================================\n");

  const masterMap = new Map(); // old_url -> { old_url, resource_type, folder, public_id, format, new_url: null, locations: [] }

  function registerUrl(rawUrl, locationInfo) {
    if (!rawUrl || !rawUrl.includes("dabdvgxd4")) return;
    const cleanUrl = rawUrl.trim();
    if (!masterMap.has(cleanUrl)) {
      const m = cleanUrl.match(URL_PATTERN);
      if (!m) {
        throw new Error(`Unexpected Cloudinary URL format: ${cleanUrl}`);
      }
      const resource_type = m[1];
      const public_id = decodeURIComponent(m[2]);
      const format = m[3];
      const parts = public_id.split("/");
      const folder = parts.length > 1 ? parts.slice(0, -1).join("/") : "(root)";

      masterMap.set(cleanUrl, {
        old_url: cleanUrl,
        resource_type,
        folder,
        public_id,
        format,
        new_url: null,
        locations: []
      });
    }
    masterMap.get(cleanUrl).locations.push(locationInfo);
  }

  // 1. Scan gemstone_specs (image_url and cloudinary_videos)
  const specsRes = await pool.query(`
    SELECT id, collection_slug, shape, size, image_url, cloudinary_videos
    FROM gemstone_specs
    WHERE image_url LIKE '%dabdvgxd4%' OR cloudinary_videos::text LIKE '%dabdvgxd4%'
    ORDER BY id;
  `);
  for (const r of specsRes.rows) {
    if (r.image_url && r.image_url.includes("dabdvgxd4")) {
      registerUrl(r.image_url, {
        type: "database",
        table: "gemstone_specs",
        column: "image_url",
        row_id: r.id,
        meta: `${r.collection_slug} ${r.shape} ${r.size}`
      });
    }
    if (Array.isArray(r.cloudinary_videos)) {
      r.cloudinary_videos.forEach((v, idx) => {
        if (v && v.video_url && v.video_url.includes("dabdvgxd4")) {
          registerUrl(v.video_url, {
            type: "database_json",
            table: "gemstone_specs",
            column: "cloudinary_videos",
            row_id: r.id,
            array_index: idx,
            stored_public_id: v.public_id,
            meta: `${r.collection_slug} ${r.shape} ${r.size}`
          });
        }
      });
    }
  }

  // 2. Scan free_size_gemstones (image_url and video_urls)
  const freeRes = await pool.query(`
    SELECT id, lot_number, gemstone_type, image_url, video_urls
    FROM free_size_gemstones
    WHERE image_url LIKE '%dabdvgxd4%' OR video_urls::text LIKE '%dabdvgxd4%'
    ORDER BY id;
  `);
  for (const r of freeRes.rows) {
    if (r.image_url && r.image_url.includes("dabdvgxd4")) {
      registerUrl(r.image_url, {
        type: "database",
        table: "free_size_gemstones",
        column: "image_url",
        row_id: r.id,
        meta: `Lot ${r.lot_number} (${r.gemstone_type})`
      });
    }
    if (Array.isArray(r.video_urls)) {
      r.video_urls.forEach((v, idx) => {
        const u = typeof v === "string" ? v : v?.video_url || v?.url;
        if (u && u.includes("dabdvgxd4")) {
          registerUrl(u, {
            type: "database_json",
            table: "free_size_gemstones",
            column: "video_urls",
            row_id: r.id,
            array_index: idx,
            meta: `Lot ${r.lot_number} (${r.gemstone_type})`
          });
        }
      });
    }
  }

  // 3. Scan gemstone_images (image_url)
  const gemImgRes = await pool.query(`
    SELECT id, gemstone_id, image_url
    FROM gemstone_images
    WHERE image_url LIKE '%dabdvgxd4%'
    ORDER BY id;
  `);
  for (const r of gemImgRes.rows) {
    registerUrl(r.image_url, {
      type: "database",
      table: "gemstone_images",
      column: "image_url",
      row_id: r.id,
      meta: `gemstone_id=${r.gemstone_id}`
    });
  }

  // 4. Scan user_carts, user_recently_viewed, checkout_carts
  const urlExtractRegex = /https:\/\/res\.cloudinary\.com\/dabdvgxd4\/[^\s"'\]{}]+/g;
  for (const [tbl, pk, col] of [
    ["user_carts", "user_id", "cart"],
    ["user_recently_viewed", "user_id", "items"],
    ["checkout_carts", "id", "cart"]
  ]) {
    const res = await pool.query(`
      SELECT "${pk}" as pk, "${col}"::text as raw_json
      FROM "${tbl}"
      WHERE "${col}"::text LIKE '%dabdvgxd4%'
      ORDER BY "${pk}";
    `);
    for (const r of res.rows) {
      const matches = r.raw_json.match(urlExtractRegex) || [];
      for (const m of matches) {
        registerUrl(m, {
          type: "database_json_blob",
          table: tbl,
          pk_column: pk,
          row_id: r.pk,
          column: col
        });
      }
    }
  }

  // 5. Also include the 4 dynamic URLs in src/utils/constants.ts that only existed on dabdvgxd4
  const constantsDynamicAssets = [
    "https://res.cloudinary.com/dabdvgxd4/image/upload/v1756317899/RD_Z_emh9yw.jpg",
    "https://res.cloudinary.com/dabdvgxd4/image/upload/v1755717221/IMG_2131_zgoi6w.png",
    "https://res.cloudinary.com/dabdvgxd4/image/upload/v1756410867/IMG_2626-3_pju0li.png",
    "https://res.cloudinary.com/dabdvgxd4/image/upload/v1755880908/RD_AA_SRD00042208_p8ijmh.jpg"
  ];
  for (const u of constantsDynamicAssets) {
    registerUrl(u, {
      type: "codebase",
      file: "src/utils/constants.ts",
      note: "Dynamic NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME reference"
    });
  }

  const entries = Array.from(masterMap.values());
  const outPath = path.resolve("./scripts/cloudinary_migration_table.json");
  fs.writeFileSync(outPath, JSON.stringify(entries, null, 2), "utf8");

  const imgCount = entries.filter(e => e.resource_type === "image").length;
  const vidCount = entries.filter(e => e.resource_type === "video").length;
  const totalLocations = entries.reduce((acc, e) => acc + e.locations.length, 0);

  console.log(`✅ Master table saved to: ${outPath}`);
  console.log(`   - Total Unique Assets to Migrate: ${entries.length} (${imgCount} images, ${vidCount} videos)`);
  console.log(`   - Total Stored Locations Tracked: ${totalLocations}`);

  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
