import StorePolicyClient from "./StorePolicyClient";
import { getStorePolicyPage } from "@/app/Graphql/queries";

export const dynamic = "force-dynamic";

export default async function StorePolicy() {
  let policyContent = null;
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
          query: getStorePolicyPage,
        }),
      }
    );
    const result = await shopifyRes.json();
    if (result?.data?.page?.metafield?.value) {
      policyContent = JSON.parse(result.data.page.metafield.value);
    }
  } catch (error) {
    console.error("Failed to fetch store policy:", error);
  }

  return <StorePolicyClient policyContent={policyContent} />;
}
