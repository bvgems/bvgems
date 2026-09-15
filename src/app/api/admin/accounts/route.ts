import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/pool";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; id: string };

    const allowedEmails = ["sales@bvgems.com", "meet.vikartr@gmail.com", "shrey@gmail.com"];

    // Strictly restrict access to allowedEmails
    if (!allowedEmails.includes(decoded.email)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const query = `
      SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        company_name, 
        phone_number, 
        is_approved, 
        is_memo_purchase_approved, 
        created_at 
      FROM app_users 
      WHERE is_approved = true OR is_memo_purchase_approved = true
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query);

    return NextResponse.json(
      { accounts: result.rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin accounts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
