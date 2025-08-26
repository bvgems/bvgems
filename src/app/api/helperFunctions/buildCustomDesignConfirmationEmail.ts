export function buildCustomDesignConfirmationEmail({
  user,
  payload,
}: {
  user: { fullName: string; email: string };
  payload: {
    creationType: string;
    budget: string;
    centerStone: string;
    sideStone: string;
    goldColor: string;
    additionalDetails: string;
  };
}) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dabdvgxd4/image/upload/v1754420615/logo2_qhix5o.png" alt="BV Gems Logo" style="max-height: 60px;" />
          <h2 style="color: #0b182d; margin-top: 10px; text-transform: uppercase;">Custom Design Request Received</h2>
        </div>
  
        <p>Dear ${user.fullName || "Customer"},</p>
        <p>Thank you for submitting your custom jewelry design request to <strong>BV GEMS INC.</strong>. Our design team will review your request and get back to you shortly!</p>
  
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Jewelry Type:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              payload.creationType
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Budget:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">$${
              payload.budget
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Center Stone:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              payload.centerStone
            }</td>
          </tr>
          ${
            payload.sideStone
              ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Side Stone(s):</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${payload.sideStone}</td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Gold Color:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              payload.goldColor
            }</td>
          </tr>
          ${
            payload.additionalDetails
              ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Additional Details:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${payload.additionalDetails}</td>
          </tr>
          `
              : ""
          }
        </table>
  
        <p style="margin-top: 20px;">We will reach out soon to discuss next steps. If you have questions in the meantime, call us at <strong>+1 (212) 944-4382</strong> or reply to this email.</p>
  
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
