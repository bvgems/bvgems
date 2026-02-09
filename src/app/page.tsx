"use client";
import { useEffect, useState, useRef } from "react";
import { getHeroData } from "@/apis/api";
import { Hero } from "@/components/Hero/Hero";
import ShopByColor from "@/components/ShopByColor/ShopByColor";
import { JewelrySection } from "@/components/Jewerly/JewerlySection";
import { Testimonials } from "@/components/Testimonials/Testimonials";
import { CustomerBenefits } from "@/components/CustomerBenefits/CustomerBenefits";
import { IndustryAffiliation } from "@/components/IndustryAffiliation/IndustryAffiliation";
import { BirthStoneComponent } from "@/components/BirthStone/BirthStoneComponent";
import { BestSellingProductsComponents } from "@/components/BestSellingProducts/BestSellingProductsComponents";
import { BookAppointment } from "@/components/BookAppointment/BookAppointment";
import TradeShows from "@/components/TradeShows/TradeShows";
import { ShopCalibrated } from "@/components/ShopCalibrated/ShopCalibrated";
import { ShopByShape } from "@/components/ShopByShape/ShopByShape";

export default function Home() {
  const jewelrySectionRef = useRef<HTMLDivElement>(null);
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    getHeroData().then(setHeroData);
  }, []);

  return (
    <>
      {heroData && <Hero jewelryRef={{ current: null }} heroData={heroData} />}
      <ShopCalibrated />
      <ShopByShape />
      <ShopByColor />
      <JewelrySection ref={jewelrySectionRef} />
      <BestSellingProductsComponents />
      <BirthStoneComponent />
      <Testimonials />
      <BookAppointment />
      <CustomerBenefits />
      <TradeShows />
      <IndustryAffiliation />
    </>
  );
}
