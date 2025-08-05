import { pool } from "@/lib/pool";
import { NextRequest, NextResponse } from "next/server";

const getCleanedOptions = (options: any) => {
  const cleanedOptions: any = {};

  for (const key in options) {
    if (
      options[key] !== null &&
      options[key] !== undefined &&
      options[key] !== "" &&
      !(Array.isArray(options[key]) && options[key].length === 0)
    ) {
      cleanedOptions[key] = options[key];
    }
  }

  return cleanedOptions;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const options = body.options;
    const cleanedOptions = getCleanedOptions(options);
    console.log("cleannn", cleanedOptions);
    const whereClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (Object.keys(cleanedOptions).length > 0) {
      if (cleanedOptions.collection_slug) {
        whereClauses.push(`collection_slug = ANY($${paramIndex++}::text[])`);
        values.push(cleanedOptions.collection_slug);
      }
      if (cleanedOptions.shape) {
        whereClauses.push(`shape = ANY($${paramIndex++}::text[])`);
        values.push(cleanedOptions.shape);
      }
      if (cleanedOptions.color) {
        whereClauses.push(`color = ANY($${paramIndex++}::text[])`);
        values.push(cleanedOptions.color);
      }

      const whereQuery =
        whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
      const query = `SELECT * FROM gemstone_specs ${whereQuery}`;
      const queryResults = await pool.query(query, values);

      if (queryResults?.rows?.length > 0) {
        const formattedData = queryResults.rows.map((item) => {
          const formattedValue = `${item?.ct_weight} cttw. ${item?.color} ${item?.shape} ${item?.collection_slug} ${item?.size}mm - ${item?.id}`;

          return {
            ...item,
            value: formattedValue,
          };
        });

        return NextResponse.json({ data: formattedData }, { status: 200 });
      }

      const defaultWheres: string[] = [];
      const defaultValues: any[] = [];
      let index = 1;

      for (const key in cleanedOptions) {
        defaultWheres.push(`${key} = ANY($${index++}::text[])`);
        defaultValues.push(cleanedOptions[key]);
      }

      const fallbackWhere =
        defaultWheres.length > 0 ? `WHERE ${defaultWheres.join(" OR ")}` : "";
      const fallbackQuery = `SELECT * FROM gemstone_specs ${fallbackWhere}`;
      const fallbackResults = await pool.query(fallbackQuery, defaultValues);

      if (fallbackResults?.rows?.length > 0) {
        const formattedFallbackData = fallbackResults.rows.map((item) => {
          const formattedValue = `${item?.ct_weight} cttw. ${item?.color} ${item?.shape} ${item?.collection_slug} ${item?.size}mm - ${item?.id}`;

          return {
            ...item,
            value: formattedValue,
          };
        });

        return NextResponse.json(
          { data: formattedFallbackData },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "No gemstones found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "No valid filters provided" },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
