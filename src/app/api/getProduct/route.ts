import { NextResponse } from "next/server";
import { pool } from "@/lib/pool";

export async function POST(req: Request) {
  try {
    const id = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing Id" }, { status: 400 });
    }

    const result = await pool.query(
      `
      SELECT gs.*,
             CASE 
               WHEN gs.collection_slug = 'Emerald' 
               THEN COALESCE(
                 json_agg(gi.image_url) FILTER (WHERE gi.image_url IS NOT NULL),
                 '[]'
               )
               ELSE '[]'
             END AS extra_images
      FROM gemstone_specs gs
      LEFT JOIN gemstone_images gi 
        ON gs.id = gi.gemstone_id 
       AND gs.collection_slug = 'Emerald'
      WHERE gs.id = $1
      GROUP BY gs.id;
      `,
      [id]
    );

    return new Response(JSON.stringify(result?.rows || {}), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("error while getting the product data", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch product data" }),
      { status: 500 }
    );
  }
}
