import { pool } from "@/lib/pool";
import { sendEmail } from "@/utils/sendEmail";

export async function GET(request: Request) {
  // 🔒 Auth check
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { rows } = await pool.query(`
  SELECT *
  FROM checkout_carts
  WHERE status = 'pending'
  AND created_at < NOW() - INTERVAL '1 hour'
`);

  for (const cart of rows) {
    let email = cart.guest_email;

    if (!email && cart.user_id) {
      const user = await pool.query(
        `SELECT email FROM app_users WHERE id = $1`,
        [cart.user_id],
      );
      email = user.rows[0]?.email;
    }

    if (!email) continue;

    const items =
      typeof cart.cart === "string" ? JSON.parse(cart.cart) : cart.cart;

    const html = `
  <div style="font-family: 'Futura', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
    <!-- Logo -->
    <div style="text-align: center; padding: 30px 0 10px;">
      <img src="https://res.cloudinary.com/dabdvgxd4/image/upload/v1754420615/logo2_qhix5o.png" alt="B.V. Gems" style="height: 60px;" />
    </div>
    <!-- Headline -->
    <div style="text-align: center; padding: 20px 30px;">
      <h1 style="font-size: 28px; font-weight: bold; margin: 0;">Ready to checkout?</h1>
      <p style="font-size: 16px; color: #333; margin-top: 8px;">We've saved your order</p>
    </div>
    <!-- Cart Items -->
   ${items
     .map(
       (item: any) => `
  <div style="display: flex; align-items: center; padding: 16px 30px; border-top: 1px solid #eee;">
    <img src="${item?.product.image_url}" alt="${item?.product.title}" style="width: 120px; height: 120px; object-fit: cover; margin-right: 20px;" />
    <div>
      <p style="font-size: 16px; font-weight: bold; margin: 0;">${item?.product.title}</p>
      <p style="font-size: 16px; font-weight: bold; margin: 4px 0;">
        ${item?.product.price == 0 ? "Free Gift 🎁" : `$${item?.product.price}`}
      </p>
    </div>
  </div>
`,
     )
     .join("")}
    <!-- CTA Button -->
    <div style="text-align: center; padding: 30px;">
      <a href="https://www.bvgems.com/cart"
         style="background-color: #000; color: #fff; padding: 16px 40px; text-decoration: none; font-size: 16px; display: inline-block;">
        Complete your order
      </a>
    </div>
    <!-- Footer -->
    <div style="background-color: #111; color: #fff; text-align: center; padding: 20px; font-size: 12px;">
      <p style="margin: 0;">B.V Gems Inc • 66 West 47th Street, New York NY 10036, United States</p>
      <p style="margin: 8px 0 0;">No longer want to receive these emails? <a href="#" style="color: #aaa;">Unsubscribe</a></p>
      <p style="margin: 4px 0 0;">© 2026 B.V. Gems</p>
    </div>
  </div>
`;

    await sendEmail(email, "Your cart is waiting 🛒", html);

    await pool.query(
      `UPDATE checkout_carts SET status = 'abandoned' WHERE id = $1`,
      [cart.id],
    );
  }

  return Response.json({ success: true, processed: rows.length });
}
