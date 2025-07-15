import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";
import { generateGemstoneImage } from "./generateGemStoneImage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedShape, previewSize } = body;

    console.log("sele", selectedShape, previewSize);
    if (!selectedShape || !previewSize) {
      return new Response(
        JSON.stringify({ flag: false, error: "Size or Shape not available" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const imagePath = await generateGemstoneImage(
      selectedShape as string,
      Number(previewSize)
    );
    return new Response(
      JSON.stringify({ imageUrl: `/previews/${imagePath}` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
