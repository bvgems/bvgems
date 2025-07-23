import { pool } from "@/lib/pool";

export async function createBusinessReference(
  businessReference: any,
  userId: any
) {
  try {
    const {
      companyName,
      contactPerson,
      phoneNumber,
      companyAddress,
      additionalNotes,
    } = businessReference;

    const result = await pool.query(
      `INSERT INTO business_reference
          (user_id, contact_person,contact_number, company_address,company_name,additional_notes)
         VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        userId,
        contactPerson,
        phoneNumber,
        companyAddress,
        companyName,
        additionalNotes,
      ]
    );

    return result;
  } catch (error: any) {
    console.error("Error in stroing business reference:", error);
    return error.message;
  }
}
