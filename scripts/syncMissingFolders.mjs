import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (process.env.CLOUDINARY_URL) {
  const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true
  });
}

const NON_SAPPHIRE = ["Alexandrite","Emerald","Ruby","Aquamarine","Morganite","Amethyst","Citrine","Peridot","Tanzanite","ParaibaTourmaline"];
const SHAPES = ["pear","round","oval","cushion","emeraldCut","marquise","princessCut","trillion","heart","straightBaguette"];
const GRADES = ["A","AA","B","Lab"];
const SAPPHIRE_COLORS = ["pink","blue","yellow","orange","green","purple"];

const expectedFolders = new Set();
for (const gem of NON_SAPPHIRE) {
  for (const shape of SHAPES) {
    for (const grade of GRADES) {
      expectedFolders.add(`Gemstone Videos/${gem}/shape-${shape}/grade-${grade}`);
    }
  }
}
for (const color of SAPPHIRE_COLORS) {
  for (const shape of SHAPES) {
    for (const grade of GRADES) {
      expectedFolders.add(`Gemstone Videos/Sapphire/${color}-${shape}/grade-${grade}`);
    }
  }
}

async function getAllFoldersRecursively(prefix) {
  let folders = [];
  try {
    let result = await cloudinary.api.sub_folders(prefix);
    for (const f of result.folders) {
      folders.push(f.path);
      // It's faster to do this recursively than guessing. 
      // But actually, we only need to go 3 levels deep.
    }
  } catch(e) {}
  return folders;
}

async function run() {
  console.log(`Checking ${expectedFolders.size} expected folders...`);
  const missing = [];
  
  // We can just use the Admin API's root folders endpoint to get everything. 
  // Cloudinary allows getting all folders if we don't specify prefix, but it's paginated.
  console.log("Fetching all existing folders from Cloudinary...");
  let existingFolders = new Set();
  let nextCursor = null;
  do {
    const res = await cloudinary.api.root_folders({ next_cursor: nextCursor, max_results: 500 });
    // root_folders only returns root level.
    break;
  } while(false);
  
  // Since we only have a few root folders, let's just do a big fetch tree.
  const level1 = await getAllFoldersRecursively("Gemstone Videos");
  let level2 = [];
  for (const f of level1) {
    const subs = await getAllFoldersRecursively(f);
    level2.push(...subs);
  }
  let level3 = [];
  for (const f of level2) {
    const subs = await getAllFoldersRecursively(f);
    level3.push(...subs);
  }
  
  for(const f of level3) existingFolders.add(f);

  for (const folder of expectedFolders) {
    if (!existingFolders.has(folder)) {
      missing.push(folder);
    }
  }
  
  console.log(`Found ${missing.length} missing folders out of ${expectedFolders.size}.`);
  
  let rateLimited = false;
  for (let i = 0; i < missing.length; i++) {
    if (rateLimited) break;
    const folder = missing[i];
    try {
      await cloudinary.api.create_folder(folder);
      console.log(`[${i + 1}/${missing.length}] ✅ Created: ${folder}`);
    } catch (error) {
      const httpCode = error?.error?.http_code || error?.http_code;
      if (httpCode === 409) {
        console.log(`[${i + 1}/${missing.length}] ⏭️  Exists: ${folder}`);
      } else if (httpCode === 420 || httpCode === 429) {
        console.error(`\n❌ Cloudinary Admin API Rate Limit Exceeded!`);
        rateLimited = true;
      } else {
        console.error(`[${i + 1}/${missing.length}] ❌ Error:`, error.message);
      }
    }
    await new Promise(r => setTimeout(r, 150));
  }
  console.log("Done.");
}
run();
