import { getHeroData, getBestSellingProducts } from "@/apis/api";
import { Hero } from "@/components/Hero/Hero";
import ShopByColor from "@/components/ShopByColor/ShopByColor";
// import { JewelrySection } from "@/components/Jewerly/JewerlySection";
import { BirthStoneComponent } from "@/components/BirthStone/BirthStoneComponent";
import { BestSellingProductsComponents } from "@/components/BestSellingProducts/BestSellingProductsComponents";
import { BookAppointment } from "@/components/BookAppointment/BookAppointment";
import { ShopCalibrated } from "@/components/ShopCalibrated/ShopCalibrated";
import { ShopByShape } from "@/components/ShopByShape/ShopByShape";
import { FadeInUpBox } from "@/components/CommonComponents/FadeInUpBox";
import dynamic from "next/dynamic";
import Link from "next/link";

const Testimonials = dynamic(() => import("@/components/Testimonials/Testimonials").then(mod => mod.Testimonials));
const CustomerBenefits = dynamic(() => import("@/components/CustomerBenefits/CustomerBenefits").then(mod => mod.CustomerBenefits));
const TradeShows = dynamic(() => import("@/components/TradeShows/TradeShows"));
const IndustryAffiliation = dynamic(() => import("@/components/IndustryAffiliation/IndustryAffiliation").then(mod => mod.IndustryAffiliation));

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const [heroDataRaw, bestSellingProductsRes] = await Promise.all([
    getHeroData(),
    getBestSellingProducts()
  ]);

  const heroData = {
    heroData: {
      page: {
        metafields: [
          {
            references: {
              edges: heroDataRaw?.heroData?.page?.metafields?.[0]?.references?.edges?.map((edge: any) => ({
                node: {
                  image: {
                    url: edge?.node?.image?.url
                  }
                }
              })) || []
            }
          }
        ]
      }
    }
  };

  const bestSellingProductsRaw = bestSellingProductsRes?.data || [];
  const bestSellingProducts = bestSellingProductsRaw.map((item: any) => ({
    node: {
      productType: item?.node?.productType,
      handle: item?.node?.handle,
      title: item?.node?.title,
      variants: {
        edges: item?.node?.variants?.edges?.length > 0 ? [
          { node: { title: item.node.variants.edges[0].node.title } }
        ] : []
      },
      images: {
        edges: item?.node?.images?.edges?.length > 0 ? [
          { node: { url: item.node.images.edges[0].node.url } }
        ] : []
      }
    }
  }));

  return (
    <>
      {heroData && <Hero jewelryRef={{ current: null }} heroData={heroData} />}
      <ShopCalibrated />
      <ShopByShape />
      <ShopByColor />
      {/* <JewelrySection /> */}
      {/* <BestSellingProductsComponents initialProducts={bestSellingProducts} /> */}
      {/* <BirthStoneComponent /> */}
      <Testimonials />
      <CustomerBenefits />
      <FadeInUpBox>
        <IndustryAffiliation />
      </FadeInUpBox>

      {/* --- PASTED FROM /trade PAGE --- */}
      <div className="w-full flex flex-col mt-10">
        {/* 1. Hero / Headline */}
        <FadeInUpBox>
          <section className="bg-[#0b182d] text-white py-20 px-6 text-center">
            <h1 className="text-4xl md:text-5xl uppercase tracking-widest font-light mb-6">
              Premier Wholesale Dealer in Calibrated and Free-size Natural Gemstones
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl font-light text-gray-300 leading-relaxed mb-10">
              From our specialty of Diamond-cut rounds to an extensive selection of fancy shapes, we're a go-to source for Natural Sapphire, Ruby, Emerald, and a wide range of semi-precious gems. B.V. Gems offers a diverse spectrum of prices & qualities, all offered in consistent sizes and standout brilliance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/trade/apply" className="px-8 py-4 bg-white text-black uppercase tracking-widest text-sm font-semibold hover:bg-gray-200 transition-colors">
                Apply for Trade Account
              </Link>
            </div>
          </section>
        </FadeInUpBox>

        {/* 3. Trade Categories Teaser */}
        <FadeInUpBox delay={0.2}>
          <section className="bg-gray-50 py-16 px-6">
            <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
              <Link href="/loose-gemstones" className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] group block relative h-80 overflow-hidden bg-white shadow-sm border border-gray-100 p-8 flex flex-col justify-center items-center text-center transition-shadow hover:shadow-md">
                <h3 className="text-2xl font-light uppercase tracking-widest mb-4">Calibrated Gemstones</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">Precision-cut stones in standard millimeter sizes for perfect setting.</p>
                <span className="inline-block border-b border-black pb-1 uppercase tracking-wider text-xs font-semibold group-hover:text-blue-900 transition-colors">Shop Calibrated</span>
              </Link>
              
              <Link href="/special-page" className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] group block relative h-80 overflow-hidden bg-white shadow-sm border border-gray-100 p-8 flex flex-col justify-center items-center text-center transition-shadow hover:shadow-md">
                <h3 className="text-2xl font-light uppercase tracking-widest mb-4">Free Size Gemstones</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">Unique, one-of-a-kind gemstones in custom dimensions.</p>
                <span className="inline-block border-b border-black pb-1 uppercase tracking-wider text-xs font-semibold group-hover:text-blue-900 transition-colors">Shop Free Size</span>
              </Link>

              <Link href="/special-page" className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] group block relative h-80 overflow-hidden bg-white shadow-sm border border-gray-100 p-8 flex flex-col justify-center items-center text-center transition-shadow hover:shadow-md">
                <h3 className="text-2xl font-light uppercase tracking-widest mb-4">Matching Pairs</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">Perfectly matched stone pairs for earrings and side stones.</p>
                <span className="inline-block border-b border-black pb-1 uppercase tracking-wider text-xs font-semibold group-hover:text-blue-900 transition-colors">Shop Pairs</span>
              </Link>

              <Link href="/trade/layouts" className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] group block relative h-80 overflow-hidden bg-white shadow-sm border border-gray-100 p-8 flex flex-col justify-center items-center text-center transition-shadow hover:shadow-md">
                <h3 className="text-2xl font-light uppercase tracking-widest mb-4">Colorstone Layouts</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">Expertly matched gemstone layouts for your custom designs.</p>
                <span className="inline-block border-b border-black pb-1 uppercase tracking-wider text-xs font-semibold group-hover:text-blue-900 transition-colors">Shop Layouts</span>
              </Link>
              
              <Link href="/trade/beads" className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] group block relative h-80 overflow-hidden bg-white shadow-sm border border-gray-100 p-8 flex flex-col justify-center items-center text-center transition-shadow hover:shadow-md">
                <h3 className="text-2xl font-light uppercase tracking-widest mb-4">Precious Beads</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">High-quality loose beads and finished bead necklaces.</p>
                <span className="inline-block border-b border-black pb-1 uppercase tracking-wider text-xs font-semibold group-hover:text-blue-900 transition-colors">Shop Beads</span>
              </Link>
            </div>
          </section>
        </FadeInUpBox>





        {/* 6. Trade Shows */}
        <FadeInUpBox delay={0.1}>
          <TradeShows />
        </FadeInUpBox>

        {/* 7. Contact Block */}
        <FadeInUpBox delay={0.2}>
          <BookAppointment />
        </FadeInUpBox>
      </div>
    </>
  );
}
