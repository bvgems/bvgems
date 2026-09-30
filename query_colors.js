import { config } from 'dotenv';
config({ path: '.env' });
import { pool } from './src/lib/pool.ts';

async function run() {
  try {
    const freeSize = await pool.query("SELECT DISTINCT color FROM free_size_gemstones WHERE LOWER(gemstone_type) = 'sapphire' AND color IS NOT NULL");
    
    // Check if loose_gemstones exists, else catch error
    let loose = { rows: [] };
    try {
      loose = await pool.query("SELECT DISTINCT color FROM loose_gemstones WHERE LOWER(gemstone_type) = 'sapphire' AND color IS NOT NULL");
    } catch(e) {
      console.log("loose_gemstones table does not exist or error:", e.message);
    }
    
    // Check calibrated_gemstones just in case
    let calibrated = { rows: [] };
    try {
      calibrated = await pool.query("SELECT DISTINCT color FROM calibrated_gemstones WHERE LOWER(gemstone_type) = 'sapphire' AND color IS NOT NULL");
    } catch(e) {
      console.log("calibrated_gemstones table does not exist or error:", e.message);
    }

    console.log("=== FREE SIZE SAPPHIRE COLORS ===");
    console.log(freeSize.rows.map(r => r.color).sort().join('\n'));
    
    console.log("\n=== LOOSE SAPPHIRE COLORS ===");
    console.log(loose.rows.map(r => r.color).sort().join('\n'));

    console.log("\n=== CALIBRATED SAPPHIRE COLORS ===");
    console.log(calibrated.rows.map(r => r.color).sort().join('\n'));
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
