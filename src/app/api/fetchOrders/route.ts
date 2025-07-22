import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_STORE_DOMAIN = "e4wqcy-up.myshopify.com";
const SHOPIFY_ADMIN_API_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const shopifyRes = await axios.get(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/orders.json`,
      {
        params: {
          email,
          status: "any",
        },
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_ACCESS_TOKEN || "",
          "Content-Type": "application/json",
        },
      }
    );

    const { orders } = shopifyRes.data;
    console.log("orders", orders[0]);

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: "No orders found" }, { status: 404 });
    }

    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      name: order.name,
      created_at: order.created_at,
      total_price: order.total_price,
      financial_status: order.financial_status,
      fulfillment_status: order.fulfillment_status,
      fulfillments: order.fulfillments,
      line_items: order.line_items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        image: item?.image,
      })),
    }));

    return NextResponse.json({ data: formattedOrders }, { status: 200 });
  } catch (error: any) {
    console.error(
      "GET /api/orders error:",
      error.response?.data || error.message
    );
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
