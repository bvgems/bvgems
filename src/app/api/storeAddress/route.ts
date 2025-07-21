import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";
import { createShippingAddress } from "../helperFunctions/createShippingAddress";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId;
    console.log("bodyy",body)
    await createShippingAddress(body, userId);

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
