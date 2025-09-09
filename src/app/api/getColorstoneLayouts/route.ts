import { getLayouts } from "../lib/commonFunctions";

export async function GET(req: Request) {
  try {
    const result = await getLayouts();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch Shopify data" }),
      { status: 500 }
    );
  }
}
