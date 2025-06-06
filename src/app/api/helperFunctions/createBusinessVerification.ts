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
      companyWebsite,
    } = businessVerification;

    const insertQuery = `
      INSERT INTO business_verification (user_id,company_name,owner_name,company_address,country,state,city,company_website)
      VALUES ($1, $2, $3, $4,$5,$6,$7,$8)
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
      companyWebsite,
    ];
    const result = await pool.query(insertQuery, values);

    const user = result.rows[0];
    return user;
  } catch (error: any) {
    console.error("Error in insterting business verification:", error);
    return error.message;
  }
}
