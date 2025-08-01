import { GetAllBeads, shopifyQuery } from "@/app/Graphql/queries";
import { pool } from "@/lib/pool";

export const getAllLooseGemstones = async () => {
  try {
    const allGemStonesQuery = `SELECT * FROM gemstone_specs`;

    const allGemstones = await pool.query(allGemStonesQuery);
    const allGemstonesFormattedData = allGemstones?.rows.map((item) => {
      const formattedValue = `${item?.ct_weight} cttw. ${item?.color} ${item?.shape} ${item?.collection_slug} ${item?.size}mm - ${item?.id}`;

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
          query: shopifyQuery,
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
  try {
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
          query: GetAllBeads,
          variables: { first: 100 },
        }),
      }
    );

    const result = await shopifyRes.json();
    const allProducts = result?.data?.products;

    const filteredProducts = allProducts?.edges.filter(
      (product: any) =>
        product?.node?.metafield?.value &&
        product?.node.metafield.value === '["Beads"]'
    );
    return filteredProducts;
  } catch (error) {
    console.error(error);
  }
};
