import { GemstonesEducationBanner } from "@/components/Education/GemstonesEducationBanner";
import { GridView } from "@/components/GridView/GridView";
import { Hero } from "@/components/Hero/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <GridView />
      <GemstonesEducationBanner />
    </>
  );
}
