import { pool } from "@/lib/pool";
import { calculateNearestStones } from "@/utils/priceHelpers";

export const verifyCartPrices = async (cartItems: any[]) => {
  const verifiedCart = [];

  for (const item of cartItems) {
    if (!item?.product) continue;
    const verifiedItem = {
      ...item,
      product: { ...(item.product || {}) },
    };

    // Drop any legacy free gift items
    if (verifiedItem.product.isGift || String(verifiedItem.product.productId || "").includes("FREE-GIFT")) {
      continue;
    }

    const { productType, id, productId, quality, size, handle } = verifiedItem.product;

    try {
      if (productType === "stone") {
        const stoneId = productId || id;
        const dbRes = await pool.query(
          "SELECT price, ct_weight, collection_slug, type, quality, size FROM gemstone_specs WHERE id = $1", 
          [stoneId]
        );
        if (dbRes.rows.length > 0) {
          const dbProduct = dbRes.rows[0];
          const dbPrice = Number(dbProduct.price);
          const dbCtWeight = Number(dbProduct.ct_weight);
          
          // 1. Always enforce exact database ct_weight
          verifiedItem.product.ct_weight = dbCtWeight;
          
          const isLabGrown = dbProduct.type === 'Lab Grown' || dbProduct.quality === 'Lab Grown' || dbProduct.type === 'Lab-Grown' || dbProduct.quality === 'Lab-Grown';
          const isAlexOrParaiba = dbProduct.collection_slug === "Alexandrite" || dbProduct.collection_slug === "Paraiba Tourmaline";
          
          let allowPurchaseByCarat = true;
          if (isLabGrown) {
             const s = dbProduct.size;
             if (s === "1.00 mm" || s === "1.25 mm" || s === "1.50 mm" || s === "1.75 mm") {
                allowPurchaseByCarat = false;
             }
          }

          if (verifiedItem.product.purchaseByCarat && allowPurchaseByCarat) {
            // Per-carat price
            let perCaratPrice = 0;
            if (isLabGrown) {
              perCaratPrice = isAlexOrParaiba ? 85 : 50;
            } else if (dbCtWeight > 0) {
              perCaratPrice = Number((dbPrice / dbCtWeight).toFixed(2));
            } else {
              perCaratPrice = dbPrice;
            }
            verifiedItem.product.price = perCaratPrice;

            // Calculate nearest whole stones & actual total carats
            const requestedCarats = Number(verifiedItem.requestedCarats || verifiedItem.caratWeight || dbCtWeight);
            const { stoneCount, totalCarats } = calculateNearestStones(dbCtWeight, requestedCarats);
            verifiedItem.quantity = stoneCount;
            verifiedItem.caratWeight = String(totalCarats);
            verifiedItem.requestedCarats = requestedCarats;
          } else {
            // Bought by stone piece count
            verifiedItem.product.purchaseByCarat = false;
            let perStonePrice = 0;
            if (isLabGrown) {
              if (!allowPurchaseByCarat) {
                perStonePrice = dbPrice;
              } else {
                const rate = isAlexOrParaiba ? 85 : 50;
                perStonePrice = dbCtWeight > 0 ? Math.round((rate * dbCtWeight + 1e-6) * 100) / 100 : dbPrice;
              }
            } else {
              perStonePrice = dbPrice;
            }
            verifiedItem.product.price = perStonePrice;
            verifiedItem.quantity = Math.max(1, Math.round(Number(verifiedItem.quantity) || 1));
          }
        }
      } else if (productType === "freeSizeStone") {
        const freeStoneId = productId || id;
        const dbRes = await pool.query("SELECT price, ct_weight FROM free_size_gemstones WHERE id = $1", [freeStoneId]);
        if (dbRes.rows.length > 0 && dbRes.rows[0].price != null) {
          verifiedItem.product.price = Number(dbRes.rows[0].price);
          if (dbRes.rows[0].ct_weight != null) {
            verifiedItem.product.ct_weight = Number(dbRes.rows[0].ct_weight);
          }
          verifiedItem.quantity = 1;
        }
      } else if (
        handle &&
        (productType === "layouts" ||
          productType === "jewelry" ||
          productType === "ringJewelry" ||
          productType === "necklaceJewelry" ||
          productType === "braceletJewelry" ||
          productType === "bead" ||
          productType === "beads" ||
          productType === "earringJewelry")
      ) {
        const shopifyProduct = await fetchShopifyProduct(handle);
        if (shopifyProduct) {
          if (productType === "layouts") {
            const shapeSizesStr = shopifyProduct.shapeSizes?.value || shopifyProduct.metafield?.value;
            if (shapeSizesStr) {
              const parsed = JSON.parse(shapeSizesStr);
              const sizeData = parsed.find((s: any) => s.size === size);
              if (sizeData) {
                let basePrice = Number(sizeData.price);
                if (quality === "A") {
                  basePrice = basePrice * 0.75;
                }
                verifiedItem.product.price = basePrice;
              }
            }
          } else if (
            productType === "earringJewelry" &&
            shopifyProduct.earring_metafield?.value
          ) {
            try {
              const parsedEarrings = JSON.parse(shopifyProduct.earring_metafield.value);
              if (Array.isArray(parsedEarrings) && parsedEarrings.length > 0) {
                const targetCarat = String(verifiedItem.product.totalCaratWeight || "").trim();
                const matchedOption =
                  parsedEarrings.find((opt: any) => String(opt?.carat || "").trim() === targetCarat) ||
                  parsedEarrings[0];
                if (matchedOption?.price != null) {
                  verifiedItem.product.price = Number(matchedOption.price);
                }
              }
            } catch {
              const variant = shopifyProduct.variants?.edges?.[0]?.node;
              if (variant?.price?.amount != null) {
                verifiedItem.product.price = Number(variant.price.amount);
              }
            }
          } else {
            const edges: any[] = shopifyProduct.variants?.edges || [];
            const currentPrice = Number(verifiedItem.product.price);
            const sizeStr = String(size || "").trim();
            const matchedVariant =
              (sizeStr &&
                edges.find((e) => String(e?.node?.title || "").trim() === sizeStr)) ||
              edges.find(
                (e) =>
                  e?.node?.price?.amount != null &&
                  Math.abs(Number(e.node.price.amount) - currentPrice) < 0.01
              ) ||
              edges[0];

            const resolvedAmount = matchedVariant?.node?.price?.amount;
            if (resolvedAmount != null) {
              verifiedItem.product.price = Number(resolvedAmount);
              if (verifiedItem.product.variantPrice) {
                verifiedItem.product.variantPrice = Number(resolvedAmount);
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn("Non-fatal item price verification warning:", err);
    }
    
    verifiedCart.push(verifiedItem);
  }

  return verifiedCart;
};

const fetchShopifyProduct = async (handle: string) => {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        shapeSizes: metafield(namespace: "custom", key: "shape_sizes") {
          value
        }
        metafield(namespace: "custom", key: "shapeSizes") {
          value
        }
        earring_metafield: metafield(namespace: "custom", key: "earring_metafielcd") {
          value
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              price {
                amount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(process.env.SHOPIFY_STOREFRONT_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "c64a5e6dbfa340f0bff88be9fde4b7a8",
    },
    body: JSON.stringify({ query, variables: { handle } }),
  });

  const json = await response.json();
  return json?.data?.product;
};
