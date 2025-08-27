import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const query = `
    {
      page(handle: "about-us") {
        title
        body   # full HTML content
      }
    }
  `;

  try {
    const res = await fetch(process.env.SHOPIFY_STOREFRONT_URL!, {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 },
    });

    const json = await res.json();

    // Shopify’s response is nested under json.data.page
    const page = json?.data?.page;

    if (!page) {
      return NextResponse.json({ error: "No page found" }, { status: 404 });
    }

    // If you want plain text (no <p> tags), strip HTML
    const plainText = page.body.replace(/<[^>]*>/g, "").trim();
    console.log("page full content:", plainText);

    // Return the full HTML so frontend can render it nicely
    return NextResponse.json(
      {
        title: page.title,
        body: page.body,
        plainText,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Shopify fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Shopify data" },
      { status: 500 }
    );
  }
}
