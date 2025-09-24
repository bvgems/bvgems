import { NextRequest } from "next/server";
import { sendEmail } from "@/utils/sendEmail";
import { buildContactUsEmail } from "../helperFunctions/buildContactusEmail";
import { buildCustomizedJewelryEmail } from "../helperFunctions/buildCustomizedJewelryEmail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, variables, currentUrl } = body;

    const emailHtml = buildCustomizedJewelryEmail(email, variables, currentUrl);

    await sendEmail(
      "sales@bvgems.com",
      "New Customized Jewelry Request",
      emailHtml
    );

    return new Response(
      JSON.stringify({
        flag: true,
        message:
          "Thank you for reaching out. We’ve received your request, we will review your design specification and get back to you shortly.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error submitting request:", error);
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
