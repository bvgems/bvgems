import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/pool";
import { RecentlyViewedItem } from "@/types/recentlyViewed";

const JWT_SECRET = process.env.JWT_SECRET as string;
const MAX_RECENT_ITEMS = 30;

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

/**
 * Deduplicate and merge recently viewed items, keeping most recent at the front.
 */
function mergeRecentlyViewed(
  existing: RecentlyViewedItem[],
  incoming: RecentlyViewedItem[]
): RecentlyViewedItem[] {
  const map = new Map<string, RecentlyViewedItem>();

  // Process incoming items first (newest timestamps take precedence)
  for (const item of incoming) {
    if (!item?.id) continue;
    map.set(item.id, item);
  }

  // Then process existing items that aren't already updated
  for (const item of existing) {
    if (!item?.id) continue;
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }

  // Convert to array and sort by viewedAt descending (most recent first)
  const sorted = Array.from(map.values()).sort((a, b) => {
    const timeA = new Date(a.viewedAt || 0).getTime();
    const timeB = new Date(b.viewedAt || 0).getTime();
    return timeB - timeA;
  });

  return sorted.slice(0, MAX_RECENT_ITEMS);
}

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ items: [], authenticated: false }, { status: 200 });
  }

  try {
    const res = await pool.query(
      `SELECT items FROM user_recently_viewed WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    let items: RecentlyViewedItem[] = [];
    if (res.rows.length > 0 && res.rows[0].items) {
      items =
        typeof res.rows[0].items === "string"
          ? JSON.parse(res.rows[0].items)
          : res.rows[0].items;
    }

    return NextResponse.json({ items, authenticated: true }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch user recently viewed from DB:", error);
    return NextResponse.json({ items: [], error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();
  const body = await req.json().catch(() => ({}));
  const rawItem = body.item as RecentlyViewedItem | undefined;
  const rawItems = (body.items as RecentlyViewedItem[] | undefined) || (rawItem ? [rawItem] : []);

  if (!rawItems || rawItems.length === 0) {
    return NextResponse.json({ success: false, message: "No items provided" }, { status: 400 });
  }

  // If user is guest/unauthenticated, acknowledge gracefully without DB write
  if (!userId) {
    return NextResponse.json({ success: true, authenticated: false, items: rawItems }, { status: 200 });
  }

  try {
    // 1. Fetch current stored items for this user
    const res = await pool.query(
      `SELECT items FROM user_recently_viewed WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    let existingItems: RecentlyViewedItem[] = [];
    if (res.rows.length > 0 && res.rows[0].items) {
      existingItems =
        typeof res.rows[0].items === "string"
          ? JSON.parse(res.rows[0].items)
          : res.rows[0].items;
    }

    // 2. Merge incoming with existing items
    const merged = mergeRecentlyViewed(existingItems, rawItems);

    // 3. Upsert into database
    await pool.query(
      `INSERT INTO user_recently_viewed (user_id, items, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET items = $2::jsonb, updated_at = NOW()`,
      [userId, JSON.stringify(merged)]
    );

    return NextResponse.json({ success: true, items: merged, authenticated: true }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to save recently viewed to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ success: true, authenticated: false }, { status: 200 });
  }

  try {
    await pool.query(
      `UPDATE user_recently_viewed SET items = '[]'::jsonb, updated_at = NOW() WHERE user_id = $1`,
      [userId]
    );
    return NextResponse.json({ success: true, items: [], authenticated: true }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to clear recently viewed in DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
