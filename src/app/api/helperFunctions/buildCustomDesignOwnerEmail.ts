export function buildCustomDesignOwnerEmail({
  user,
  payload,
  hasFile,
}: {
  user: { fullName: string; email: string; phoneNumber: string };
  payload: {
    creationType: string;
    budget: string;
    centerStone: string;
    sideStone: string;
    goldColor: string;
    additionalDetails: string;
  };
  hasFile: boolean;
}) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dabdvgxd4/image/upload/v1754420615/logo2_qhix5o.png" alt="BV Gems Logo" style="max-height: 60px;" />
          <h2 style="color: #0b182d; margin-top: 10px; text-transform: uppercase;">New Custom Design Request</h2>
        </div>
  
        <p>Dear Shrey,</p>
        <p>A customer has submitted a new custom jewelry request. Here are the details:</p>
  
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Name:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              user.fullName || "N/A"
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
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Jewelry Type:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              payload.creationType || "N/A"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Budget:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">$${
              payload.budget || "N/A"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Center Stone:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              payload.centerStone || "N/A"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Side Stone(s):</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              payload.sideStone || "N/A"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Gold Color:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              payload.goldColor || "N/A"
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
  
        ${
          hasFile
            ? `<p style="margin-top: 15px;"><strong>Inspiration File Uploaded:</strong><br/>
               <img src="cid:inspirationImage" alt="Inspiration Image" style="max-width:100%; height:auto; border-radius:6px; margin-top:10px;" />`
            : "<p style='margin-top: 15px;'><em>No inspiration file uploaded.</em></p>"
        }
      </div>
    `;
}
