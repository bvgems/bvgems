import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      contact_person,
      contact_number,
      company_address,
      company_name,
      additional_notes,
    } = body;

    await pool.query(
      `INSERT INTO business_reference
        (user_id, contact_person,contact_number, company_address,company_name,additional_notes)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        user_id,
        contact_person,
        contact_number,
        company_address,
        company_name,
        additional_notes,
      ]
    );

    return new Response(
      JSON.stringify({
        flag: true,
        message: "Business Reference added Successfully!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      JSON.stringify({
        flag: false,
        message: "Something went wrong while storing business reference!",
      }),
      { status: 500 }
    );
  }
}
