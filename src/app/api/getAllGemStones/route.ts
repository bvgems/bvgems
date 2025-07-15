import { pool } from "@/lib/pool";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = `
  SELECT *
  FROM (
      SELECT *,
             ROW_NUMBER() OVER (PARTITION BY collection_slug ORDER BY id) AS row_num
      FROM gemstone_specs
  ) AS ranked
  WHERE row_num <= 10
  ORDER BY random();
`;

    const result = await pool.query(query);

    const allGemStonesQuery = `SELECT * FROM gemstone_specs`;

    const allGemstones = await pool.query(allGemStonesQuery);

    if (result.rows.length === 0 || allGemstones?.rows?.length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    const formattedData = result.rows.map((item) => {
      const formattedValue = `${item?.ct_weight} cttw. ${item?.color} ${item?.shape} ${item?.collection_slug} ${item?.size}mm - ${item?.id}`;

      return {
        ...item,
        value: formattedValue,
      };
    });

    const allGemstonesFormattedData = allGemstones?.rows.map((item) => {
      const formattedValue = `${item?.ct_weight} cttw. ${item?.color} ${item?.shape} ${item?.collection_slug} ${item?.size}mm - ${item?.id}`;

      return {
        ...item,
        value: formattedValue,
      };
    });

    return NextResponse.json(
      { data: formattedData, allGemstones: allGemstonesFormattedData },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
