import FAQClient from "./FAQClient";
import { getFAQs } from "@/app/Graphql/queries";

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  let faqContent = null;
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
          query: getFAQs,
        }),
      }
    );
    const result = await shopifyRes.json();
    const rawValue = result?.data?.page?.metafield?.value;
    
    if (rawValue) {
      const firstParse = JSON.parse(rawValue);
      faqContent = typeof firstParse === "string" ? JSON.parse(firstParse) : firstParse;
    }
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
  }

  return <FAQClient faqContent={faqContent} />;
}
