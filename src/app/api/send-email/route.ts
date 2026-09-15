import { NextRequest } from "next/server";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, text } = body;

    if (!to || !text) {
      return new Response(
        JSON.stringify({ flag: false, error: "Missing 'to' or 'text' fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h3 style="color: #0b182d;">${subject || "B.V. Gems"}</h3>
        <div style="line-height: 1.6;">
          ${text.replace(/\n/g, "<br>")}
        </div>
      </div>
    `;

    await sendEmail(to, subject || "B.V. Gems Inquiry", htmlContent);

    return new Response(
      JSON.stringify({ flag: true, message: "Email sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ flag: false, error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
