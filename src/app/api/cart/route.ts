import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/pool";

const JWT_SECRET = process.env.JWT_SECRET as string;

async function getAuthenticatedUserId(): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded?.id) return null;

    return Number(decoded.id);
  } catch {
    return null;
  }
}

function mergeCartItems(baseCart: any[], incomingCart: any[]): any[] {
  let merged = Array.isArray(baseCart) ? [...baseCart] : [];

  for (const newItem of incomingCart || []) {
    if (!newItem?.product) continue;

    if (newItem.product?.isGift) {
      if (!merged.some((i) => i?.product?.isGift)) {
        merged.push(newItem);
      }
      continue;
    }

    const targetMode = Boolean(newItem.product?.purchaseByCarat);
    const targetProduct = String(newItem.product?.productId ?? newItem.product?.id ?? "");
    const targetShade = (newItem.product?.shade || "").trim();

    const existingIndex = merged.findIndex((item) => {
      if (item?.cartItemId && newItem?.cartItemId && item.cartItemId === newItem.cartItemId) {
        return true;
      }
      const sameProduct = String(item.product?.productId ?? item.product?.id ?? "") === targetProduct;
      const sameShade = (item.product?.shade || "").trim() === targetShade;
      const sameMode = Boolean(item.product?.purchaseByCarat) === targetMode;
      const notGift = !item.product?.isGift;
      return sameProduct && sameShade && sameMode && notGift;
    });

    if (existingIndex > -1) {
      const existing = merged[existingIndex];
      if (targetMode) {
        const curCtw = Number(existing.caratWeight || 1);
        const addCtw = Number(newItem.caratWeight || 1);
        merged[existingIndex] = {
          ...existing,
          caratWeight: `${curCtw + addCtw}`,
        };
      } else {
        const curQty = Number(existing.quantity || 1);
        const addQty = Number(newItem.quantity || 1);
        merged[existingIndex] = {
          ...existing,
          quantity: curQty + addQty,
        };
      }
    } else {
      merged.push(newItem);
    }
  }

  return merged;
}

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ cart: [], authenticated: false }, { status: 200 });
  }

  try {
    const res = await pool.query(
      `SELECT cart FROM user_carts WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    let cart = [];
    if (res.rows.length > 0 && res.rows[0].cart) {
      cart = typeof res.rows[0].cart === "string" ? JSON.parse(res.rows[0].cart) : res.rows[0].cart;
    }

    return NextResponse.json({ cart, authenticated: true }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch user cart from DB:", error);
    return NextResponse.json({ cart: [], error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    let cartToSave = Array.isArray(body?.cart) ? body.cart : [];

    // If guestCart was provided (e.g. user just signed in), merge into current user DB cart
    if (Array.isArray(body?.guestCart) && body.guestCart.length > 0) {
      const dbRes = await pool.query(
        `SELECT cart FROM user_carts WHERE user_id = $1 LIMIT 1`,
        [userId]
      );
      let existingDbCart = [];
      if (dbRes.rows.length > 0 && dbRes.rows[0].cart) {
        existingDbCart =
          typeof dbRes.rows[0].cart === "string"
            ? JSON.parse(dbRes.rows[0].cart)
            : dbRes.rows[0].cart;
      }
      cartToSave = mergeCartItems(existingDbCart, body.guestCart);
    }

    const res = await pool.query(
      `INSERT INTO user_carts (user_id, cart, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET cart = EXCLUDED.cart, updated_at = NOW()
       RETURNING cart`,
      [userId, JSON.stringify(cartToSave)]
    );

    let savedCart = res.rows[0].cart;
    if (typeof savedCart === "string") savedCart = JSON.parse(savedCart);

    return NextResponse.json({ flag: true, cart: savedCart }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to save user cart to DB:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await pool.query(
      `UPDATE user_carts SET cart = '[]'::jsonb, updated_at = NOW() WHERE user_id = $1`,
      [userId]
    );
    return NextResponse.json({ flag: true, cart: [] }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to clear user cart in DB:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
