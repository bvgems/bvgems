import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/pool";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    console.log("emailllll", email, password);

    const userQuery = `SELECT * FROM app_users WHERE email = $1 LIMIT 1;`;
    const result = await pool.query(userQuery, [email]);

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ flag: false, error: "Email not found" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = result.rows[0];

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    console.log("ispasss", isPasswordCorrect, user.is_approved);

    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ flag: false, error: "Invalid credentials!" }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!user?.is_approved) {
      return new Response(
        JSON.stringify({
          flag: false,
          error:
            "Your account is not yet approved. We'll notify you once approved.",
        }),
        { status: 202, headers: { "Content-Type": "application/json" } }
      );
    }

    const payload = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      companyName: user.company_name,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = new Response(
      JSON.stringify({ flag: true, user: payload }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Lax${
            process.env.NODE_ENV === "production" ? "; Secure" : ""
          }; Max-Age=${60 * 60 * 24 * 7}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error in signing in user:", error);
    return new Response(
      JSON.stringify({ flag: false, error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
