import { pool } from "@/lib/pool";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId in query params" }),
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT 
       *
       FROM aml_info
       WHERE user_id = $1
       LIMIT 1`,
      [userId]
    );

    const amlInfo = result.rows[0] || null;

    return new Response(JSON.stringify({ amlInfo }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET AML Info error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch AML info" }), {
      status: 500,
    });
  }
}
