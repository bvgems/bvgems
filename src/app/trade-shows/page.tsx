import TradeShows from "@/components/TradeShows/TradeShows";
import React from "react";
import { PageHeader } from "@/components/CommonComponents/PageHeader";

export default function TradeShowsPage() {
  return (
    <div className="w-full">
      <PageHeader 
        title="Upcoming Trade Shows" 
        subtitle="Meet us at industry-leading gem and jewelry exhibitions worldwide." 
      />
      <TradeShows />
    </div>
  );
}
