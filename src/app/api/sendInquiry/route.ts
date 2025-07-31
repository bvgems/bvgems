import { NextRequest } from "next/server";
import { sendEmail } from "@/utils/sendEmail";
import { buildContactUsEmail } from "../helperFunctions/buildContactusEmail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { values } = body;

    const emailHtml = buildContactUsEmail(values);

    await sendEmail(
      "fenilkadhiwala42@gmail.com",
      "New Inquiry Received",
      emailHtml
    );

    return new Response(
      JSON.stringify({
        flag: true,
        message:
          "Thank you for reaching out. We’ve received your inquiry and will get back to you shortly.",
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
