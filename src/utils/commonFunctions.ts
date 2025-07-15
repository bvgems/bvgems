export const addProductToCart = (
  productData: any,
  quantity: number,
  addToCart: any
) => {
  if (!productData) return;

  const jewelryItem = {
    product: {
      productType: "jewerly",
      productId: productData?.id,
      collection_slug: productData?.title,
      color: "",
      ct_weight: 0,
      cut: "",
      image_url: productData?.images?.edges?.[0]?.node?.url,
      price: productData?.variants?.edges?.[0]?.node?.price?.amount,
      shape: "",
      size: "",
      type: "",
    },
    quantity,
  };

  addToCart(jewelryItem);
};
