export function buildWelcomeEmail(customerName: string) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dabdvgxd4/image/upload/v1754420615/logo2_qhix5o.png" alt="BV Gems Logo" style="max-height: 60px;" />
          <h2 style="color: #0b182d; margin-top: 10px; text-transform: uppercase;">Welcome to B.V. Gems!</h2>
        </div>
        <p>Dear ${customerName || "Valued Customer"},</p>
        <p>We are thrilled to inform you that your account has been approved and is now active. You can now enjoy exclusive access to our products, services, and special offers.</p>
        <p>Thank you for choosing B.V. Gems. We look forward to building a strong and lasting relationship with you.</p>
        <p>If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:sales@bvgems.com">sales@bvgems.com</a>. Our team is always here to help!</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://bvgems.com"
            style="display: inline-block; background-color: #0b182d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            LOGIN TO YOUR ACCOUNT
          </a>
        </div>
        <p style="margin-top: 30px;">Best regards,<br/>The B.V. Gems Team</p>
      </div>
    `;
}
