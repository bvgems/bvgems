import { NextResponse } from "next/server";
import axios from "axios";
import { sendEmail } from "@/utils/sendEmail";

const SHOPIFY_HEADERS = {
  "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
  "Content-Type": "application/json",
};

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data } = await axios.get(
    `${process.env.SHOPIFY_ADMIN_API_URL}/orders.json`,
    {
      headers: SHOPIFY_HEADERS,
      params: {
        fulfillment_status: "fulfilled",
        status: "any",
        updated_at_min: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        limit: 250,
        fields: "id,name,email,customer,fulfillments,tags",
      },
    },
  );

  const results = { checked: 0, emailed: 0, skipped: 0, errors: [] as any[] };

  for (const order of data.orders) {
    console.log("***********order************", order);
    results.checked++;

    const email = order.email;
    if (!email) {
      results.skipped++;
      continue;
    }

    // Skip if already emailed
    const tags: string[] = (order.tags || "")
      .split(", ")
      .map((t: string) => t.trim());
    if (tags.includes("thank-you-sent")) {
      results.skipped++;
      continue;
    }

    // Only trigger after delivery confirmed
    const isDelivered = order.fulfillments?.some(
      (f: any) => f.shipment_status === "delivered",
    );
    if (!isDelivered) {
      results.skipped++;
      continue;
    }

    const name = order.customer?.first_name || "there";
    const orderId = order.name; // e.g. "#1042"
    const googleReviewUrl = process.env.GOOGLE_REVIEW_URL;

    const html = `
      <div style="font-family: 'Futura', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">

        <!-- Logo -->
        <div style="text-align: center; padding: 30px 0 10px;">
          <img src="https://res.cloudinary.com/dabdvgxd4/image/upload/v1754420615/logo2_qhix5o.png" alt="B.V. Gems" style="height: 60px;" />
        </div>

        <!-- Headline -->
        <div style="text-align: center; padding: 20px 30px 10px;">
          <h1 style="font-size: 28px; font-weight: bold; margin: 0;">Thank you for shopping<br/>with us!</h1>
          <p style="font-size: 16px; color: #333; margin-top: 8px;">Order ${orderId} has been delivered</p>
        </div>

        <!-- Body -->
        <div style="padding: 10px 40px 20px; text-align: center;">
          <p style="font-size: 15px; color: #444; line-height: 1.7; margin: 0 0 12px;">
            Hi ${name}, we truly value every one of our customers, so I wanted to send a quick note to say thank you for supporting our business.
          </p>
          <p style="font-size: 15px; color: #444; line-height: 1.7; margin: 0 0 12px;">
            If you have any questions, please reach out — we're always happy to help in any way we can.
          </p>
          <p style="font-size: 15px; color: #444; line-height: 1.7; margin: 0;">
            We hope to see you again soon!
          </p>
        </div>

        <!-- Divider -->
        <div style="border-top: 1px solid #eee; margin: 20px 40px;"></div>

        <!-- Review CTA -->
        <div style="text-align: center; padding: 10px 30px 30px;">
          <p style="font-size: 13px; color: #aaa; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px;">Your opinion matters</p>
          <h2 style="font-size: 20px; font-weight: bold; margin: 0 0 8px;">Don't forget to share your experience!</h2>
          <p style="font-size: 14px; color: #666; margin: 0 0 20px;">
            Leaving a quick Google review takes less than a minute and helps us serve you better.
          </p>
          <a href="${googleReviewUrl}"
             style="background-color: #000; color: #fff; padding: 16px 40px; text-decoration: none; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; display: inline-block;">
            Leave a Google Review ★
          </a>
          <p style="font-size: 12px; color: #bbb; margin-top: 10px;">Takes less than 60 seconds · Opens in Google</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #111; color: #fff; text-align: center; padding: 20px; font-size: 12px;">
          <p style="margin: 0;">B.V Gems Inc • 66 West 47th Street, New York NY 10036, United States</p>
          <p style="margin: 8px 0 0;">No longer want to receive these emails? <a href="#" style="color: #aaa;">Unsubscribe</a></p>
          <p style="margin: 4px 0 0;">© 2026 B.V. Gems</p>
        </div>

      </div>
    `;

    try {
      // 1. Tag the order FIRST (idempotency guard — same logic as marking 'abandoned')
      const newTags = [...tags, "thank-you-sent"].join(", ");
      await axios.put(
        `${process.env.SHOPIFY_ADMIN_API_URL}/orders/${order.id}.json`,
        { order: { id: order.id, tags: newTags } },
        { headers: SHOPIFY_HEADERS },
      );

      // 2. Send email
      await sendEmail(email, `Thank you for your order, ${name}! 💎`, html);

      results.emailed++;
    } catch (err: any) {
      results.errors.push({ orderId, error: err.message });
    }
  }

  return Response.json({ success: true, ...results });
}
