export function buildContactUsEmail(formData: {
  name: string;
  email: string;
  subject: string;
  inquiryType: string;
  message?: string;
}) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://yourwebsite.com/logo.png" alt="BV Gems Logo" style="max-height: 60px;" />
          <h2 style="color: #6a0dad; margin-top: 10px;">New Inquiry Submitted</h2>
        </div>
  
        <p>Dear Shrey,</p>
        <p>You’ve received a new customer inquiry via the contact form. Here are the details:</p>
  
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Name:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              formData.name || "N/A"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              formData.email || "N/A"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Subject:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              formData.subject || "N/A"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Inquiry Type:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              formData.inquiryType || "N/A"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Message:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              formData.message?.replace(/\n/g, "<br/>") || "N/A"
            }</td>
          </tr>
        </table>
  
        <p style="margin-top: 20px;">You can reply directly to <a href="mailto:${
          formData.email
        }">${formData.email}</a> to assist the customer.</p>
  
        <div style="text-align: center; margin-top: 30px;">
          <a href="mailto:${formData.email}"
            style="display: inline-block; background-color: #6a0dad; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reply to Customer
          </a>
        </div>
      </div>
    `;
}
