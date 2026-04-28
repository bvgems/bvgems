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
      const goldEarrings = shopifyProducts?.edges?.filter(
        (item: any) => item?.node?.jewelryType?.value === "Gold",
      );
      const silverEarrings = shopifyProducts?.edges?.filter(
        (item: any) => item?.node?.jewelryType?.value === "Silver",
      );
      fetchedProducts = [...goldEarrings, ...silverEarrings];
    } else {
      fetchedProducts = shopifyProducts?.edges;
    }

    const products = fetchedProducts || [];

    const filtered = products.filter((p: any) => {
      const node = p.node;

      return Object.keys(options).every((key) => {
        const val = options[key];
        if (!val || (Array.isArray(val) && val.length === 0)) return true;

        // ── Price filter ──────────────────────────────────────────────
        if (key === "price") {
          const [min, max] = val;
          const variantPrices =
            node.variants?.edges?.map((v: any) =>
              parseFloat(v.node.price.amount),
            ) || [];
          if (!variantPrices.length) return false;
          return variantPrices.some(
            (price: number) => price >= min && price <= max,
          );
        }

        // ── Rings: filter by variant-level gemstone metafield ─────────
        if (key === "collection_slug" && category === "rings") {
          const stones = Array.isArray(val) ? val : [val];
          return node.variants?.edges?.some((v: any) => {
            const gemstone = v?.node?.metafield?.value ?? "";
            return stones.some((s: string) =>
              gemstone.toLowerCase().includes(s.toLowerCase()),
            );
          });
        }

        // ── All other filters: product-level metafields ───────────────
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

    // ── For rings: explode filtered products into variant cards ───────
    let result = filtered;

    if (category === "rings") {
      // ✅ Use "collection_slug" to match the filter key above
      const selectedStones: string[] = options.collection_slug
        ? Array.isArray(options.collection_slug)
          ? options.collection_slug
          : [options.collection_slug]
        : [];

      result = filtered.flatMap((item: any) => {
        const node = item?.node;
        const variants = node?.variants?.edges ?? [];

        if (variants.length <= 1) return [item];

        // If stone filter active, only explode matching variants
        // ✅ Use .includes() to handle compound values like "Ruby and Blue Sapphire"
        const variantsToExplode =
          selectedStones.length > 0
            ? variants.filter((variantEdge: any) => {
                const gemstone = variantEdge?.node?.metafield?.value ?? "";
                return selectedStones.some((s: string) =>
                  gemstone.toLowerCase().includes(s.toLowerCase()),
                );
              })
            : variants;

        return variantsToExplode.map((variantEdge: any) => {
          const variant = variantEdge?.node;
          return {
            node: {
              ...node,
              title: variant?.title ?? node?.title,
              images: variant?.image
                ? {
                    edges: [
                      {
                        node: {
                          url: variant.image.url,
                          altText: variant.image.altText,
                        },
                      },
                    ],
                  }
                : node?.images,
              variants: { edges: [variantEdge] },
              gemstone: variant?.metafield?.value
                ? {
                    value: variant.metafield.value,
                    type: "single_line_text_field",
                  }
                : node?.gemstone,
              handle: node?.handle,
              id: node?.id,
              _variantTitle: variant?.title,
            },
          };
        });
      });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
