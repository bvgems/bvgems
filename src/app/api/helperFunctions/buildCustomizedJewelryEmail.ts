export function buildCustomizedJewelryEmail(
  email: string,
  variables: any,
  url: string
) {
  const { selectedGemstone, selectedShape, selectedGoldColor, size } =
    variables;

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>New Customized Jewelry Request</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f5f7fb;
              font-family: 'Inter', Arial, Helvetica, sans-serif;
              color: #333;
            }
            .container {
              max-width: 640px;
              margin: 20px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .header {
              background: linear-gradient(135deg, #0b182d, #1e2f4f);
              text-align: center;
              padding: 30px 20px;
            }
            .header img {
              height: 60px;
            }
            .header h2 {
              margin: 15px 0 0;
              font-weight: 500;
              font-size: 22px;
              color: #ffffff;
            }
            .content {
              padding: 35px 30px;
            }
            .content p {
              font-size: 15px;
              line-height: 1.6;
              margin: 0 0 20px;
            }
            .detail {
              margin-bottom: 18px;
            }
            .detail strong {
              display: block;
              font-weight: 600;
              color: #0b182d;
              margin-bottom: 4px;
              font-size: 14px;
            }
            .detail span {
              font-size: 15px;
              color: #444;
            }
            .divider {
              border-top: 1px solid #e5e7eb;
              margin: 25px 0;
            }
            .cta {
              text-align: center;
              margin: 35px 0 10px;
            }
            .cta a {
              background: linear-gradient(135deg, #0b182d, #1e2f4f);
              color: #ffffff;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              font-size: 15px;
              display: inline-block;
              transition: all 0.3s ease;
            }
            .cta a:hover {
              background: linear-gradient(135deg, #1e2f4f, #0b182d);
            }
            .footer {
              background: #f9fafb;
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #777;
            }
            @media (max-width: 600px) {
              .content {
                padding: 25px 18px;
              }
              .header h2 {
                font-size: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <img src="https://res.cloudinary.com/dabdvgxd4/image/upload/v1754420615/logo2_qhix5o.png" alt="BV Gems Logo" />
              <h2>New Customized Jewelry Request</h2>
            </div>
  
            <!-- Body -->
            <div class="content">
              <p>Hello Shrey,</p>
              <p>You have received a new customized jewelry request. Here are the details:</p>
  
              <!-- Details -->
              <div class="detail">
                <strong>Gemstone</strong>
                <span>${selectedGemstone || "Not provided"}</span>
              </div>

            
              <div class="detail">
                <strong>Gold Color</strong>
                <span>${selectedGoldColor || "Not provided"}</span>
              </div>
              <div class="detail">
                <strong>Customer Email</strong>
                <span>${email}</span>
              </div>
  
              <div class="divider"></div>
  
              <!-- Reference Product -->
              <div class="detail">
                <strong>Reference Product</strong>
                <a href="${url}" target="_blank" style="color:#0b182d; text-decoration:underline;">${url}</a>
              </div>
  
              <!-- CTA -->
              <div class="cta">
                <a href="${url}" target="_blank">View Product Reference</a>
              </div>
            </div>
  
            <!-- Footer -->
            <div class="footer">
              &copy; ${new Date().getFullYear()} B.V. Gems. All rights reserved.<br/>
              New York, NY
            </div>
          </div>
        </body>
      </html>
      `;
}
