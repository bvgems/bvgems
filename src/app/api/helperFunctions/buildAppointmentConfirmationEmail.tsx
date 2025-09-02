function formatDate(dateStr: string): string {
  if (!dateStr) return "N/A";

  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return "N/A";

  // Construct a local date (month is 0-based in JS Date)
  const dateObj = new Date(year, month - 1, day);

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
export function buildAppointmentConfirmationEmail({
  user,
  payload,
}: {
  user: { firstName?: string; lastName?: string; email: string };
  payload: { date: string; time: string; reason?: string };
}) {
  const formattedDate = formatDate(payload.date);

  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dabdvgxd4/image/upload/v1754420615/logo2_qhix5o.png" alt="BV Gems Logo" style="max-height: 60px;" />
          <h2 style="color: #0b182d; margin-top: 10px; text-transform: uppercase;">Appointment Confirmation</h2>
        </div>
  
        <p>Dear ${user.firstName || "Customer"},</p>
        <p>Thank you for scheduling an appointment with <strong>BV GEMS INC.</strong>. We look forward to meeting you!</p>
  
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Date:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Time:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              payload.time || "N/A"
            }</td>
          </tr>
          ${
            payload.reason
              ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Reason:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${payload.reason}</td>
          </tr>
          `
              : ""
          }
        </table>
  
        <p style="margin-top: 20px;">Our team will reach out if we need any further details. 
        If you have questions, feel free to call us at <strong>+1 (212) 944-4382</strong> or reply to this email.</p>
  
        <div style="text-align: center; margin-top: 30px;">
          <a href="mailto:sales@bvgems.com"
            style="display: inline-block; background-color: #0b182d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            CONTACT BV GEMS
          </a>
        </div>
  
        <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #888;">
          BV Gems · 66 W 47th St, Booth #9 and #10, New York, NY 10036
        </p>
      </div>
    `;
}
