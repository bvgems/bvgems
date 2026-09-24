import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/pool";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productTitle, sku, quantity, unit, name, companyName, email, phone, notes } = body;

    // 1. Insert into database
    await pool.query(
      `INSERT INTO quote_requests (product_title, sku, quantity, unit, name, company_name, email, phone, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [productTitle, sku, quantity, unit, name, companyName, email, phone, notes]
    );

    // 2. Build and send email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0b182d;">Wholesale Quote Request</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Product</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${productTitle || "Unknown"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">SKU / Lot Number</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${sku || "N/A"}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Requested Quantity</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${quantity} ${unit}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Company Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${companyName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${phone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Additional Notes</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${notes || "None"}</td>
          </tr>
        </table>
      </div>
    `;

    await sendEmail(
      "sales@bvgems.com",
      `Wholesale Quote Request: ${productTitle || "Unknown"}`,
      emailHtml
    );

    return NextResponse.json({ success: true, message: "Quote request submitted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error submitting quote request:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
