import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/pool";
import { buildWelcomeEmail } from "../helperFunctions/buildWelcomeEmail";
import { sendEmail } from "@/utils/sendEmail";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email: any = url.searchParams.get("email");

    if (!email) {
      return new Response("Missing Email", { status: 400 });
    }

    const result: any = await pool.query(
      "SELECT 1 FROM app_users WHERE email = $1 LIMIT 1",
      [email.toLowerCase()]
    );

    return NextResponse.json({ exists: result.rowCount > 0 });
  } catch (error: any) {
    console.error("Error checking for email exists:", error);
    return new Response("Something went wrong while checking for email", {
      status: 400,
    });
  }
}
