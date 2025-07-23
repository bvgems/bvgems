export function buildMemoApprovalSuccessEmail(user: any) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://yourwebsite.com/logo.png" alt="BV Gems Logo" style="max-height: 60px;" />
          <h2 style="color: #6a0dad; margin-top: 10px;">Memo Purchase Approved</h2>
        </div>
  
        <p>Dear ${user?.first_name || "Customer"},</p>
  
        <p>We are pleased to inform you that your request to <strong>Purchase on Memo</strong> has been <span style="color: green;"><strong>approved</strong></span> by our team.</p>
  
        <p>You can now proceed with selecting items for memo and placing orders directly through our platform.</p>
         <p style="color: #555;">
        <em>To ensure your account updates reflect correctly, we recommend that you sign out of your account and sign back in before proceeding with your memo purchases.</em>
      </p>
  
        <div style="margin: 20px 0; text-align: center;">
          <a href="http://localhost:3000" 
            style="display: inline-block; background-color: #6a0dad; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Start Shopping on Memo
          </a>
        </div>
  
        <p>If you have any questions or need assistance, feel free to contact our team at <a href="mailto:bvgemsinc@gmail.com">bvgemsinc@gmail.com</a>.</p>
  
        <p>Thank you for choosing BV Gems.</p>
  
        <p style="margin-top: 30px;">Warm regards,<br /><strong>BV Gems Team</strong></p>
      </div>
    `;
}
