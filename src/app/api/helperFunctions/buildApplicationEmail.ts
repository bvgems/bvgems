export function buildApplicationEmail(
  stepperUser: any,
  businessVerification: any,
  shippingAddress: any,
  businessReference: any,
  amlInfo: any,
  approvalLink: string
) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dabdvgxd4/image/upload/v1754420615/logo2_qhix5o.png" alt="BV Gems Logo" style="max-height: 60px;" />
          <h2 style="color: #0b182d; margin-top: 10px; text-transform: uppercase;">New Account Application Received</h2>
        </div>
        <p>Dear Shrey,</p>
        <p>You have received a new account application. Please review the details below:</p>
  
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              stepperUser?.email || "N/A"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Contact Number:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">${
              stepperUser?.phoneNumber || "N/A"
            }</td>
          </tr>
  
          <!-- Business Verification -->
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Business Verification:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">
              ${
                businessVerification
                  ? `
                Owner Name: ${businessVerification.ownerName || "N/A"}<br/>
                Company Address: ${
                  businessVerification.companyAddress || "N/A"
                }<br/>
                Country: ${businessVerification.country || "N/A"}<br/>
                State: ${businessVerification.state || "N/A"}<br/>
                City: ${businessVerification.city || "N/A"}<br/>
                Company Website: ${
                  businessVerification.companyWebsite || "N/A"
                }`
                  : "N/A"
              }
            </td>
          </tr>
  
          <!-- Shipping Address -->
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Shipping Address:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">
              ${
                shippingAddress
                  ? `
                Full Name: ${shippingAddress.fullName || "N/A"}<br/>
                Address Line 1: ${shippingAddress.addressLine1 || "N/A"}<br/>
                Address Line 2: ${shippingAddress.addressLine2 || "N/A"}<br/>
                City: ${shippingAddress.city || "N/A"}<br/>
                State: ${shippingAddress.state || "N/A"}<br/>
                ZIP Code: ${shippingAddress.zipCode || "N/A"}<br/>
                Country: ${shippingAddress.country || "N/A"}<br/>
                Phone Number: ${shippingAddress.phoneNumber || "N/A"}<br/>
                Email: ${shippingAddress.email || "N/A"}`
                  : "N/A"
              }
            </td>
          </tr>
  
          <!-- Business Reference -->
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>Business Reference:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">
              ${
                businessReference
                  ? `
                Company Name: ${businessReference.companyName || "N/A"}<br/>
                Contact Person: ${businessReference.contactPerson || "N/A"}<br/>
                Phone Number: ${businessReference.phoneNumber || "N/A"}<br/>
                Company Address: ${businessReference.companyAddress || "N/A"}`
                  : "N/A"
              }
            </td>
          </tr>
  
          <!-- AML Information -->
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;"><strong>AML Information:</strong></td>
            <td style="padding: 8px; border: 1px solid #eee;">
              ${
                amlInfo
                  ? `
                Bank Name: ${amlInfo.bankName || "N/A"}<br/>
                Bank Account: ${amlInfo.bankAccount || "N/A"}<br/>
                Bank Address: ${amlInfo.bankAddress || "N/A"}<br/>
                Primary Contact: ${amlInfo.primaryContact || "N/A"}<br/>
                Country: ${amlInfo.country || "N/A"}<br/>
                State: ${amlInfo.state || "N/A"}<br/>
                City: ${amlInfo.city || "N/A"}<br/>
                ZIP Code: ${amlInfo.zipCode || "N/A"}<br/>
                Phone Number: ${amlInfo.phoneNumber || "N/A"}<br/>
                AML Status: ${amlInfo.amlStatus || "N/A"}`
                  : "N/A"
              }
            </td>
          </tr>
        </table>
  
        <div style="text-align: center; margin-top: 20px;">
          <a href="${approvalLink}"
            style="display: inline-block; background-color: #0b182d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            APPROVE ACCOUNT
          </a>
        </div>
      </div>
    `;
}
