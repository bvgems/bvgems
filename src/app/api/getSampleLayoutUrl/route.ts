import { pool } from "@/lib/pool";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { gemstone, shape, color, pattern } = await req.json();

    if (!gemstone || !shape || !color || !pattern) {
      return NextResponse.json(
        { error: "Missing input values" },
        { status: 400 }
      );
    }

    const query = `
      SELECT *
      FROM layouts
      WHERE LOWER(stone) = LOWER($1)
        AND LOWER(shape) = LOWER($2)
        AND LOWER(color) = LOWER($3)
        AND LOWER(layout_type) = LOWER($4)
      LIMIT 1;
    `;

    const values = [gemstone, shape, color, pattern];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "No match found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
