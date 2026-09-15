import { GetProductByHandle } from "@/app/Graphql/queries";
import LayoutProductPage from "@/components/ColorstoneLayoutsGridView/LayoutProductPage";

async function getLayoutDataByHandle(layout: string) {
  const shopifyRes = await fetch(process.env.SHOPIFY_STOREFRONT_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token":
        process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({
      query: GetProductByHandle,
      variables: { handle: layout },
    }),
  });

  const result = await shopifyRes.json();
  return result?.data?.productByHandle;
}

export default async function LayoutPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const layoutData = await getLayoutDataByHandle(handle);

  return <LayoutProductPage product={layoutData} />;
}
