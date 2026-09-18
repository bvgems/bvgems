import { redirect, permanentRedirect } from "next/navigation";

type Props = {
  params: Promise<{ category: string; product: string; stone: string }>;
};

export default async function JewelryRedirect({ params }: Props) {
  const { category, product, stone } = await params;
  permanentRedirect(`/jewelry/${category}/${product}/${stone}`);
}
