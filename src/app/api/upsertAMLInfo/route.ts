// src/app/api/aml/post.ts
import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";
import { upsertAMLInfo } from "../helperFunctions/createAMLInfo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, userId } = body;

    const checkResult: any = await pool.query(
      `SELECT id FROM aml_info WHERE user_id = $1 LIMIT 1`,
      [userId]
    );
    const isExisting = checkResult.rowCount > 0;

    await upsertAMLInfo(userId, data);

    const message = isExisting
      ? "AML info updated successfully!"
      : "AML info added successfully!";

    return new Response(JSON.stringify({ flag: true, message }), {
      status: 200,
    });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
