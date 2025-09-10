import { NextRequest, NextResponse } from "next/server";
import { getAllJeweleryProducts } from "../lib/commonFunctions";

const METAFIELD_MAP: Record<
  string,
  { key: string; type?: "number" | "string" }
> = {
  color: { key: "color" },
  shape: { key: "shape" },
  types: { key: "jewelryType" },
  collection_slug: { key: "gemstone" },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const options = body.options || {};
    const category = body.category;

    const shopifyProducts = await getAllJeweleryProducts(category);
    let fetchedProducts: any = [];
    if (category === "earrings") {
      const goldEarrings = shopifyProducts?.edges?.filter((item: any) => {
        return item?.node?.jewelryType?.value === "Gold";
      });

      const silverEarrings = shopifyProducts?.edges?.filter((item: any) => {
        return item?.node?.jewelryType?.value === "Silver";
      });

      fetchedProducts = [...goldEarrings, ...silverEarrings];
    } else {
      fetchedProducts = shopifyProducts?.edges;
    }
    const products = fetchedProducts || [];
    console.log('shoppppp',products)

    const filtered = products.filter((p: any) => {
      const node = p.node;

      return Object.keys(options).every((key) => {
        const val = options[key];

        if (!val || (Array.isArray(val) && val.length === 0)) return true;

        if (key === "price") {
          const [min, max] = val;
          const variantPrices =
            node.variants?.edges?.map((v: any) =>
              parseFloat(v.node.price.amount)
            ) || [];

          if (!variantPrices.length) return false;

          return variantPrices.some(
            (price: number) => price >= min && price <= max
          );
        }

        const mapDef = METAFIELD_MAP[key];
        if (!mapDef) return true;

        const metafield = node[mapDef.key];

        if (!metafield || !metafield.value) return false;

        if (mapDef.type === "number") {
          const numVal = parseFloat(metafield.value);
          if (isNaN(numVal)) return false;

          if (Array.isArray(val) && val.length === 2) {
            const [min, max] = val;
            return numVal >= min && numVal <= max;
          }
          return numVal === Number(val);
        }

        if (Array.isArray(val)) {
          return val.includes(metafield.value);
        } else {
          return metafield.value === val.toString();
        }
      });
    });

    return NextResponse.json({ data: filtered });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
