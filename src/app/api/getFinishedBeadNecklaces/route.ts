import { NextRequest, NextResponse } from "next/server";
import { getFinishedBeadNecklaces } from "../lib/commonFunctions";

export async function GET(request: NextRequest) {
  try {
    const filteredProducts = await getFinishedBeadNecklaces();

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
