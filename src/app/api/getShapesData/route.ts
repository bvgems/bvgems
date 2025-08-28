import { NextResponse } from "next/server";
import { pool } from "@/lib/pool";

export async function POST(req: Request) {
  try {
    const { shape, collection, isSapphire, sapphireColor } = await req.json();
    if (!shape || !collection) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    console.log("collection", collection);

    let result;

    if (isSapphire) {
      // Sapphire query
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
        console.log('resulttt',result?.rows)
      } else {
        // Other collections
        result = await pool.query(
          `SELECT * 
           FROM gemstone_specs 
           WHERE shape = $1 
             AND LOWER(collection_slug) = LOWER($2)`,
          [shape, collection]
        );
      }
    }

    return new Response(JSON.stringify(result?.rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("error", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch gemstone data" }),
      { status: 500 }
    );
  }
}
