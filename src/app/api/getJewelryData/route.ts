export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getAllJeweleryProducts } from "../lib/commonFunctions";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const RINGS_SHUFFLE_SEED = 42;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const result = await getAllJeweleryProducts(category);

    let products: any = [];

    if (category === "earrings") {
      const goldEarrings = result?.edges?.filter(
        (item: any) => item?.node?.jewelryType?.value === "Gold",
      );
      const silverEarrings = result?.edges?.filter(
        (item: any) => item?.node?.jewelryType?.value === "Silver",
      );
      const shuffledGoldEarrings = seededShuffle(
        goldEarrings,
        RINGS_SHUFFLE_SEED,
      );
      products = [...shuffledGoldEarrings, ...silverEarrings];
    } else if (category === "rings") {
      const original = result?.edges ?? [];

      // 👇 Explode each product into individual variant cards
      const exploded = original.flatMap((item: any) => {
        const node = item?.node;
        const variants = node?.variants?.edges ?? [];

        // If only 1 variant, keep the product as-is
        if (variants.length <= 1) {
          return [item];
        }

        // Map each variant into its own product-shaped object
        return variants.map((variantEdge: any) => {
          const variant = variantEdge?.node;
          return {
            node: {
              ...node,
              // Override with variant-specific data
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
              variants: {
                edges: [variantEdge], // only this variant
              },
              // carry over the gemstone metafield from variant
              gemstone: variant?.metafield?.value
                ? {
                    value: variant.metafield.value,
                    type: "single_line_text_field",
                  }
                : node?.gemstone,
              // keep original handle and id for linking
              handle: node?.handle,
              id: node?.id,
              _variantTitle: variant?.title, // optional: for debugging
            },
          };
        });
      });

      // Now shuffle the exploded list
      products = seededShuffle(exploded, RINGS_SHUFFLE_SEED);
    } else {
      products = result?.edges;
    }

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
