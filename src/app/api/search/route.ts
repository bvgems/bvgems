import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/pool";
import { getAllJeweleryProducts, getBeads } from "../lib/commonFunctions";

function normalizeSizeQuery(q: string) {
  let norm = q.toLowerCase().replace(/\s+/g, " ").trim();
  norm = norm.replace(/(\d)\s*x\s*(\d)/g, "$1 x $2");
  norm = norm.replace(/\s*mm$/, "");
  return norm;
}

function tokenizeQuery(query: string) {
  return query.split(/\s+/).filter(Boolean);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    const category = searchParams.get("category") || "all";
    const limit = 15;

    if (!query) return NextResponse.json({ data: [] }, { status: 200 });

    let results: any[] = [];
    const isAlpha = /^[a-zA-Z]+$/.test(query);
    const norm = normalizeSizeQuery(query);
    const tokens = tokenizeQuery(norm);

    // ===== Loose Gemstones =====
    if (category === "all" || category === "calibrated") {
      if (isAlpha && tokens.length === 1) {
        const looseRes = await pool.query(
          `SELECT id, shape, collection_slug, size, color, image_url, quality,
                  ts_rank(search_vector, to_tsquery('english', $1 || ':*')) AS rank
           FROM gemstone_specs
           WHERE search_vector @@ to_tsquery('english', $1 || ':*')
           ORDER BY rank DESC
           LIMIT $2`,
          [query, limit]
        );
        results.push(
          ...looseRes.rows.map((item) => ({
            ...item,
            value: `${item.shape} ${item.collection_slug} ${item.size} - ${item.id}`,
            category: "Calibrated",
          }))
        );
      } else {
        const whereClauses = tokens.map(
          (_, i) => `(
            size ILIKE '%' || $${i + 1} || '%' OR
            replace(size, ' ', '') ILIKE '%' || replace($${
              i + 1
            }, ' ', '') || '%' OR
            collection_slug ILIKE '%' || $${i + 1} || '%' OR
            shape ILIKE '%' || $${i + 1} || '%' OR
            color ILIKE '%' || $${i + 1} || '%'
          )`
        );

        const sql = `
          SELECT id, shape, collection_slug, size, color, image_url, quality
          FROM gemstone_specs
          WHERE ${whereClauses.join(" AND ")}
          LIMIT $${tokens.length + 1};
        `;
        const looseRes = await pool.query(sql, [...tokens, limit]);
        results.push(
          ...looseRes.rows.map((item) => ({
            ...item,
            value: `${item.shape} ${item.collection_slug} ${item.size} - ${item.id}`,
            category: "Calibrated",
          }))
        );
      }
    }

    // ===== Free Size Gemstones =====
    if (category === "all" || category === "freeSize") {
      // lot_number exact match
      const lotRes = await pool.query(
        `SELECT id, shape, gemstone_type, dimension, origin, image_url, lot_number
         FROM free_size_gemstones
         WHERE lot_number = $1
         LIMIT 1;`,
        [query]
      );
      if (lotRes.rows.length > 0) {
        results.push({
          ...lotRes.rows[0],
          value: `${lotRes.rows[0].shape} ${lotRes.rows[0].gemstone_type} ${lotRes.rows[0].dimension} - ${lotRes.rows[0].id}`,
          category: "Free Size Gemstone",
        });
      } else if (isAlpha && tokens.length === 1) {
        const freeRes = await pool.query(
          `SELECT id, shape, gemstone_type, dimension, origin, image_url,
                  ts_rank(search_vector, to_tsquery('english', $1 || ':*')) AS rank
           FROM free_size_gemstones
           WHERE search_vector @@ to_tsquery('english', $1 || ':*')
           ORDER BY rank DESC
           LIMIT $2`,
          [query, limit]
        );
        results.push(
          ...freeRes.rows.map((item) => ({
            ...item,
            value: `${item.shape} ${item.gemstone_type} ${item.dimension} - ${item.id}`,
            category: "Free Size Gemstone",
          }))
        );
      } else {
        const whereClauses = tokens.map(
          (_, i) => `(
            dimension ILIKE '%' || $${i + 1} || '%' OR
            replace(dimension, ' ', '') ILIKE '%' || replace($${
              i + 1
            }, ' ', '') || '%' OR
            gemstone_type ILIKE '%' || $${i + 1} || '%' OR
            shape ILIKE '%' || $${i + 1} || '%' OR
            origin ILIKE '%' || $${i + 1} || '%'
          )`
        );

        const sql = `
          SELECT id, shape, gemstone_type, dimension, origin, image_url
          FROM free_size_gemstones
          WHERE ${whereClauses.join(" AND ")}
          LIMIT $${tokens.length + 1};
        `;
        const freeRes = await pool.query(sql, [...tokens, limit]);
        results.push(
          ...freeRes.rows.map((item) => ({
            ...item,
            value: `${item.shape} ${item.gemstone_type} ${item.dimension} - ${item.id}`,
            category: "Free Size Gemstone",
          }))
        );
      }
    }

    // ===== Jewelry =====
    if (category === "all" || category === "jewelry") {
      const allRings = await getAllJeweleryProducts("rings");
      const allNecklaces = await getAllJeweleryProducts("necklaces");
      const allBracelets = await getAllJeweleryProducts("bracelets");
      const allEarrings = await getAllJeweleryProducts("earrings");
      const allBeads = await getBeads();

      const jewelryEdges = [
        ...(allRings?.edges || []),
        ...(allNecklaces?.edges || []),
        ...(allBracelets?.edges || []),
        ...(allEarrings?.edges || []),
        ...(allBeads || []),
      ];

      const filteredJewelry = jewelryEdges
        .map((item: any) => item.node || item)
        .filter((node: any) =>
          tokens.every((t) =>
            node.title?.toLowerCase().includes(t.toLowerCase())
          )
        )
        .slice(0, limit);

      results.push(
        ...filteredJewelry.map((item: any) => ({
          ...item,
          value: item.title,
          category: "jewelry",
        }))
      );
    }

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
