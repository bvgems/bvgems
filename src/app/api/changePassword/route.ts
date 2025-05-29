import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { pool } from "@/lib/pool";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { id, oldPassword, newPassword } = body;
    const userQuery = `SELECT * FROM app_users WHERE id = $1 LIMIT 1;`;
    const result = await pool.query(userQuery, [id]);

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ flag: false, error: "Email not found" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = result.rows[0];
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password_hash
    );

    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ flag: false, error: "Incorrect Old Password!" }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const updateQuery = `
    UPDATE app_users SET password_hash=$1 WHERE id = $2`;

    const values = [hashedPassword, id];
    await pool.query(updateQuery, values);

    return new Response(
      JSON.stringify({
        flag: true,
        message: "User's Password Changed Successfully!",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error in changing the password:", error);
    return new Response(
      JSON.stringify({ flag: false, error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
