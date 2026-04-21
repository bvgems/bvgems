import { pool } from "@/lib/pool";
import { sendEmail } from "@/utils/sendEmail";

export async function GET() {
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
      <h2>You left items behind 🛒</h2>
      <p>Come back and complete your purchase.</p>
      <a href="${process.env.BASE_URL}/recover-cart?id=${cart.id}">
        Complete Order
      </a>
    `;

    await sendEmail(email, "Your cart is waiting 🛒", html);

    await pool.query(
      `UPDATE checkout_carts SET status = 'abandoned' WHERE id = $1`,
      [cart.id],
    );
  }

  return Response.json({ success: true, processed: rows.length });
}
