import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/pool";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; id: string };
    const allowedEmails = ["meet.vikartr@gmail.com", "shrey@gmail.com"];

    if (!allowedEmails.includes(decoded.email)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { id, is_memo_purchase_approved } = body;

    if (!id) {
      return NextResponse.json({ message: "Missing account ID" }, { status: 400 });
    }

    const query = `
      UPDATE app_users 
      SET is_memo_purchase_approved = $1
      WHERE id = $2
      RETURNING id, is_memo_purchase_approved;
    `;
    const result = await pool.query(query, [is_memo_purchase_approved, id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ account: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error toggling memo access:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
