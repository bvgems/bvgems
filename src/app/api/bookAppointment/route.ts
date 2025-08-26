import { NextRequest } from "next/server";
import { sendEmail } from "@/utils/sendEmail";
import { buildAppointmentBookedEmail } from "../helperFunctions/buildAppointmentBookEmail";
import { buildAppointmentConfirmationEmail } from "../helperFunctions/buildAppointmentConfirmationEmail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { user, payload } = body;

    const emailHtml = buildAppointmentBookedEmail({ user, payload });
    const confirmationEmailHtml = buildAppointmentConfirmationEmail({
      user,
      payload,
    });

    await sendEmail("sales@bvgems.com", "New Appointment Booked", emailHtml);
    await sendEmail(
      user?.email,
      "Your Appointment Is Confirmed",
      confirmationEmailHtml
    );
    return new Response(
      JSON.stringify({
        flag: true,
        message: `Thank you for booking your appointment on ${payload.date} at ${payload.time}. Your Appointment is Confirmed.`,
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
