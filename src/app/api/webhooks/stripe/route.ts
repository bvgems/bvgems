import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getOrderPayload } from "@/utils/commonFunctions";
import { pool } from "@/lib/pool";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

async function sendOrderReceipt(shopifyOrderId: string) {
  try {
    const orderResponse = await axios.get(
      `${process.env.SHOPIFY_ADMIN_API_URL}/orders/${shopifyOrderId}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
          "Content-Type": "application/json",
        },
      }
    );

    const order = orderResponse.data.order;

    await axios.put(
      `${process.env.SHOPIFY_ADMIN_API_URL}/orders/${shopifyOrderId}.json`,
      {
        order: {
          id: shopifyOrderId,
          financial_status: "paid",
          send_receipt: true,
          note_attributes: [
            ...(order.note_attributes || []),
            {
              name: "payment_status_updated",
              value: new Date().toISOString(),
            },
          ],
        },
      },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Receipt sent for order ${shopifyOrderId}`);
  } catch (error: any) {
    console.error(
      "❌ Failed to send receipt:",
      error?.response?.data || error.message
    );
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    console.log("called the webhook");
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    console.log("✅ Stripe Event Received:", event.type);
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const amount = session.amount_total! / 100;


    try {
      const cartId = session.metadata?.cart;

      const { rows } = await pool.query(
        "SELECT * FROM checkout_carts WHERE id = $1",
        [cartId]
      );
      const cartData = rows[0];

      let cartItems: any[] = [];

      try {
        if (typeof cartData?.cart === "string") {
          cartItems = JSON.parse(cartData.cart);
        } else if (Array.isArray(cartData?.cart)) {
          cartItems = cartData.cart;
        }
      } catch (err) {
        console.error("❌ Failed parsing cart data:", err);
        cartItems = [];
      }

      const orderPayload = getOrderPayload(
        "online",
        session.metadata?.deliveryMethod,
        JSON.parse(session.metadata?.shippingAddress || "{}"),
        JSON.parse(session.metadata?.selectedShippingAddress || "{}"),
        JSON.parse(session.metadata?.user || "{}"),
        JSON.parse(session.metadata?.guestUser || "{}"),
        cartItems
      );

      console.log(
        "📝 Final Shopify Payload:",
        JSON.stringify(orderPayload, null, 2)
      );

      const orderResponse = await axios.post(
        `${process.env.SHOPIFY_ADMIN_API_URL}/orders.json`,
        orderPayload,
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
            "Content-Type": "application/json",
          },
        }
      );

      const shopifyOrderId = orderResponse.data.order.id;

      console.log(`✅ Shopify order ${shopifyOrderId} created.`);

      await axios.post(
        `${process.env.SHOPIFY_ADMIN_API_URL}/orders/${shopifyOrderId}/transactions.json`,
        {
          transaction: {
            kind: "sale",
            source: "external",
            status: "success",
            amount: amount.toString(),
            currency: session.currency?.toUpperCase() || "USD",
            gateway: "stripe",
            source_name: "web",
            test: process.env.NODE_ENV !== "production",
          },
        },
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`✅ Transaction logged for order ${shopifyOrderId}`);

      await sendOrderReceipt(shopifyOrderId);
    } catch (err: any) {
      console.error(
        "❌ Failed creating Shopify order after Stripe payment:",
        err?.response?.data || err.message
      );
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}
