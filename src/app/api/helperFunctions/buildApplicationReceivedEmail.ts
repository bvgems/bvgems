export function buildApplicationReceivedEmail({
  applicantName,
  companyName,
}: {
  applicantName: string;
  companyName?: string;
}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "oko8ywzn";
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 24px; border-radius: 10px; color: #222;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/${cloudName}/image/upload/v1754420615/logo2_qhix5o.png" alt="BV Gems Logo" style="max-height: 55px;" />
        <h2 style="color: #0b182d; margin-top: 14px; text-transform: uppercase; font-size: 20px; letter-spacing: 0.5px;">Account Application Received</h2>
      </div>

      <p style="font-size: 15px; line-height: 1.5;">Dear ${applicantName || "Valued Customer"},</p>
      
      <p style="font-size: 15px; line-height: 1.5;">
        Thank you for applying for a wholesale trade account with <strong>B.V. Gems, Inc.</strong>${
          companyName ? ` on behalf of <strong>${companyName}</strong>` : ""
        }.
      </p>
      
      <p style="font-size: 15px; line-height: 1.5;">
        We have received your application and our compliance team is currently processing your information and business verification details.
      </p>
      
      <div style="background-color: #f8fafc; border-left: 4px solid #0b182d; padding: 14px 18px; margin: 22px 0; border-radius: 4px;">
        <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.5;">
          <strong>What to expect next:</strong><br/>
          Application reviews typically take <strong>1–2 business days</strong>. Once your account is approved, you will receive an official activation email allowing you to log in and access wholesale pricing, live inventory, and customized orders.
        </p>
      </div>

      <p style="font-size: 14px; line-height: 1.5; color: #444;">
        If you have questions or need expedited assistance in the meantime, please feel free to contact us at <a href="mailto:sales@bvgems.com" style="color: #0b182d; font-weight: bold;">sales@bvgems.com</a> or call us at <strong>+1 (212) 944-4382</strong>.
      </p>

      <p style="margin-top: 28px; font-size: 15px; line-height: 1.5;">
        Best regards,<br/>
        <strong>The B.V. Gems Team</strong>
      </p>
      
      <div style="margin-top: 24px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 14px;">
        B.V. Gems · 66 W 47th St, Booth #9 and #10, New York, NY 10036
      </div>
    </div>
  `;
}
