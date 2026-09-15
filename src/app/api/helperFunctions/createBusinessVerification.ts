import { pool } from "@/lib/pool";

export async function createBusinessVerification(
  businessVerification: any,
  userId: any
) {
  try {
    const {
      companyName,
      ownerName,
      companyAddress,
      country,
      state,
      city,
      zipCode,
      aptSuite,
      companyWebsite,
      einNumber,
    } = businessVerification;

    const insertQuery = `
      INSERT INTO business_verification (user_id,company_name,owner_name,company_address,country,state,city,zip_code,apt_suite,company_website,ein_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id;
    `;

    const values: any = [
      userId,
      companyName,
      ownerName,
      companyAddress,
      country,
      state,
      city,
      zipCode,
      aptSuite,
      companyWebsite,
      einNumber,
    ];
    const result = await pool.query(insertQuery, values);

    const user = result.rows[0];
    return user;
  } catch (error: any) {
    console.error("Error in insterting business verification:", error);
    return error.message;
  }
}
