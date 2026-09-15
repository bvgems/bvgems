import { NextRequest } from "next/server";
import axios from "axios";
import { verifyCartPrices } from "../lib/verifyCartPrices";
import { getOrderPayload } from "@/utils/commonFunctions";
import { pool } from "@/lib/pool";

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json();
    const {
      cartItems,
      email,
      deliveryMethod,
      shippingAddress,
      selectedShippingAddress,
      user,
      guestUser,
      paymentMethod,
    } = rawData;

    // 1. Verify User Authentication and Memo Approval
    if (!user || !user.id) {
      return new Response(JSON.stringify({ flag: false, error: "Unauthorized" }), { status: 401 });
    }

    const dbUserRes = await pool.query(
      "SELECT is_memo_purchase_approved FROM app_users WHERE id = $1",
      [user.id]
    );

    if (dbUserRes.rows.length === 0 || !dbUserRes.rows[0].is_memo_purchase_approved) {
      return new Response(JSON.stringify({ flag: false, error: "Memo purchase not approved" }), { status: 403 });
    }

    // 2. Verify Prices
    let verifiedCartItems = cartItems;
    try {
      verifiedCartItems = await verifyCartPrices(cartItems);
      console.log("Cart prices verified for Memo order");
    } catch (err: any) {
      return new Response(JSON.stringify({ flag: false, error: "Failed to verify cart prices" }), { status: 400 });
    }

    // 3. Build Payload
    const orderPayload = getOrderPayload(
      paymentMethod,
      deliveryMethod,
      shippingAddress,
      selectedShippingAddress,
      user,
      guestUser,
      verifiedCartItems
    );
    
    // Subtotal and shipping could be recalculated here for safety,
    // but Shopify custom line items use the price we give them anyway.
    
    // Add same totals for memo orders
    const subtotal = verifiedCartItems.reduce((acc: number, item: any) => acc + (Number(item.product.price) * item.quantity), 0);
    const shippingTotal = (deliveryMethod === "delivery" && subtotal < 200 && subtotal > 0) ? 15 : 0;
    
    (orderPayload as any).subtotal = subtotal;
    (orderPayload as any).shipping = shippingTotal;
    (orderPayload as any).grandTotal = subtotal + shippingTotal;

    const response = await axios.post(
      `${process.env.SHOPIFY_ADMIN_API_URL}/orders.json`,
      orderPayload,
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
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

    return new Response(
      JSON.stringify({
        flag: false,
        error: "Internal Server Error",
        details: error.response?.data || error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
