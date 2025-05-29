import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

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
