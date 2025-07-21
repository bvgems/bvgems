import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

async function sendOrderReceipt(shopifyOrderId: string) {
  try {
    const orderResponse = await axios.get(
      `https://e4wqcy-up.myshopify.com/admin/api/2024-04/orders/${shopifyOrderId}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const order = orderResponse.data.order;

    await axios.put(
      `https://e4wqcy-up.myshopify.com/admin/api/2024-04/orders/${shopifyOrderId}.json`,
      {
        order: {
          id: shopifyOrderId,
          financial_status: "paid",
          send_receipt: true,
          tags: order.tags
            ? `${order.tags}, payment-received`
            : "payment-received",
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
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      `✅ Fallback payment notification sent for order ${shopifyOrderId}`
    );
  } catch (error: any) {
    console.error(
      "❌ Fallback payment notification failed:",
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
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    console.log("✅ Stripe Event Received:", event.type);
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const shopifyOrderId = session.metadata?.shopifyOrderId;
    const amount = session.amount_total! / 100;

    console.log("📦 Shopify Order:", shopifyOrderId, "💳 Amount:", amount);

    if (shopifyOrderId) {
      try {
        const transactionResponse = await axios.post(
          `https://e4wqcy-up.myshopify.com/admin/api/2024-04/orders/${shopifyOrderId}/transactions.json`,
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
              "X-Shopify-Access-Token":
                process.env.SHOPIFY_ACCESS_TOKEN,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(`✅ Shopify order ${shopifyOrderId} marked as paid.`);

        await sendOrderReceipt(shopifyOrderId);
      } catch (err: any) {
        console.error(
          "❌ Failed to process payment or send receipt:",
          err?.response?.data || err.message
        );
      }
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}
