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

async function main() {
  const isExecute = process.argv.includes('--execute');
  const client = await pool.connect();

  try {
    console.log("==================================================");
    console.log("💎 Topaz Pricing & Cleanup Application");
    console.log(`Mode: ${isExecute ? '🚀 EXECUTE' : '🔍 DRY-RUN'}`);
    console.log("==================================================\n");

    const plannedChanges = JSON.parse(fs.readFileSync('/tmp/topaz_planned_changes.json', 'utf-8'));
    const { deletes, updates, unpriced_standards } = plannedChanges;

    console.log(`📋 Summary of Changes:`);
    console.log(`   - Rows to DELETE (non-standard, unique to Topaz): ${deletes.length}`);
    console.log(`   - Rows to UPDATE (pricing + Stuller weights):      ${updates.length}`);
    console.log(`   - Standard sizes without Stuller pricing (retain): ${unpriced_standards.length}`);

    if (!isExecute) {
      console.log("\n⚠️ Running in DRY-RUN mode. No changes were made to the database.");
      console.log("To apply changes, run with: node scripts/applyTopazPricing.mjs --execute");
      return;
    }

    // 1. Create safety backup
    console.log("\n🛡️ Step 1: Creating safety backup table...");
    await client.query("DROP TABLE IF EXISTS gemstone_specs_backup_20261026_topaz_pricing");
    await client.query("CREATE TABLE gemstone_specs_backup_20261026_topaz_pricing AS SELECT * FROM gemstone_specs");
    const backupRes = await client.query("SELECT COUNT(*) FROM gemstone_specs_backup_20261026_topaz_pricing");
    console.log(`   ✅ Backup created: ${backupRes.rows[0].count} rows.`);

    await client.query("BEGIN");

    // 2. Delete non-standard unique rows
    console.log("\n🗑️ Step 2: Deleting 13 non-standard unique Topaz rows...");
    const deleteIds = deletes.map(d => d.id);
    const delRes = await client.query("DELETE FROM gemstone_specs WHERE id = ANY($1::int[]) RETURNING id, color, shape, size", [deleteIds]);
    console.log(`   ✅ Deleted ${delRes.rowCount} rows.`);

    // 3. Update 239 matched rows
    console.log("\n💲 Step 3: Updating 239 rows with Stuller pricing and true carat weights...");
    let updatedCount = 0;
    for (const u of updates) {
      const updateRes = await client.query(`
        UPDATE gemstone_specs
        SET price = $1,
            ct_weight = $2
        WHERE id = $3
        RETURNING id;
      `, [u.new_price, u.new_ct_weight, u.id]);
      if (updateRes.rowCount > 0) updatedCount++;
    }
    console.log(`   ✅ Successfully updated ${updatedCount} rows.`);

    await client.query("COMMIT");

    // 4. Verification
    console.log("\n🔍 Step 4: Verification in database...");
    const verifyCounts = await client.query(`
      SELECT color, 
             count(*) as total_rows, 
             count(price) as priced_rows, 
             count(CASE WHEN price IS NULL THEN 1 END) as unpriced_rows,
             min(price::float) as min_price, 
             max(price::float) as max_price
      FROM gemstone_specs
      WHERE collection_slug = 'Topaz'
      GROUP BY color
      ORDER BY color;
    `);
    console.table(verifyCounts.rows);

    console.log("\n✨ Completed successfully!");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error executing Topaz pricing update:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
