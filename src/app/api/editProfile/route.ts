import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, firstName, lastName, email, companyName, phoneNumber } = body;

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
