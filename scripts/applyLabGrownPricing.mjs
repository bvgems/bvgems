import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 5432),
  ssl: { rejectUnauthorized: false }
});

async function main() {
  console.log("==================================================");
  console.log("💎 Applying Lab Grown Pricing to Newly Added Rows");
  console.log("==================================================\n");

  const client = await pool.connect();

  try {
    // 1. Fetch newly added Lab Grown rows with price IS NULL
    const fetchRes = await client.query(`
      SELECT id, collection_slug, shape, size, color, ct_weight, price
      FROM gemstone_specs
      WHERE id BETWEEN 6927 AND 7296 
        AND type = 'Lab Grown' 
        AND price IS NULL
      ORDER BY collection_slug, shape, size, color
    `);

    console.log(`Found ${fetchRes.rows.length} newly added Lab Grown rows to price.\n`);

    if (fetchRes.rows.length === 0) {
      console.log("No unpriced Lab Grown rows found in the new range.");
      return;
    }

    await client.query("BEGIN");

    let updatedCount = 0;
    const updateLogs = [];

    for (const r of fetchRes.rows) {
      const gem = r.collection_slug;
      const rate = (gem === "Alexandrite" || gem === "Paraiba Tourmaline") ? 85 : 50;
      const wt = Number(r.ct_weight);

      let isSmallRound = false;
      if (r.shape === "Round") {
        const m = r.size.match(/^(\d+(?:\.\d+)?)/);
        if (m && parseFloat(m[1]) < 2.00) {
          isSmallRound = true;
        }
      }

      let price = 0;
      if (isSmallRound) {
        price = 3.00;
      } else {
        price = Math.round(wt * rate * 100) / 100;
      }

      await client.query(`
        UPDATE gemstone_specs
        SET price = $1
        WHERE id = $2
      `, [price, r.id]);

      updatedCount++;
      updateLogs.push({
        id: r.id,
        gemstone: gem,
        shape: r.shape,
        size: r.size,
        color: r.color,
        ct_weight: wt,
        pricing_rule: isSmallRound ? "$3.00 flat per stone (< 2mm round)" : `$${rate}/ct * ${wt} ct`,
        calculated_price: price
      });
    }

    await client.query("COMMIT");
    console.log(`✅ Transaction committed! Updated price for all ${updatedCount} Lab Grown rows.\n`);

    // Group summary by gemstone
    const summaryByGem = {};
    for (const l of updateLogs) {
      if (!summaryByGem[l.gemstone]) {
        summaryByGem[l.gemstone] = { count: 0, sample_prices: [] };
      }
      summaryByGem[l.gemstone].count++;
      if (summaryByGem[l.gemstone].sample_prices.length < 3) {
        summaryByGem[l.gemstone].sample_prices.push(`${l.shape} ${l.size} (${l.pricing_rule}): $${l.calculated_price}`);
      }
    }

    console.log("Summary by Gemstone:");
    for (const [gem, data] of Object.entries(summaryByGem)) {
      console.log(`  - ${gem}: ${data.count} rows priced`);
      for (const sp of data.sample_prices) {
        console.log(`      * ${sp}`);
      }
    }

    // Save audit file
    const logPath = "./scripts/lab_grown_pricing_log.json";
    fs.writeFileSync(logPath, JSON.stringify(updateLogs, null, 2), "utf8");
    console.log(`\nAudit log saved to: ${logPath}`);

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error occurred, transaction rolled back:", err);
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
