import { shopifyQuery } from "@/app/Graphql/queries";
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
      "https://e4wqcy-up.myshopify.com/api/2024-04/graphql.json",
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
