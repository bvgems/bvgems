import { getGemstoneByHandle } from "@/app/Graphql/queries";
import { NextResponse } from "next/server";
import { pool } from "@/lib/pool";

export async function POST(req: Request) {
  try {
    const id = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing Id" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT * FROM gemstone_specs WHERE id=$1`,
      [id]
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
