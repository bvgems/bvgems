import { NextRequest } from "next/server";
import { sendEmail } from "@/utils/sendEmail";
import { getBusinessReferences } from "../lib/commonFunctions";
import { buildMemoApprovalEmail } from "../helperFunctions/buildMemoPurchaseRequestEmail";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { user, cartItems } = body;

    const references: any = await getBusinessReferences(user?.id);

    const token = jwt.sign({ userId: user?.id }, process.env.APPROVAL_SECRET!, {
      expiresIn: "3d",
    });

    const approvalLink = `https://bvgems.com/api/memoApproval?token=${token}`;
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
