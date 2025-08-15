import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: Request) {
  try {
    const { cartItems, shopifyOrderId, email } = await req.json();

    const formatCurrency = (value: number) =>
      `$${Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;


    const line_items = cartItems.map((item: any) => {
      let amount: any;
      const product = item?.product ?? {};
      const isCalibrated = product?.productType === "stone";
      const isFreeGemstone = product?.productType === "freeSizeStone";

      if (isFreeGemstone) {
        amount = Number(product?.price) * Number(product?.ct_weight);
      } else if (isCalibrated) {
        if (product?.purchaseByCarat) {
          if (product?.ct_weight) {
            amount =
              Number(item?.caratWeight) *
              (Number(product?.price) / Number(product?.ct_weight));
          }
        } else {
          amount = Number(product?.price) * item?.quantity;
        }
      } else {
        amount = Number(product?.price) * item?.quantity;
      }

      const unit_amount = Math.max(
        0,
        Math.round((Number.isFinite(amount) ? amount : 0) * 100)
      );

      const productData: any = {
        name:
          product?.collection_slug && product?.shape
            ? `${product.collection_slug} - ${product.shape}`
            : product?.title || "Product",
      };

      if (isFreeGemstone) {
        productData.description = `
           Price per Carat: ${formatCurrency(product?.price)},\n
           Carat Weight Of Stone: ${product?.ct_weight}
        `;
      } else if (isCalibrated) {
        if (product?.purchaseByCarat) {
          const perCaratPrice =
            Number(product?.price) / Number(product?.ct_weight);

          productData.description = `
            Price per Carat: ${formatCurrency(perCaratPrice)},\n
            Purchased Carat: ${item?.caratWeight}\n
         `;
        }
      } else {
        productData.description = `
        Quantity: ${item?.quantity}\n
     `;
      }

      if (product?.image_url && String(product.image_url).trim()) {
        productData.images = [product.image_url];
      }

      return {
        price_data: {
          currency: "usd",
          product_data: productData,
          unit_amount,
        },
        quantity: 1,
      };
    });

    const origin = req.headers.get("origin") || "https://bvgems.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: email,
      success_url: `${origin}/payment-success?orderId=${shopifyOrderId}`,
      cancel_url: `${origin}/payment-cancelled?orderId=${shopifyOrderId}`,
      metadata: { shopifyOrderId },
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
