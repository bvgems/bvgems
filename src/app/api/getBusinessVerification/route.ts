import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const result = await pool.query(
      `SELECT * FROM business_verification WHERE user_id = $1`,
      [id]
    );

    return new Response(JSON.stringify({ businessVerification: result.rows }), {
      status: 200,
    });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
