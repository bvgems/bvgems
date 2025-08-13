import { getGemstoneByHandle } from "@/app/Graphql/queries";
import { NextResponse } from "next/server";
import { pool } from "@/lib/pool";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    let gemstone = url.searchParams.get("gemstone");

    if (!gemstone) {
      return NextResponse.json(
        { error: "Missing Gemstone Type" },
        { status: 400 }
      );
    }

    // Capitalize first letter (or all letters if you want full uppercase)
    gemstone = gemstone.charAt(0).toUpperCase() + gemstone.slice(1);

    const result = await pool.query(
      `SELECT * FROM free_size_gemstones WHERE gemstone_type=$1`,
      [gemstone]
    );

    return new Response(JSON.stringify(result?.rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("errror while getting the product data", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Shopify data" }),
      { status: 500 }
    );
  }
}
