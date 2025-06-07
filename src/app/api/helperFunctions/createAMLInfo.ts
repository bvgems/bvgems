import { pool } from "@/lib/pool";

export async function upsertAMLInfo(userId: any, amlInfo: any) {
  const {
    bankName,
    bankAccount,
    bankAddress,
    primaryContact,
    country,
    state,
    city,
    zipCode,
    phone,
    amlStatus,
    amlOther,
    confirmed,
  } = amlInfo;

  try {
    const result = await pool.query(
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
        updated_at = NOW()
      RETURNING *;`,
      [
        userId,
        bankName,
        bankAccount,
        bankAddress,
        primaryContact,
        country,
        state,
        city,
        zipCode,
        phone,
        amlStatus,
        amlOther,
        confirmed,
      ]
    );
    return result;
  } catch (error) {
    console.error("Error in upserting AML info:", error);
    throw error;
  }
}
