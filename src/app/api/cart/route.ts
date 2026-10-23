export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/pool";
import { verifyCartPrices } from "../lib/verifyCartPrices";
import { generateCartItemId } from "@/store/useCartStore";

const JWT_SECRET = process.env.JWT_SECRET as string;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function normalizeCartItems(items: any[]): any[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter(
      (item) =>
        item &&
        item.product &&
        !item.product?.isGift &&
        !String(item.product?.productId || "").includes("FREE-GIFT")
    )
    .map((item) => {
      const normalized = {
        ...item,
        product: {
          ...item.product,
        },
      };
      if (!normalized.cartItemId) {
        normalized.cartItemId = generateCartItemId(normalized);
      }
      return normalized;
    });
}

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
    if (newItem.product?.isGift || String(newItem.product?.productId || "").includes("FREE-GIFT")) {
      continue;
    }

    const targetCartItemId = newItem.cartItemId || generateCartItemId(newItem);
    const targetMode = Boolean(newItem.product?.purchaseByCarat);
    const targetProduct = String(newItem.product?.productId ?? newItem.product?.id ?? "");
    const targetShade = (newItem.product?.shade || "").trim();
    const pType = newItem.product?.productType || "stone";

    const existingIndex = merged.findIndex((item) => {
      const existingId = item?.cartItemId || generateCartItemId(item);
      if (existingId === targetCartItemId) return true;
      if (generateCartItemId(item) === generateCartItemId(newItem)) return true;

      if (pType !== "stone" && pType !== "freeSizeStone") {
        return false;
      }

      const sameProduct = String(item.product?.productId ?? item.product?.id ?? "") === targetProduct;
      const sameShade = (item.product?.shade || "").trim() === targetShade;
      const sameMode = Boolean(item.product?.purchaseByCarat) === targetMode;
      return sameProduct && sameShade && sameMode;
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
    return NextResponse.json(
      { cart: [], authenticated: false },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const res = await pool.query(
      `SELECT cart, updated_at FROM user_carts WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    let cart: any[] = [];
    let updatedAt: string | null = null;
    if (res.rows.length > 0) {
      if (res.rows[0].cart) {
        cart =
          typeof res.rows[0].cart === "string"
            ? JSON.parse(res.rows[0].cart)
            : res.rows[0].cart;
      }
      if (res.rows[0].updated_at) {
        updatedAt = new Date(res.rows[0].updated_at).toISOString();
      }
    }

    cart = normalizeCartItems(cart);

    return NextResponse.json(
      { cart, updatedAt, authenticated: true },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error("Failed to fetch user cart from DB:", error);
    return NextResponse.json(
      { cart: [], error: error.message },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: NO_STORE_HEADERS }
    );
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

    cartToSave = normalizeCartItems(cartToSave);

    // Verify cart items against PostgreSQL database so full unrounded prices and weights are saved
    let verifiedCart = cartToSave;
    if (Array.isArray(cartToSave) && cartToSave.length > 0) {
      try {
        verifiedCart = normalizeCartItems(await verifyCartPrices(cartToSave));
      } catch (e) {
        console.warn("verifyCartPrices non-fatal in POST /api/cart:", e);
      }
    }

    const res = await pool.query(
      `INSERT INTO user_carts (user_id, cart, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET cart = EXCLUDED.cart, updated_at = NOW()
       RETURNING cart, updated_at`,
      [userId, JSON.stringify(verifiedCart)]
    );

    let savedCart = res.rows[0].cart;
    if (typeof savedCart === "string") savedCart = JSON.parse(savedCart);
    savedCart = normalizeCartItems(savedCart);
    const updatedAt = res.rows[0].updated_at
      ? new Date(res.rows[0].updated_at).toISOString()
      : new Date().toISOString();

    return NextResponse.json(
      { flag: true, cart: savedCart, updatedAt },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error("Failed to save user cart to DB:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function DELETE() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  try {
    await pool.query(
      `UPDATE user_carts SET cart = '[]'::jsonb, updated_at = NOW() WHERE user_id = $1`,
      [userId]
    );
    return NextResponse.json(
      { flag: true, cart: [], updatedAt: new Date().toISOString() },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error("Failed to clear user cart in DB:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
