import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/pool";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null, message: "Not logged in" }, { status: 200 });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Fetch latest permissions from DB to prevent stale JWT issues
    const dbResult = await pool.query(
      `SELECT is_memo_requested, is_memo_purchase_approved FROM app_users WHERE id = $1`,
      [decoded.id]
    );

    let updatedUser = { ...decoded };
    if (dbResult.rows.length > 0) {
      updatedUser.isMemoRequested = dbResult.rows[0].is_memo_requested;
      updatedUser.isMemoPurchaseApproved = dbResult.rows[0].is_memo_purchase_approved;
    }

    const response = NextResponse.json({ user: updatedUser }, { status: 200 });

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");

    return response;
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ user: null, message: "Invalid token" }, { status: 200 });
  }
}
