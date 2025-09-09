export function buildPasswordResetEmail({
  user,
  resetUrl,
}: {
  user: { firstName?: string; email: string };
  resetUrl: string;
}) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dabdvgxd4/image/upload/v1754420615/logo2_qhix5o.png" alt="BV Gems Logo" style="max-height: 60px;" />
          <h2 style="color: #0b182d; margin-top: 10px; text-transform: uppercase;">Password Reset Request</h2>
        </div>
  
        <p>Dear ${user.firstName || "Customer"},</p>
        <p>We received a request to reset your <strong>BV GEMS INC.</strong> account password. If this was you, please click the button below to reset your password.</p>
  
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
            style="display: inline-block; background-color: #0b182d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            RESET PASSWORD
          </a>
        </div>
  
        <p>If you did not request a password reset, you can safely ignore this email. This link will expire in <strong>15 minutes</strong> for security reasons.</p>
  
        <p style="margin-top: 20px;">If you have any questions, feel free to call us at <strong>+1 (212) 944-4382</strong> or reply directly to this email.</p>
  
        <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #888;">
          BV Gems · 66 W 47th St, Booth #9 and #10, New York, NY 10036
        </p>
      </div>
    `;
}
