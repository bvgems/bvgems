import { Hero } from "@/components/Hero/Hero";
import { JewelrySection } from "@/components/Jewerly/JewerlySection";
import { LooseGemstones } from "@/components/LooseGemstones/LooseGemstones";
import { OwnEngagementRing } from "@/components/OwnEngagementRing/OwnEngagementRing";
import { OwnJewerly } from "@/components/OwnJewerly/OwnJewerly";

export default function Home() {
  return (
    <>
      <Hero />
      <JewelrySection />
      <LooseGemstones />
      <OwnJewerly />
      <OwnEngagementRing />
    </>
  );
}
