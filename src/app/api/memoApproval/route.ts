import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/pool";
import { sendEmail } from "@/utils/sendEmail";
import { buildMemoApprovalSuccessEmail } from "../helperFunctions/buildMemoApprovalSuccessEmail";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response("Missing token", { status: 400 });
  }

  try {
    const secret = process.env.APPROVAL_SECRET!;
    const payload = jwt.verify(token, secret) as { userId: string };

    const result: any = await pool.query(
      `UPDATE app_users
       SET is_memo_purchase_approved = true 
       WHERE id = $1 
       RETURNING first_name, email`,
      [payload.userId]
    );

    const user = result?.rows?.[0];

    if (!user) {
      return new Response("User not found or memo purchase already approved", {
        status: 404,
      });
    }

    const emailHtml = buildMemoApprovalSuccessEmail(user);
    await sendEmail(
      user.email,
      "Your Memo purchase request has been Approved!",
      emailHtml
    );

    return new Response("Memo Approved Successfully", { status: 200 });
  } catch (error: any) {
    console.error("Approval error:", error);
    return new Response("Invalid or expired token", { status: 401 });
  }
}
