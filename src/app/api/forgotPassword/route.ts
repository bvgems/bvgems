import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/pool";
import { buildPasswordResetEmail } from "../helperFunctions/buildPasswordResetEmail";
import { sendEmail } from "@/utils/sendEmail";

const JWT_SECRET = process.env.JWT_SECRET as string;
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userQuery = `SELECT id, email FROM app_users WHERE email = $1 LIMIT 1;`;
    const result = await pool.query(userQuery, [email.toLowerCase()]);

    if (result.rows.length === 0) {
      // Avoid leaking user existence
      return new Response(
        JSON.stringify({
          success: true,
          message: "If this email exists, a reset link has been sent.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetUrl = `${APP_URL}/reset-password?token=${token}`;

    const emailHtml = buildPasswordResetEmail({ user, resetUrl });

    await sendEmail(email, "Reset Your Password", emailHtml);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Password Reset link is sent to your email.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
