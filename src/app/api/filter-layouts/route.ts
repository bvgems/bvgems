import { NextRequest, NextResponse } from "next/server";
import { getLayouts } from "../lib/commonFunctions";

// Map option keys to the node metafield keys
const METAFIELD_MAP: Record<
  string,
  { key: string; type?: "number" | "string" }
> = {
  gemstone: { key: "gemstone", type: "string" },
  shape: { key: "shape", type: "string" },
  type: { key: "layout_type", type: "string" },
  layoutType: { key: "jewelry_type", type: "string" },
  size: { key: "size", type: "string" },
  length: { key: "size", type: "number" },
  width: { key: "size", type: "number" },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const options = body.options || {};
    console.log("optionssss", options);

    const layouts = await getLayouts();

    const filtered = layouts?.edges?.filter((p: any) => {
      const node = p.node;

      const result = Object.keys(options).every((key) => {
        const val = options[key];

        if (
          !val ||
          (Array.isArray(val) && val.length === 0) ||
          (typeof val === "object" &&
            !Array.isArray(val) &&
            Object.keys(val).length === 0)
        ) {
          return true;
        }

        const mapDef = METAFIELD_MAP[key];
        if (!mapDef) {
          return true;
        }

        const metafield = node[mapDef.key];

        if (!metafield || !metafield.value) {
          return false;
        }

        if (key === "length" || key === "width") {
          const sizeValue = metafield.value; // e.g., "5x3"
          const dimensions = sizeValue.split("x");

          if (dimensions.length !== 2) {
            console.log(`Invalid size format for ${node.title}: ${sizeValue}`);
            return false;
          }

          const length = parseFloat(dimensions[0]);
          const width = parseFloat(dimensions[1]);

          if (isNaN(length) || isNaN(width)) {
            console.log(
              `Invalid numeric dimensions for ${node.title}: ${sizeValue}`
            );
            return false;
          }

          const targetValue = key === "length" ? length : width;

          // Handle object format like {min: 6, max: 6}
          if (
            typeof val === "object" &&
            !Array.isArray(val) &&
            val.min !== undefined &&
            val.max !== undefined
          ) {
            const match = targetValue >= val.min && targetValue <= val.max;
            console.log(`${key} range check for ${node.title}:`, {
              sizeValue,
              targetValue,
              min: val.min,
              max: val.max,
              match,
            });
            return match;
          }

          // Handle array format (if needed)
          if (Array.isArray(val)) {
            return val.some((filterItem) => {
              if (
                typeof filterItem === "string" &&
                filterItem.includes(" - ")
              ) {
                const [minStr, maxStr] = filterItem.split(" - ");
                const min = parseFloat(minStr);
                const max = parseFloat(maxStr);
                return targetValue >= min && targetValue <= max;
              }
              return targetValue === parseFloat(filterItem);
            });
          }

          // Handle single value
          return targetValue === Number(val);
        }

        if (mapDef.type === "number") {
          // Extract numeric value from metafield (handles "3.5mm" -> 3.5)
          const numVal = parseFloat(metafield.value);
          if (isNaN(numVal)) {
            return false;
          }

          // Handle array values (could be ranges or exact numbers)
          if (Array.isArray(val)) {
            return val.some((filterItem) => {
              // Handle range strings like "3.25 - 4.5"
              if (
                typeof filterItem === "string" &&
                filterItem.includes(" - ")
              ) {
                const [minStr, maxStr] = filterItem.split(" - ");
                const min = parseFloat(minStr);
                const max = parseFloat(maxStr);
                const match = numVal >= min && numVal <= max;
                return match;
              }
              // Handle exact number matches
              const exactMatch = numVal === parseFloat(filterItem);
              return exactMatch;
            });
          }

          // Handle single value
          const match = numVal === Number(val);
          return match;
        }

        // string comparison (case-insensitive)
        const metafieldValueLower = metafield.value.toLowerCase().trim();

        if (Array.isArray(val)) {
          const match = val.some(
            (v) => v.toString().toLowerCase().trim() === metafieldValueLower
          );
          return match;
        } else {
          const match =
            metafieldValueLower === val.toString().toLowerCase().trim();
          return match;
        }
      });

      return result;
    });

    console.log("filteredd", filtered[0]?.node?.size);
    console.log("Filtered count:", filtered?.length || 0);
    return NextResponse.json({ data: filtered });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
