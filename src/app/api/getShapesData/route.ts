import { getGemstoneByHandle } from "@/app/Graphql/queries";
import { NextResponse } from "next/server";

import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shape = url.searchParams.get("shape");
    const collection = url.searchParams.get("collection");
    console.log("heren", shape, collection);

    if (!shape) {
      return NextResponse.json({ error: "Missing shape" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT * FROM gemstone_specs WHERE shape=$1 AND collection_slug=$2`,
      [shape, collection]
    );
    console.log("dataaaa", result.rows,result.rowCount);

    return new Response(JSON.stringify(result?.rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log('errrorrrrr',error)
    return new Response(
      JSON.stringify({ error: "Failed to fetch Shopify data" }),
      { status: 500 }
    );
  }
}
