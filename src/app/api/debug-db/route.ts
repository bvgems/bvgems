import { NextResponse, NextRequest } from "next/server";
import { isUserAuthenticated } from "@/lib/priceGating";

export async function GET(req: NextRequest) {
  try {
    const auth = await isUserAuthenticated(req);
    return NextResponse.json({ authenticated: auth });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
