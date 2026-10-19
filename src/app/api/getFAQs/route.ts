import { NextResponse } from "next/server";
import { FAQ_DATA } from "@/data/faqData";

export async function GET() {
  return NextResponse.json({ faqs: FAQ_DATA }, { status: 200 });
}
