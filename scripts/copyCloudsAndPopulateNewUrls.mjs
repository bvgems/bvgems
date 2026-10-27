import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

if (process.env.CLOUDINARY_URL) {
  const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true
  });
} else {
  console.error("❌ CLOUDINARY_URL missing in .env");
  process.exit(1);
}

const TABLE_PATH = path.resolve('./scripts/cloudinary_migration_table.json');
const CACHE_PATH = path.resolve('./scripts/cloudinary_migration_cache.json');

async function uploadWithRetry(entry, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await cloudinary.uploader.upload(entry.old_url, {
        public_id: entry.public_id,
        resource_type: entry.resource_type,
        overwrite: true
      });
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }
}

async function main() {
  console.log("==================================================");
  console.log("☁️ Step 2: Copying Assets from dabdvgxd4 -> oko8ywzn");
  console.log("   Preserving 100% Exact Folder Structure & Public IDs");
  console.log("==================================================\n");

  const table = JSON.parse(fs.readFileSync(TABLE_PATH, 'utf8'));
  let cache = {};
  if (fs.existsSync(CACHE_PATH)) {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
  }

  let completed = 0;
  let skippedFromCache = 0;
  let failed = [];
  const total = table.length;

  const CONCURRENCY = 15;
  let index = 0;

  async function worker() {
    while (true) {
      const currentIdx = index++;
      if (currentIdx >= total) break;

      const entry = table[currentIdx];

      // Check cache
      if (cache[entry.old_url] && cache[entry.old_url].new_url) {
        entry.new_url = cache[entry.old_url].new_url;
        entry.new_public_id = cache[entry.old_url].new_public_id;
        completed++;
        skippedFromCache++;
        continue;
      }

      try {
        const res = await uploadWithRetry(entry);
        entry.new_url = res.secure_url;
        entry.new_public_id = res.public_id;

        if (res.public_id !== entry.public_id) {
          console.warn(`⚠️ Public ID mismatch: expected "${entry.public_id}", got "${res.public_id}"`);
        }

        cache[entry.old_url] = {
          old_url: entry.old_url,
          new_url: res.secure_url,
          new_public_id: res.public_id,
          resource_type: entry.resource_type,
          folder: entry.folder,
          migrated_at: new Date().toISOString()
        };

        completed++;
        if (completed % 50 === 0 || completed === total) {
          console.log(`   ✅ Progress: ${completed}/${total} assets migrated (${skippedFromCache} from cache)...`);
          fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
          fs.writeFileSync(TABLE_PATH, JSON.stringify(table, null, 2), 'utf8');
        }
      } catch (err) {
        console.error(`❌ Failed to migrate ${entry.old_url}:`, err.message || err);
        failed.push({ old_url: entry.old_url, error: err.message || String(err) });
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  // Final save
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
  fs.writeFileSync(TABLE_PATH, JSON.stringify(table, null, 2), 'utf8');

  console.log("\n==================================================");
  console.log(`🎉 Asset Migration Summary:`);
  console.log(`   - Total Assets Processed: ${total}`);
  console.log(`   - Successfully Migrated:  ${completed}`);
  console.log(`   - Failed:                 ${failed.length}`);
  if (failed.length > 0) {
    console.log("Failed entries:", failed);
  }
  console.log("==================================================");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
