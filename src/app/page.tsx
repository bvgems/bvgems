"use client";
import { CustomerBenefits } from "@/components/CustomerBenefits/CustomerBenefits";
import { Hero } from "@/components/Hero/Hero";
import { JewelrySection } from "@/components/Jewerly/JewerlySection";
import { OwnJewelry } from "@/components/OwnJewerly/OwnJewerly";
import ShopByColor from "@/components/ShopByColor/ShopByColor";
import { Testimonials } from "@/components/Testimonials/Testimonials";
import { useRef } from "react";

export default function Home() {
  const jewelrySectionRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Hero jewelryRef={jewelrySectionRef} />
      <ShopByColor />
      <JewelrySection ref={jewelrySectionRef} />
      <OwnJewelry />
      <Testimonials />
      <CustomerBenefits />
    </>
  );
}
