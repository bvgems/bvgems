import { GetAllBeads } from "@/app/Graphql/queries";
import { NextRequest, NextResponse } from "next/server";
import { getBeads } from "../lib/commonFunctions";

export async function GET(request: NextRequest) {
  try {
    const filteredProducts = await getBeads();
    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
