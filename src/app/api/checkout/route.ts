import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: Request) {
  try {
    const { cartItems, shopifyOrderId, email } = await req.json();
    const line_items = cartItems.map((item: any) => {
      const productData: any = {
        name: `${item.product.collection_slug} - ${item.product.shape}`,
      };

      if (item.product.image_url?.trim()) {
        productData.images = [item.product.image_url];
      }

      return {
        price_data: {
          currency: "usd",
          product_data: productData,
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    console.log('origin',origin)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: "fenil2926@gmail.com",
      success_url: `${origin}/payment-success?orderId=${shopifyOrderId}`,
      cancel_url: `${origin}/payment-cancelled?orderId=${shopifyOrderId}`,
      metadata: {
        shopifyOrderId,
      },
    });

    return NextResponse.json({ id: session.id }, { status: 200 });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe session" },
      { status: 500 }
    );
  }
}
