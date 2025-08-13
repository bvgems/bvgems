import { NextResponse } from "next/server";
import { pool } from "@/lib/pool";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Capitalize first letter (or all letters if you want full uppercase)

    const result = await pool.query(
      `SELECT * FROM free_size_gemstones WHERE id=$1`,
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
