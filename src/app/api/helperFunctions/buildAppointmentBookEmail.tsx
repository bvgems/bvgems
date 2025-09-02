// ✅ Helper function for safe local date formatting
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

export function buildAppointmentBookedEmail({ user, payload }: any) {
  const formattedDate = formatDate(payload.date);

  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dabdvgxd4/image/upload/v1754420615/logo2_qhix5o.png" alt="BV Gems Logo" style="max-height: 60px;" />
          <h2 style="color: #0b182d; margin-top: 10px; text-transform: uppercase;">New Appointment Booked</h2>
        </div>
  
        <p>Dear Shrey,</p>
        <p>A customer has scheduled a new appointment. Here are the details:</p>
  
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Name:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              user.firstName + " " + user.lastName || "N/A"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              user.email || "N/A"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Phone:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              user.phoneNumber || "N/A"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Appointment Date:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Appointment Time:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              payload.time || "N/A"
            }</td>
          </tr>
           <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Reason For Appointment:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              payload.reason || "N/A"
            }</td>
          </tr>
        </table>
    `;
}
