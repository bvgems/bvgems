import { pool } from "@/lib/pool";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: Request) {
  try {
    const {
      cartItems,
      email,
      deliveryMethod,
      shippingAddress,
      selectedShippingAddress,
      user,
      guestUser,
      paymentMethod,
    } = await req.json();

    const userId = user?.id || null;
    const guestEmail = !user?.id ? guestUser?.email || email : null;

    const result = await pool.query(
      `INSERT INTO checkout_carts (cart, user_id, guest_email)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [JSON.stringify(cartItems), userId, guestEmail]
    );
    const cartId = result.rows[0].id;
    const formatCurrency = (value: number) =>
      `$${Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const line_items = cartItems.map((item: any) => {
      let amount: number = 0;
      const product = item?.product ?? {};
      const isCalibrated = product?.productType === "stone";
      const isFreeGemstone = product?.productType === "freeSizeStone";

      if (isFreeGemstone) {
        amount = Number(product?.price) * Number(product?.ct_weight);
      } else if (isCalibrated) {
        if (product?.purchaseByCarat) {
          if (product?.ct_weight) {
            amount = Number(product?.price) * Number(item?.caratWeight);
          }
        } else {
          amount = Number(product?.price) * (item?.quantity || 1);
        }
      } else {
        amount = Number(product?.price) * (item?.quantity || 1);
      }

      if (product?.needCertification) {
        amount = amount + 75 * item?.quantity;
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
      } else if (isCalibrated && product?.purchaseByCarat) {
        productData.description = `
            Per Carat Price : ${formatCurrency(Number(product?.price))},\n
            Purchased Carat: ${item?.caratWeight}\n
        `;
      } else {
        productData.description = `Quantity: ${item?.quantity}\n`;
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

    const origin = req.headers.get("origin") || process.env.BASE_URL;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: email,
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-cancelled`,
      metadata: {
        deliveryMethod: deliveryMethod || "",
        shippingAddress: JSON.stringify(shippingAddress || {}),
        selectedShippingAddress: JSON.stringify(selectedShippingAddress || {}),
        user: JSON.stringify(user || {}),
        guestUser: JSON.stringify(guestUser || {}),
        cart: cartId,
        paymentMethod: paymentMethod || "online",
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
