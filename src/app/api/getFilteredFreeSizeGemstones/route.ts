import { pool } from "@/lib/pool";
import { NextRequest, NextResponse } from "next/server";

const cleanOptions = (options: any) => {
  const cleaned: any = {};
  for (const key in options) {
    if (
      options[key] !== null &&
      options[key] !== undefined &&
      options[key] !== "" &&
      !(Array.isArray(options[key]) && options[key].length === 0)
    ) {
      cleaned[key] = options[key];
    }
  }
  return cleaned;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const options = cleanOptions(body.options);

    const whereClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (options.lot_number) {
      whereClauses.push(`lot_number ILIKE $${paramIndex++}`);
      values.push(`%${options.lot_number}%`);
    }
    if (options.gemstone_type) {
      whereClauses.push(`LOWER(gemstone_type) = ANY($${paramIndex++}::text[])`);
      values.push(options.gemstone_type.map((g: string) => g.toLowerCase()));
    }
    if (options.color) {
      whereClauses.push(`color = ANY($${paramIndex++}::text[])`);
      values.push(options.color);
    }
    if (options.shape) {
      whereClauses.push(`shape = ANY($${paramIndex++}::text[])`);
      values.push(options.shape);
    }
    if (options.origin) {
      whereClauses.push(`origin = ANY($${paramIndex++}::text[])`);
      values.push(options.origin);
    }
    if (options.weight) {
      whereClauses.push(
        `ct_weight BETWEEN $${paramIndex} AND $${paramIndex + 1}`
      );
      values.push(options.weight[0], options.weight[1]);
      paramIndex += 2;
    }
    if (options.single_or_matched) {
      whereClauses.push(
        `LOWER(single_or_matched) = ANY($${paramIndex++}::text[])`
      );
      values.push(
        options.single_or_matched.map((s: string) => s.toLowerCase())
      );
    }
    if (options.enhancement) {
      whereClauses.push(`LOWER(enhancement) = ANY($${paramIndex++}::text[])`);
      values.push(options.enhancement.map((e: string) => e.toLowerCase()));
    }
    if (options.is_certified !== null && options.is_certified !== undefined) {
      whereClauses.push(`is_certified = $${paramIndex++}`);
      values.push(Boolean(options.is_certified));
    }
    if (options.length && (options.length.min || options.length.max)) {
      const min = options.length.min || 0;
      const max = options.length.max || 9999;
      whereClauses.push(`
        CAST(SPLIT_PART(dimension, 'x', 1) AS NUMERIC) BETWEEN ${min} AND ${max}
      `);
    }
    if (options.width && (options.width.min || options.width.max)) {
      const min = options.width.min || 0;
      const max = options.width.max || 9999;
      whereClauses.push(`
        CAST(SPLIT_PART(dimension, 'x', 2) AS NUMERIC) BETWEEN ${min} AND ${max}
      `);
    }

    const whereQuery =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const query = `SELECT * FROM free_size_gemstones ${whereQuery} ORDER BY created_at DESC`;
    const result = await pool.query(query, values);

    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error filtering free size gemstones:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
