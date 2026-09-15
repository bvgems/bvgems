import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/pool";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const body = await request.json();
    const { id, firstName, lastName, email, companyName, phoneNumber } = body;

    if (decoded.id !== id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updateQuery = `
      UPDATE app_users 
      SET first_name = $1, last_name = $2, email = $3, company_name = $4, phone_number = $5
      WHERE id = $6
      RETURNING *;
    `;

    const values = [firstName, lastName, email, companyName, phoneNumber, id];
    const result = await pool.query(updateQuery, values);
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
