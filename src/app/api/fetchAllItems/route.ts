import { NextRequest, NextResponse } from "next/server";
import {
  getAllJeweleryProducts,
  getAllLooseGemstones,
  getBeads,
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

    const allBeads: any = await getBeads();
    const formattedBeadsData = allBeads?.map((item: any) => ({
      ...item,
      value: item?.node?.title + item?.node?.id,
    }));

    const mergedJewleryData = [
      ...formattedBraceletsData,
      ...formattedRingsData,
      ...formattedEarringsData,
      ...formattedNecklacesData,
      ...formattedBeadsData,
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
