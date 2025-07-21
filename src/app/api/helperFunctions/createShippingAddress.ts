import { pool } from "@/lib/pool";

export async function createShippingAddress(shippingAddress: any, userId: any) {
  try {
    const {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      phoneNumber,
      email,
    } = shippingAddress;

    const result = await pool.query(
      `INSERT INTO shipping_addresses
          (user_id, full_name, address_line1, address_line2, city, state, zip_code, country, phone_number, email)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        userId,
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
        phoneNumber,
        email,
      ]
    );
    console.log('first',result)

    return result;
  } catch (error: any) {
    console.error("Error in stroing shipping address:", error);
    return error.message;
  }
}
