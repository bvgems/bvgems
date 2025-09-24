import { NextResponse } from "next/server";
import { pool } from "@/lib/pool";

export async function POST(req: Request) {
  try {
    const { shape, collection, isSapphire, sapphireColor } = await req.json();

    if (!shape) {
      return NextResponse.json({ error: "Missing shape" }, { status: 400 });
    }

    let result;

    // Case 1: collection not provided → fetch unique sizes for that shape
    if (!collection) {
      result = await pool.query(
        `SELECT DISTINCT size 
         FROM gemstone_specs 
         WHERE shape = $1
         ORDER BY size ASC`,
        [shape]
      );
    } else {
      // Case 2: collection provided
      if (isSapphire) {
        result = await pool.query(
          `SELECT * 
           FROM gemstone_specs 
           WHERE shape = $1 
             AND LOWER(collection_slug) = LOWER($2) 
             AND color = $3`,
          [shape, collection, sapphireColor]
        );
      } else {
        if (collection === "Emerald") {
          result = await pool.query(
            `SELECT gs.*,
                    COALESCE(
                      json_agg(gi.image_url) FILTER (WHERE gi.image_url IS NOT NULL),
                      '[]'
                    ) AS extra_images
             FROM gemstone_specs gs
             LEFT JOIN gemstone_images gi ON gs.id = gi.gemstone_id
             WHERE gs.shape = $1 
               AND LOWER(gs.collection_slug) = LOWER($2)
             GROUP BY gs.id`,
            [shape, collection]
          );
        } else {
          result = await pool.query(
            `SELECT * 
             FROM gemstone_specs 
             WHERE shape = $1 
               AND LOWER(collection_slug) = LOWER($2)`,
            [shape, collection]
          );
        }
      }
    }

    return new Response(JSON.stringify(result?.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("error", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch gemstone data" }),
      { status: 500 }
    );
  }
}
