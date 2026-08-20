import { getHeroData, getBestSellingProducts } from "@/apis/api";
import { Hero } from "@/components/Hero/Hero";
import ShopByColor from "@/components/ShopByColor/ShopByColor";
import { JewelrySection } from "@/components/Jewerly/JewerlySection";
import { BirthStoneComponent } from "@/components/BirthStone/BirthStoneComponent";
import { BestSellingProductsComponents } from "@/components/BestSellingProducts/BestSellingProductsComponents";
import { BookAppointment } from "@/components/BookAppointment/BookAppointment";
import { ShopCalibrated } from "@/components/ShopCalibrated/ShopCalibrated";
import { ShopByShape } from "@/components/ShopByShape/ShopByShape";
import dynamic from "next/dynamic";

const Testimonials = dynamic(() => import("@/components/Testimonials/Testimonials").then(mod => mod.Testimonials));
const CustomerBenefits = dynamic(() => import("@/components/CustomerBenefits/CustomerBenefits").then(mod => mod.CustomerBenefits));
const TradeShows = dynamic(() => import("@/components/TradeShows/TradeShows"));
const IndustryAffiliation = dynamic(() => import("@/components/IndustryAffiliation/IndustryAffiliation").then(mod => mod.IndustryAffiliation));

export default async function Home() {
  const [heroData, bestSellingProductsRes] = await Promise.all([
    getHeroData(),
    getBestSellingProducts()
  ]);
  const bestSellingProducts = bestSellingProductsRes?.data || [];

  return (
    <>
      {heroData && <Hero jewelryRef={{ current: null }} heroData={heroData} />}
      <ShopCalibrated />
      <ShopByShape />
      <ShopByColor />
      <JewelrySection />
      <BestSellingProductsComponents initialProducts={bestSellingProducts} />
      <BirthStoneComponent />
      <Testimonials />
      <BookAppointment />
      <CustomerBenefits />
      <TradeShows />
      <IndustryAffiliation />
    </>
  );
}
