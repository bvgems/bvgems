import { GetAllBeads, shopifyQuery } from "@/app/Graphql/queries";
import { pool } from "@/lib/pool";

export const getLayouts = async () => {
  const variables = {
    category: `product_type:layouts`,
  };

  const shopifyRes = await fetch(process.env.SHOPIFY_STOREFRONT_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": "c64a5e6dbfa340f0bff88be9fde4b7a8",
    },
    body: JSON.stringify({
      query: `
          query getProductsByCategory($category: String!) {
            products(
              first: 150, 
              query: $category, 
              sortKey: CREATED_AT, 
            ) {
              edges {
                node {
                  id
                  title
                  handle
                  description
                  productType
                  createdAt
                  tags
                  images(first: 2) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }

                   layout_type:metafield(namespace: "custom", key: "layout_type") {
            value
            type
          }

           jewelry_type:metafield(namespace: "custom", key: "jewelry_type") {
            value
            type
          }
                
                  gemstone: metafield(namespace: "custom", key: "gemstone") {
                    value
                    type
                  }
                 
                  shape: metafield(namespace: "custom", key: "shape") {
                    value
                    type
                  }
                     size: metafield(namespace: "custom", key: "size") {
                    value
                    type
                  }
                  color: metafield(namespace: "custom", key: "Color") {
                    value
                    type
                  }
                  ct_weight: metafield(namespace: "custom", key: "ct_weight") {
                    value
                    type
                  }
                  variants(first: 10) {
                    edges {
                      node {
                        price {
                          amount
                          currencyCode
                        }
                        title
                        image {
                          url
                          altText
                        }
                        sku
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      variables,
    }),
  });

  const result = await shopifyRes.json();
  return result?.data?.products;
};

export const getAllLooseGemstones = async () => {
  try {
    const allGemStonesQuery = `SELECT * FROM gemstone_specs`;

    const allGemstones = await pool.query(allGemStonesQuery);
    const allGemstonesFormattedData = allGemstones?.rows.map((item) => {
      const formattedValue = `${item?.shape} ${item?.collection_slug} ${item?.size} - ${item?.id}`;

      return {
        ...item,
        value: formattedValue,
      };
    });

    return allGemstonesFormattedData;
  } catch (error) {
    console.error("Something went wrong while fetching all the gemstones!");
  }
};

export const getAllFreeSizeGemstones = async () => {
  try {
    const allGemStonesQuery = `SELECT * FROM free_size_gemstones`;

    const allGemstones = await pool.query(allGemStonesQuery);
    const allGemstonesFormattedData = allGemstones?.rows.map((item) => {
      const formattedValue = `${item?.shape} ${item?.gemstone_type} ${item?.dimension} - ${item?.id}`;

      return {
        ...item,
        value: formattedValue,
      };
    });

    return allGemstonesFormattedData;
  } catch (error) {
    console.error("Something went wrong while fetching all the gemstones!");
  }
};

export const getAllJeweleryProducts = async (category: any) => {
  try {
    const variables = {
      category: `product_type:${category}`,
    };

    const isEarrings = category?.toLowerCase() === "earrings";

    const shopifyRes = await fetch(
      process.env.SHOPIFY_STOREFRONT_URL as string,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            "c64a5e6dbfa340f0bff88be9fde4b7a8",
        },
        body: JSON.stringify({
          query: `
            query getProductsByCategory($category: String!) {
              products(
                first: 150, 
                query: $category, 
                sortKey: CREATED_AT, 
                reverse: ${!isEarrings}   # 👈 dynamic reverse flag
              ) {
                edges {
                  node {
                    id
                    title
                    handle
                    description
                    productType
                    createdAt
                    tags
                    images(first: 2) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                    showshapeoptions: metafield(namespace: "custom", key: "showshapeoptions") {
                      value
                      type
                    }
                       bestSelling: metafield(namespace: "custom", key: "best_selling") {
                      value
                      type
                    }
                    isTwoStoneRing: metafield(namespace: "custom", key: "istwostonering") {
                      value
                      type
                    }
                    gemstone: metafield(namespace: "custom", key: "gemstone") {
                      value
                      type
                    }
                    stoneType: metafield(namespace: "custom", key: "stone_type") {
                      value
                      type
                    }
                    jewelryType: metafield(namespace: "custom", key: "jewelry_type") {
                      value
                      type
                    }
                    shape: metafield(namespace: "custom", key: "shape") {
                      value
                      type
                    }
                    color: metafield(namespace: "custom", key: "Color") {
                      value
                      type
                    }
                    ct_weight: metafield(namespace: "custom", key: "ct_weight") {
                      value
                      type
                    }
                    customization: metafield(namespace: "custom", key: "customization") {
                      value
                      type
                    }
                    showGoldColor: metafield(namespace: "custom", key: "showGoldColor") {
                      value
                      type
                    }
                    DiamondWeight: metafield(namespace: "custom", key: "diamonds") {
                      value
                      type
                    }
                    TotalWeight: metafield(namespace: "custom", key: "total_gemstone_ct_weight") {
                      value
                      type
                    }
                    TargetGender: metafield(namespace: "custom", key: "target_gender") {
                      value
                      type
                    }
                    firstShape: metafield(namespace: "custom", key: "first_stone") {
                      value
                      type
                    }
                    secondShape: metafield(namespace: "custom", key: "second_stone") {
                      value
                      type
                    }
                         earring_metafielcd:metafield(namespace: "custom", key: "earring_metafielcd") {
            value
            type
          }
                    variants(first: 10) {
                      edges {
                        node {
                          price {
                            amount
                            currencyCode
                          }
                          title
                          image {
                            url
                            altText
                          }
                             metafield(namespace: "custom", key: "gemstones") {
                            value
                              }
                          sku
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
          variables,
        }),
      }
    );

    const result = await shopifyRes.json();
    return result?.data?.products;
  } catch (error) {
    console.error(
      "Something went wrong while fetching all the jewlery gemstones!"
    );
  }
};

export const getBusinessReferences = async (userId: any) => {
  try {
    const result = await pool.query(
      `SELECT * FROM business_reference WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return result?.rows;
  } catch (error) {
    console.error("GET error:", error);
  }
};

export const getBeads = async () => {
  let allProducts: any[] = [];
  let hasNextPage = true;
  let endCursor = null;

  try {
    while (hasNextPage) {
      const res:any = await fetch(process.env.SHOPIFY_STOREFRONT_URL as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            "c64a5e6dbfa340f0bff88be9fde4b7a8",
        },
        body: JSON.stringify({
          query: GetAllBeads,
          variables: { first: 250, after: endCursor },
        }),
      });

      const result = await res.json();
      const products = result?.data?.products;

      const edges = products?.edges || [];
      allProducts.push(...edges);

      console.log(
        `Fetched ${edges.length} products, total so far: ${allProducts.length}`
      );

      hasNextPage = products?.pageInfo?.hasNextPage;
      endCursor = products?.pageInfo?.endCursor;
    }

    // Filter products by "Beads"
    const beads = allProducts.filter((p: any) => {
      return p?.node?.metafield?.value === '["Beads"]';
    });

    console.log(`✅ Total beads found: ${beads.length}`);
    return beads;
  } catch (error) {
    console.error("❌ Error fetching beads:", error);
    return [];
  }
};
