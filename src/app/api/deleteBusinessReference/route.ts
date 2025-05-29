import { pool } from "@/lib/pool";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const toDeleteId = url.searchParams.get("toDeleteId");

    await pool.query(`DELETE FROM business_reference WHERE id = $1`, [
      toDeleteId,
    ]);

    return new Response(
      JSON.stringify({ flag: true, message: "Reference Deleted Successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
