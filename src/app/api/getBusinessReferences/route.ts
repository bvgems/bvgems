import { NextRequest } from "next/server";
import { getBusinessReferences } from "../lib/commonFunctions";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const result = await getBusinessReferences(id);

    return new Response(JSON.stringify({ businessReferences: result }), {
      status: 200,
    });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
