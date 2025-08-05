export function buildMemoApprovalEmail(
  user: any,
  businessReferences: any,
  approvalLink: string,
  cartItems: any
) {
  const referenceRows = businessReferences
    .map(
      (ref: any, index: number) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #eee;">${index + 1}</td>
          <td style="padding: 8px; border: 1px solid #eee;">${
            ref.company_name || "N/A"
          }</td>
          <td style="padding: 8px; border: 1px solid #eee;">${
            ref.contact_person || "N/A"
          }</td>
          <td style="padding: 8px; border: 1px solid #eee;">${
            ref.contact_number || "N/A"
          }</td>
          <td style="padding: 8px; border: 1px solid #eee;">${
            ref.company_address || "N/A"
          }</td>
          <td style="padding: 8px; border: 1px solid #eee;">${
            ref.additional_notes || "N/A"
          }</td>
        </tr>`
    )
    .join("");

  const cartRows = cartItems
    .map(
      (item: any, index: number) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #eee; text-align: center;">${
            index + 1
          }</td>
          <td style="padding: 8px; border: 1px solid #eee; text-align: center;">
            <img src="${
              item.product.image_url
            }" alt="Product Image" style="max-width: 60px; border-radius: 4px;" />
          </td>
          <td style="padding: 8px; border: 1px solid #eee;">${
            item.product.collection_slug || "N/A"
          }</td>
          <td style="padding: 8px; border: 1px solid #eee;">${
            item.product.productType || "N/A"
          }</td>
          <td style="padding: 8px; border: 1px solid #eee; text-align: center;">${
            item.quantity
          }</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/dabdvgxd4/image/upload/v1754420615/logo2_qhix5o.png" alt="BV Gems Logo" style="max-height: 60px;" />
        <h2 style="color: #6a0dad; margin-top: 10px;">Memo Approval Request</h2>
      </div>

      <p>Dear Shrey,</p>
      <p>A registered customer has requested access to <strong>Purchase on Memo</strong>. Below are the applicant’s details:</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #eee;"><strong>Full Name:</strong></td>
          <td style="padding: 8px; border: 1px solid #eee;">${
            user?.firstName + " " + user?.lastName || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #eee;"><strong>Email:</strong></td>
          <td style="padding: 8px; border: 1px solid #eee;">${
            user?.email || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #eee;"><strong>Contact Number:</strong></td>
          <td style="padding: 8px; border: 1px solid #eee;">${
            user?.phoneNumber || "N/A"
          }</td>
        </tr>
      </table>

      <h3 style="margin-top: 30px; margin-bottom: 10px; color: #6a0dad;">Business References</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #f6f6f6;">
            <th style="padding: 8px; border: 1px solid #ddd;">#</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Company Name</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Contact Person</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Phone</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Address</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Additional Notes</th>
          </tr>
        </thead>
        <tbody>
          ${
            referenceRows ||
            `<tr><td colspan="6" style="padding: 8px; text-align: center;">No references provided</td></tr>`
          }
        </tbody>
      </table>

      <h3 style="margin-top: 30px; margin-bottom: 10px; color: #6a0dad;">User Wants To Purchase</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f6f6f6;">
            <th style="padding: 8px; border: 1px solid #ddd;">#</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Image</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Collection</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Product Type</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${
            cartRows ||
            `<tr><td colspan="5" style="padding: 8px; text-align: center;">No cart items provided</td></tr>`
          }
        </tbody>
      </table>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${approvalLink}" 
          style="display: inline-block; background-color: #6a0dad; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Approve Memo Purchase
        </a>
      </div>
    </div>
  `;
}
