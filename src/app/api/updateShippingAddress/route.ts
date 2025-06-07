import { pool } from "@/lib/pool";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      phoneNumber,
      email,
    } = body;

    await pool.query(
      `UPDATE shipping_addresses SET
          full_name = $1,
          address_line1 = $2,
          address_line2 = $3,
          city = $4,
          state = $5,
          zip_code = $6,
          country = $7,
          phone_number = $8,
          email = $9,
          updated_at = now()
        WHERE id = $10`,
      [
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
        phoneNumber,
        email,
        id,
      ]
    );

    return new Response(
      JSON.stringify({ flag: true, message: "Address updated successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(
      JSON.stringify({
        flag: false,
        message: "Something went wrong while updating shipping address!",
      }),
      { status: 500 }
    );
  }
}
