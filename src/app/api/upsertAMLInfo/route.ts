import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, userId } = body;

    const checkResult: any = await pool.query(
      `SELECT id FROM aml_info WHERE user_id = $1 LIMIT 1`,
      [userId]
    );
    const isExisting = checkResult.rowCount > 0;

    await pool.query(
      `INSERT INTO aml_info (
        user_id,
        bank_name,
        bank_account,
        bank_address,
        primary_contact,
        country,
        state,
        city,
        zip_code,
        phone,
        aml_status,
        aml_other,
        confirmed,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        bank_name = EXCLUDED.bank_name,
        bank_account = EXCLUDED.bank_account,
        bank_address = EXCLUDED.bank_address,
        primary_contact = EXCLUDED.primary_contact,
        country = EXCLUDED.country,
        state = EXCLUDED.state,
        city = EXCLUDED.city,
        zip_code = EXCLUDED.zip_code,
        phone = EXCLUDED.phone,
        aml_status = EXCLUDED.aml_status,
        aml_other = EXCLUDED.aml_other,
        confirmed = EXCLUDED.confirmed,
        updated_at = NOW();`,
      [
        userId,
        data.bankName,
        data.bankAccount,
        data.bankAddress,
        data.primaryContact,
        data.country,
        data.state,
        data.city,
        data.zipCode,
        data.phone,
        data.amlStatus,
        data.amlOther,
        data.confirmed,
      ]
    );

    const message = isExisting
      ? "AML info updated successfully!"
      : "AML info added successfully!";

    return new Response(JSON.stringify({ flag: true, message }), {
      status: 200,
    });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
