import { NextRequest } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    const response = await axios.post(
      `${process.env.SHOPIFY_ADMIN_API_URL}/orders.json`,
      orderData,
      {
        headers: {
          "X-Shopify-Access-Token":
            process.env.SHOPIFY_ACCESS_TOKEN ||
            process.env.SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(
      JSON.stringify({
        flag: true,
        order: response.data.order,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in creating shopify order:", error);

    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }

    return new Response(
      JSON.stringify({
        flag: false,
        error: "Internal Server Error",
        details: error.response?.data || error.message,
        status: error.response?.status,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
