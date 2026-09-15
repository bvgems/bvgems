import { Metadata } from "next";
import { SearchClient } from "./SearchClient";
import { getSearchResult } from "@/apis/api";

export const metadata: Metadata = {
  title: "Search Results | B.V. Gems",
  description: "Search wholesale gemstones at B.V. Gems.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <SearchClient />
    </div>
  );
}
