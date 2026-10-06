import { PageHeader } from "@/components/CommonComponents/PageHeader";
import ProductDetailsPage from "@/components/ProductDetails/ProductDetailsPage";
export { generateMetadata } from "@/components/ProductDetails/productMetaData";

export default async function Page(props: any) {
  const { stone } = await props.params;
  const formattedStone = stone.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
  return (
    <div className="w-full">
      <PageHeader 
        title={`${formattedStone} Detail`} 
        subtitle="Review the specifications and high-resolution media for this calibrated gemstone." 
      />
      <ProductDetailsPage {...props} />
    </div>
  );
}
