import { getGemstoneByHandle } from "@/app/Graphql/queries";
import { NextResponse } from "next/server";
import { pool } from "@/lib/pool";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shape = url.searchParams.get("shape");
    const collection = url.searchParams.get("collection");

    if (!shape) {
      return NextResponse.json({ error: "Missing shape" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT * FROM gemstone_specs WHERE shape = $1 AND LOWER(collection_slug) = LOWER($2)`,
      [shape, collection]
    );

    return new Response(JSON.stringify(result?.rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("errrorrrrr", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Shopify data" }),
      { status: 500 }
    );
  }
}
