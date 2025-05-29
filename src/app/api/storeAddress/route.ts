import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      full_name,
      address_line1,
      address_line2,
      city,
      state,
      zip_code,
      country,
      phone_number,
      email,
    } = body;

    await pool.query(
      `INSERT INTO shipping_addresses
        (user_id, full_name, address_line1, address_line2, city, state, zip_code, country, phone_number, email)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        user_id,
        full_name,
        address_line1,
        address_line2,
        city,
        state,
        zip_code,
        country,
        phone_number,
        email,
      ]
    );

    return new Response(
      JSON.stringify({ flag: true, message: "Address added Successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      JSON.stringify({
        flag: false,
        message: "Something went wrong while storing shipping address!",
      }),
      { status: 500 }
    );
  }
}
