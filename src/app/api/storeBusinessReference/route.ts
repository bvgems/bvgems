import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";
import { createBusinessReference } from "../helperFunctions/createBusinessReference";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body?.userId;
    await createBusinessReference(body, userId);

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
