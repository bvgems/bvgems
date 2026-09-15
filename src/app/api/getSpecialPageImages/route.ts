import { NextResponse } from "next/server";
import { pool } from "@/lib/pool";

export async function GET() {
  try {
    const query = `
      SELECT DISTINCT ON (LOWER(collection_slug), shape, color) 
        LOWER(collection_slug) as collection_slug, 
        shape, 
        color, 
        image_url
      FROM gemstone_specs
      WHERE image_url IS NOT NULL 
      ORDER BY 
        LOWER(collection_slug), 
        shape, 
        color, 
        CASE 
          WHEN quality = 'A' THEN 1 
          WHEN quality = 'AA' THEN 2 
          WHEN quality = 'Lab Grown' THEN 3 
          ELSE 4 
        END;
    `;

    const result = await pool.query(query);

    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (error) {
    console.error("GET /api/getSpecialPageImages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch special page image mapping" },
      { status: 500 }
    );
  }
}
