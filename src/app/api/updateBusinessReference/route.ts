import { pool } from "@/lib/pool";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      contactPerson,
      phoneNumber,
      companyAddress,
      companyName,
      addtionalNotes,
    } = body;
    console.log(
      "hey,",
      id,
      contactPerson,
      phoneNumber,
      companyAddress,
      companyName,
      addtionalNotes
    );

    await pool.query(
      `UPDATE business_reference SET
 contact_person=$1,
      contact_number=$2,
      company_address=$3,
      company_name=$4,
      additional_notes=$5,
          updated_at = now()
        WHERE id = $6`,
      [
        contactPerson,
        phoneNumber,
        companyAddress,
        companyName,
        addtionalNotes,
        id,
      ]
    );

    return new Response(
      JSON.stringify({
        flag: true,
        message: "Reference updated successfully!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(
      JSON.stringify({
        flag: false,
        message: "Something went wrong while updating business reference!",
      }),
      { status: 500 }
    );
  }
}
