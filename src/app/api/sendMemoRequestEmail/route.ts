import { NextRequest } from "next/server";
import { sendEmail } from "@/utils/sendEmail";
import { getBusinessReferences } from "../lib/commonFunctions";
import { buildMemoApprovalEmail } from "../helperFunctions/buildMemoPurchaseRequestEmail";
import { pool } from "@/lib/pool";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { user, cartItems } = body;

    // Check if they already requested memo
    const checkResult = await pool.query(
      `SELECT is_memo_requested, is_memo_purchase_approved FROM app_users WHERE id = $1`,
      [user?.id]
    );

    if (checkResult.rows.length > 0) {
      if (checkResult.rows[0].is_memo_purchase_approved) {
        return new Response(
          JSON.stringify({
            flag: false,
            error: "Your account is already approved for memo purchases.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      if (checkResult.rows[0].is_memo_requested) {
        return new Response(
          JSON.stringify({
            flag: false,
            error: "You have already submitted a memo request. Please wait for approval.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const references: any = await getBusinessReferences(user?.id);

    const token = jwt.sign({ userId: user?.id }, process.env.APPROVAL_SECRET!, {
      expiresIn: "3d",
    });

    const approvalLink = `https://www.bvgems.com/api/memoApproval?token=${token}`;
    const emailHtml = buildMemoApprovalEmail(
      user,
      references,
      approvalLink,
      cartItems
    );

    await sendEmail(
      "sales@bvgems.com",
      "New Memo Purchase Request Received",
      emailHtml
    );

    // Update DB to mark that they have requested memo
    await pool.query(
      `UPDATE app_users SET is_memo_requested = true WHERE id = $1`,
      [user?.id]
    );

    return new Response(
      JSON.stringify({
        flag: true,
        message:
          "We have received your request for Memo purachase, we will let you know our decision soon!",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error submitting application:", error);
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
