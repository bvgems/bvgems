import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";
import { buildWelcomeEmail } from "../helperFunctions/buildWelcomeEmail";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId;

    if (!userId) {
      return new Response(
        JSON.stringify({
          flag: false,
          error: "Missing userId",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const response: any = await pool.query(
      `UPDATE app_users 
       SET is_approved = true 
       WHERE id = $1 
       RETURNING first_name,email`,
      [userId]
    );

    const email = response?.rows[0]?.email;

    const emailHtml = buildWelcomeEmail(response?.rows[0]?.first_name);

    await sendEmail(email, "Your Account has been Approved!", emailHtml);

    return new Response(
      JSON.stringify({
        flag: true,
        message:
          "Account application approved and user registered successfully!",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error approving application:", error);
    return new Response(
      JSON.stringify({
        flag: false,
        error: "Internal Server Error. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
