import { NextResponse } from "next/server";
import { pool } from "@/lib/pool";

export async function POST(req: Request) {
  try {
    const { shape, collection, isSapphire, sapphireColor } = await req.json();
    console.log("heyy", shape, collection, isSapphire, sapphireColor);
    if (!shape || !collection) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    let result;
    if (isSapphire) {
      result = await pool.query(
        `SELECT * FROM gemstone_specs WHERE shape = $1 AND LOWER(collection_slug) = LOWER($2) AND color = $3`,
        [shape, collection, sapphireColor]
      );
    } else {
      result = await pool.query(
        `SELECT * FROM gemstone_specs WHERE shape = $1 AND LOWER(collection_slug) = LOWER($2)`,
        [shape, collection]
      );
    }

    return new Response(JSON.stringify(result?.rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("error", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Shopify data" }),
      { status: 500 }
    );
  }
}
