import ProductDetailsPage from "@/components/ProductDetails/ProductDetailsPage";
export { generateMetadata } from "@/components/ProductDetails/productMetaData";

export default function Page(props: any) {
  return <ProductDetailsPage {...props} />;
}
