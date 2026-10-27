import fs from 'fs';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const newUrl = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
const NEW_CLOUD = {
  cloud_name: newUrl.hostname,
  api_key: newUrl.username,
  api_secret: newUrl.password,
  secure: true
};

const OLD_CLOUD = {
  cloud_name: 'dabdvgxd4',
  api_key: '455217358115358',
  api_secret: 'vBXStEERtMGnfEEjGI4BnxWsG5I',
  secure: true
};

async function fetchAllResources(cloudConfig) {
  cloudinary.config(cloudConfig);
  const all = [];
  for (const rt of ['image', 'video', 'raw']) {
    let nextCursor = undefined;
    do {
      try {
        const res = await cloudinary.api.resources({
          resource_type: rt,
          max_results: 500,
          next_cursor: nextCursor
        });
        all.push(...res.resources);
        nextCursor = res.next_cursor;
      } catch (e) {
        console.error(`Error fetching ${rt} from ${cloudConfig.cloud_name}:`, e.message);
        break;
      }
    } while (nextCursor);
  }
  return all;
}

async function main() {
  console.log("==================================================");
  console.log("📂 Syncing Full Media Library Folders & All Assets");
  console.log("   From: dabdvgxd4  --->  To: oko8ywzn");
  console.log("==================================================\n");

  console.log("1. Fetching complete asset list & folder metadata from dabdvgxd4...");
  const oldAssets = await fetchAllResources(OLD_CLOUD);
  console.log(`   Found ${oldAssets.length} total assets in dabdvgxd4.`);

  console.log("2. Fetching current asset list from oko8ywzn...");
  const newAssets = await fetchAllResources(NEW_CLOUD);
  console.log(`   Found ${newAssets.length} total assets in oko8ywzn.\n`);

  const newMap = new Map(newAssets.map(a => [`${a.resource_type}:${a.public_id}`, a]));

  // Configure cloudinary for NEW_CLOUD for all upload/explicit operations
  cloudinary.config(NEW_CLOUD);

  const tasks = [];
  for (const oa of oldAssets) {
    const key = `${oa.resource_type}:${oa.public_id}`;
    const existing = newMap.get(key);
    const targetFolder = oa.asset_folder || (oa.public_id.includes('/') ? oa.public_id.split('/').slice(0, -1).join('/') : '');

    if (existing) {
      // Check if asset_folder needs to be updated to match dabdvgxd4's UI folder
      if ((existing.asset_folder || '') !== targetFolder && targetFolder !== '') {
        tasks.push({ type: 'update_folder', oa, targetFolder });
      }
    } else {
      tasks.push({ type: 'upload_missing', oa, targetFolder });
    }
  }

  console.log(`3. Operations queued:`);
  console.log(`   - Update Media Library UI folder (asset_folder) on existing assets: ${tasks.filter(t => t.type === 'update_folder').length}`);
  console.log(`   - Copy remaining non-DB assets from dabdvgxd4 to oko8ywzn:          ${tasks.filter(t => t.type === 'upload_missing').length}`);
  console.log(`   - Total tasks:                                                      ${tasks.length}\n`);

  let completed = 0;
  let updatedFolders = 0;
  let uploadedMissing = 0;
  let failed = [];
  let index = 0;
  const CONCURRENCY = 20;

  async function worker() {
    while (true) {
      const idx = index++;
      if (idx >= tasks.length) break;
      const task = tasks[idx];
      const { oa, targetFolder } = task;

      try {
        if (task.type === 'update_folder') {
          await cloudinary.uploader.explicit(oa.public_id, {
            type: 'upload',
            resource_type: oa.resource_type,
            asset_folder: targetFolder,
            ...(oa.display_name ? { display_name: oa.display_name } : {})
          });
          updatedFolders++;
        } else if (task.type === 'upload_missing') {
          await cloudinary.uploader.upload(oa.secure_url, {
            public_id: oa.public_id,
            resource_type: oa.resource_type,
            asset_folder: targetFolder,
            ...(oa.display_name ? { display_name: oa.display_name } : {}),
            overwrite: true
          });
          uploadedMissing++;
        }
      } catch (err) {
        // Retry once without display_name in case of display_name uniqueness conflict in folder
        try {
          if (task.type === 'update_folder') {
            await cloudinary.uploader.explicit(oa.public_id, {
              type: 'upload',
              resource_type: oa.resource_type,
              asset_folder: targetFolder
            });
            updatedFolders++;
          } else {
            await cloudinary.uploader.upload(oa.secure_url, {
              public_id: oa.public_id,
              resource_type: oa.resource_type,
              asset_folder: targetFolder,
              overwrite: true
            });
            uploadedMissing++;
          }
        } catch (err2) {
          console.error(`❌ Failed [${task.type}] ${oa.public_id}:`, err2.message || err2);
          failed.push({ public_id: oa.public_id, type: task.type, error: err2.message || String(err2) });
        }
      }

      completed++;
      if (completed % 100 === 0 || completed === tasks.length) {
        console.log(`   ✅ Progress: ${completed}/${tasks.length} (Folders set: ${updatedFolders}, Newly copied: ${uploadedMissing}, Failed: ${failed.length})`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log("\n==================================================");
  console.log("🎉 Full Cloudinary Media Library Sync Complete!");
  console.log(`   - UI Folders Updated on Migrated Assets: ${updatedFolders}`);
  console.log(`   - Additional Cloud Assets Copied:        ${uploadedMissing}`);
  console.log(`   - Failed:                                ${failed.length}`);
  console.log("==================================================");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
