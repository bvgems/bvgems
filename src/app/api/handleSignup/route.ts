import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { pool } from "@/lib/pool";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, password } = body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = `
      INSERT INTO app_users (first_name, last_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, created_at;
    `;

    const values = [firstName, lastName, email, hashedPassword];
    const result = await pool.query(insertQuery, values);

    const user = result.rows[0];

    return new Response(
      JSON.stringify({ flag: true, message: "User Sign up Successfully!" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    if (error.code === "23505") {
      return new Response(
        JSON.stringify({
          flag: false,
          error: "Email already exists. Please use a different email.",
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.error("Error in signing up user:", error);
    return new Response(
      JSON.stringify({ flag: false, error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
