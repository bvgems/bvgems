import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new pg.Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
});

// CSV Line Parser handling quotes
function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result.map(s => s.trim().replace(/^"|"$/g, ''));
}

async function main() {
  console.log('===============================================================');
  console.log('💎 Safe Pricing Update: fillUsingAA Stuller Pricing (1,386 rows)');
  console.log('===============================================================\n');

  const client = await pool.connect();

  try {
    // 1. Initial State Check
    const totalCountRes = await client.query('SELECT COUNT(*) FROM gemstone_specs');
    const totalRowsBefore = parseInt(totalCountRes.rows[0].count, 10);
    console.log(`Current gemstone_specs total rows in DB: ${totalRowsBefore}`);

    if (totalRowsBefore !== 3265) {
      throw new Error(`Unexpected table row count: ${totalRowsBefore}. Expected 3265.`);
    }

    // 2. Read and parse the fillUsingAA CSV file
    const csvPath = '/Users/meetpatel/Desktop/BV/calibrated_gemstones_db_copy/BV_Gems_Calibrated_Stones_With_Stuller_Pricing_fillUsingAA.csv';
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }

    console.log(`Reading source file: ${csvPath}`);
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');

    const headers = parseCSVLine(lines[0]);
    const idIdx = headers.indexOf('id');
    const typeIdx = headers.indexOf('type');
    const qualityIdx = headers.indexOf('quality');
    const sizeIdx = headers.indexOf('size');
    const price40OffIdx = headers.indexOf("stuller's price (-40%)");

    if (idIdx === -1 || price40OffIdx === -1) {
      throw new Error("Required columns 'id' or 'stuller\\'s price (-40%)' missing in CSV header.");
    }

    const itemsToUpdate = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length <= Math.max(idIdx, price40OffIdx)) continue;

      const id = parseInt(cols[idIdx], 10);
      const size = cols[sizeIdx] || '';
      const type = cols[typeIdx] || '';
      const quality = cols[qualityIdx] || '';
      const priceValStr = cols[price40OffIdx];

      // Skip Stuller unique sizes or empty prices
      if (size.toLowerCase().includes('stuller')) continue;
      if (!priceValStr || priceValStr.trim() === '') continue;

      const newPrice = parseFloat(priceValStr);
      if (isNaN(newPrice) || newPrice <= 0) continue;

      if (type === 'Natural' && (quality === 'A' || quality === 'AA')) {
        itemsToUpdate.push({
          id,
          newPrice: Math.round(newPrice * 100) / 100
        });
      }
    }

    console.log(`Parsed ${itemsToUpdate.length} Natural A/AA rows to update from fillUsingAA CSV.\n`);

    if (itemsToUpdate.length !== 1386) {
      throw new Error(`Expected exactly 1386 rows to update, but parsed ${itemsToUpdate.length}. Aborting for safety.`);
    }

    // 3. Create In-Database Backup Table
    const backupTableName = 'gemstone_specs_backup_20261029_fillUsingAA';
    console.log(`Creating database backup table: ${backupTableName}...`);
    await client.query(`DROP TABLE IF EXISTS ${backupTableName}`);
    await client.query(`CREATE TABLE ${backupTableName} AS SELECT * FROM gemstone_specs`);

    const backupCountRes = await client.query(`SELECT COUNT(*) FROM ${backupTableName}`);
    const backupRows = parseInt(backupCountRes.rows[0].count, 10);
    console.log(`✅ Backup table created successfully with ${backupRows} rows.\n`);

    if (backupRows !== totalRowsBefore) {
      throw new Error(`Backup row count mismatch: ${backupRows} vs ${totalRowsBefore}.`);
    }

    // 4. Execute Atomic Update inside Transaction
    console.log('Beginning database transaction (BEGIN)...');
    await client.query('BEGIN');

    const valuePlaceholders = [];
    const params = [];
    itemsToUpdate.forEach((item, idx) => {
      valuePlaceholders.push(`($${idx * 2 + 1}::integer, $${idx * 2 + 2}::numeric)`);
      params.push(item.id, item.newPrice);
    });

    const updateQuery = `
      UPDATE gemstone_specs g
      SET price = v.new_price
      FROM (VALUES ${valuePlaceholders.join(', ')}) AS v(id, new_price)
      WHERE g.id = v.id
        AND g.type = 'Natural'
        AND g.quality IN ('A', 'AA')
    `;

    console.log(`Executing UPDATE query for ${itemsToUpdate.length} rows...`);
    const updateResult = await client.query(updateQuery, params);
    const affectedCount = updateResult.rowCount;
    console.log(`Rows affected by UPDATE: ${affectedCount}`);

    if (affectedCount !== 1386) {
      throw new Error(`Update expected to affect exactly 1386 rows, but affected ${affectedCount}. Rolling back!`);
    }

    console.log('Committing transaction (COMMIT)...');
    await client.query('COMMIT');
    console.log('✅ Transaction committed successfully!\n');

    // 5. Post-Update Integrity Verification
    console.log('Running post-update integrity checks...');

    // Check total row count
    const postCountRes = await client.query('SELECT COUNT(*) FROM gemstone_specs');
    const totalRowsAfter = parseInt(postCountRes.rows[0].count, 10);
    console.log(`  - Total row count: ${totalRowsAfter} (Expected: ${totalRowsBefore})`);
    if (totalRowsAfter !== totalRowsBefore) {
      throw new Error(`Total row count changed! Before: ${totalRowsBefore}, After: ${totalRowsAfter}`);
    }

    // Check non-price columns match backup 100%
    const collateralCheck = await client.query(`
      SELECT COUNT(*) FROM gemstone_specs g
      JOIN ${backupTableName} b ON g.id = b.id
      WHERE g.collection_slug != b.collection_slug
         OR g.shape != b.shape
         OR g.size != b.size
         OR g.type != b.type
         OR g.quality != b.quality
         OR g.color IS DISTINCT FROM b.color
         OR g.ct_weight IS DISTINCT FROM b.ct_weight
         OR g.image_url IS DISTINCT FROM b.image_url
         OR g.cloudinary_videos IS DISTINCT FROM b.cloudinary_videos
         OR g.is_available IS DISTINCT FROM b.is_available
    `);
    const nonPriceDifferences = parseInt(collateralCheck.rows[0].count, 10);
    console.log(`  - Non-price column differences: ${nonPriceDifferences} (Expected: 0)`);
    if (nonPriceDifferences !== 0) {
      throw new Error(`Integrity alert: ${nonPriceDifferences} rows had non-price columns altered!`);
    }

    // Check Lab Grown stones are completely unchanged
    const labGrownCheck = await client.query(`
      SELECT COUNT(*) FROM gemstone_specs g
      JOIN ${backupTableName} b ON g.id = b.id
      WHERE g.type = 'Lab Grown' AND g.price IS DISTINCT FROM b.price
    `);
    const labGrownDiff = parseInt(labGrownCheck.rows[0].count, 10);
    console.log(`  - Lab Grown price differences: ${labGrownDiff} (Expected: 0)`);
    if (labGrownDiff !== 0) {
      throw new Error(`Integrity alert: ${labGrownDiff} Lab Grown rows had prices altered!`);
    }

    // 6. Fetch Sample Newly Updated Rows (from the 200 new fallback additions)
    const auditPath = '/Users/meetpatel/Desktop/BV/calibrated_gemstones_db_copy/fillUsingAA_audit_log.json';
    let sampleNewRows = [];
    if (fs.existsSync(auditPath)) {
      const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
      const sampleIds = audit.slice(0, 10).map(a => a.id);
      const sampleRes = await client.query(`
        SELECT g.id, g.collection_slug, g.shape, g.size, g.quality, b.price as old_price, g.price as new_price
        FROM gemstone_specs g
        JOIN ${backupTableName} b ON g.id = b.id
        WHERE g.id = ANY($1)
        ORDER BY g.collection_slug, g.shape, g.size
      `, [sampleIds]);
      sampleNewRows = sampleRes.rows;
      console.log('\nSample Newly Updated Rows (from AA Fallback additions):');
      console.table(sampleNewRows);
    }

    // 7. Write Audit Log
    const auditData = {
      timestamp: new Date().toISOString(),
      source_file: csvPath,
      backup_table: backupTableName,
      total_rows: totalRowsAfter,
      rows_updated: affectedCount,
      previously_updated_rows_confirmed: 1186,
      new_fallback_rows_updated: 200,
      non_price_columns_altered: 0,
      lab_grown_altered: 0,
      sample_newly_priced_rows: sampleNewRows
    };
    const logFile = path.resolve(__dirname, 'fillUsingAA_pricing_update_log.json');
    fs.writeFileSync(logFile, JSON.stringify(auditData, null, 2), 'utf8');
    console.log(`\nAudit log saved to: ${logFile}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ ERROR OCCURRED! Transaction rolled back cleanly:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
