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
      shippingOption = "2day",
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
    const subtotal = verifiedCartItems.reduce((acc: number, item: any) => {
      let itemTotal = 0;
      const product = item?.product ?? {};
      const isCalibrated = product?.productType === "stone";
      const isFreeGemstone = product?.productType === "freeSizeStone";

      if (isFreeGemstone) {
        itemTotal = Number(product?.price) * Number(product?.ct_weight || 1);
      } else if (isCalibrated && product?.purchaseByCarat) {
        itemTotal = Number(product?.price) * Number(item?.caratWeight || product?.ct_weight || 1);
      } else {
        itemTotal = Number(product?.price) * (Number(item?.quantity) || 1);
      }

      if (product?.needCertification) {
        itemTotal += 75 * (product?.purchaseByCarat ? 1 : (Number(item?.quantity) || 1));
      }

      return acc + itemTotal;
    }, 0);
    let shippingTotal = 0;
    if (deliveryMethod === "delivery" && subtotal > 0) {
      if (subtotal >= 500) {
        shippingTotal = shippingOption === "overnight" ? 15 : 0;
      } else {
        shippingTotal = shippingOption === "overnight" ? 38 : 23;
      }
    }

    const shippingTitle =
      deliveryMethod === "store"
        ? "Store Pickup (New York, NY)"
        : shippingOption === "overnight"
          ? "Priority Overnight Shipping"
          : "2 Days Shipping";

    (orderPayload.order as any).shipping_lines = [
      {
        title: shippingTitle,
        price: shippingTotal.toFixed(2),
        code:
          deliveryMethod === "store"
            ? "store_pickup"
            : shippingOption === "overnight"
              ? "priority_overnight"
              : "2_days",
      },
    ];
    
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
