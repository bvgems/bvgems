"use client";
import { useEffect, useState, useRef } from "react";
import { getHeroData } from "@/apis/api";
import { Hero } from "@/components/Hero/Hero";
import ShopByColor from "@/components/ShopByColor/ShopByColor";
import { JewelrySection } from "@/components/Jewerly/JewerlySection";
import { OwnJewelry } from "@/components/OwnJewerly/OwnJewerly";
import { Testimonials } from "@/components/Testimonials/Testimonials";
import { CustomerBenefits } from "@/components/CustomerBenefits/CustomerBenefits";
import { IndustryAffiliation } from "@/components/IndustryAffiliation/IndustryAffiliation";
import { BirthStoneComponent } from "@/components/BirthStone/BirthStoneComponent";
import { BestSellingProductsComponents } from "@/components/BestSellingProducts/BestSellingProductsComponents";
import { BookAppointment } from "@/components/BookAppointment/BookAppointment";
import { BlogsSection } from "@/components/BlogsSection/BlogsSection";

export default function Home() {
  const jewelrySectionRef = useRef<HTMLDivElement>(null);
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    getHeroData().then(setHeroData);
  }, []);

  return (
    <>
      {heroData && <Hero jewelryRef={{ current: null }} heroData={heroData} />}
      <JewelrySection ref={jewelrySectionRef} />
      <ShopByColor />
      {/* <OwnJewelry /> */}
      <BestSellingProductsComponents />
      <BirthStoneComponent />
      <Testimonials />
      <BookAppointment />
      <CustomerBenefits />
      <BlogsSection />
      <IndustryAffiliation />
    </>
  );
}
