import ProductDetailsPage from "@/components/ProductDetails/ProductDetailsPage";
export { generateMetadata } from "@/components/ProductDetails/productMetaData";

export default function Page(props: any) {
  // We can pass params to ProductDetailsPage which will extract the ID from the slug
  return <ProductDetailsPage {...props} />;
}
