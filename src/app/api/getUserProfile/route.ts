import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/pool";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (decoded.id !== id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const selectQuery = `
     SELECT * FROM app_users WHERE id = $1
    `;

    const values = [id];
    const result = await pool.query(selectQuery, values);
    const user = result.rows[0];

    const payload = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      companyName: user.company_name,
      phoneNumber: user.phone_number,
      isMemoPurchaseApproved: user.is_memo_purchase_approved,
      isMemoRequested: user.is_memo_requested,
    };

    return new Response(
      JSON.stringify({
        flag: true,
        user: payload,
        message: "User's Details Updated Successfully!",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in updating user's details:", error);
    return new Response(
      JSON.stringify({ flag: false, error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
