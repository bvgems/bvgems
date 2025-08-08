import { pool } from "@/lib/pool";
import { NextRequest, NextResponse } from "next/server";
import { getAllLooseGemstones } from "../lib/commonFunctions";

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

    const formattedData = result.rows.map((item) => {
      const formattedValue = `${item?.shape} ${item?.collection_slug} ${item?.size} - ${item?.id}`;

      return {
        ...item,
        value: formattedValue,
      };
    });
    const allGemstones = await getAllLooseGemstones();
    if (result.rows.length === 0 || allGemstones?.length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: formattedData, allGemstones },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
