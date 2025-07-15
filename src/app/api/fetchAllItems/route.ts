import { NextRequest, NextResponse } from "next/server";
import {
  getAllJeweleryProducts,
  getAllLooseGemstones,
} from "../lib/commonFunctions";

export async function GET(req: NextRequest) {
  try {
    const allLooseGemstones: any = await getAllLooseGemstones();

    const allBracelets: any = await getAllJeweleryProducts("bracelets");
    const formattedBraceletsData = allBracelets?.edges?.map((item: any) => ({
      ...item,
      value: item?.node?.title,
    }));

    const allRings: any = await getAllJeweleryProducts("rings");
    const formattedRingsData = allRings?.edges?.map((item: any) => ({
      ...item,
      value: item?.node?.title,
    }));

    const allEarrings: any = await getAllJeweleryProducts("earrings");
    const formattedEarringsData = allEarrings?.edges?.map((item: any) => ({
      ...item,
      value: item?.node?.title,
    }));

    const allNecklaces: any = await getAllJeweleryProducts("necklaces");
    const formattedNecklacesData = allNecklaces?.edges?.map((item: any) => ({
      ...item,
      value: item?.node?.title,
    }));

    const mergedJewleryData = [
      ...formattedBraceletsData,
      ...formattedRingsData,
      ...formattedEarringsData,
      ...formattedNecklacesData,
    ];

    const mergedData = {
      allLooseGemstones,
      mergedJewleryData,
    };

    return NextResponse.json({ data: mergedData }, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
