import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "@/lib/pool";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    const { token, values } = await request.json();

    if (!token || !values.password || !values.confirmPassword) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (values.password !== values.confirmPassword) {
      return new Response(
        JSON.stringify({ success: false, error: "Passwords do not match" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or expired token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hashedPassword = await bcrypt.hash(values.password, 10);

    const updateQuery = `
      UPDATE app_users
      SET password_hash = $1
      WHERE id = $2
      RETURNING id, email;
    `;
    const result = await pool.query(updateQuery, [hashedPassword, decoded.id]);

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Password updated successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in reset-password:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
