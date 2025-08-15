const formatCurrency = (value: number) =>
  `$${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatCarat = (value: number) => `${Number(value).toFixed(2)} ct`;

const getTitle = (item: any, productType: any) => {
  if (productType === "freeSizeStone") {
    return `${item?.product?.collection_slug} ${item?.product?.shape} ${item?.product?.size} ${item?.product?.ct_weight}`;
  } else if (productType === "stone") {
    return `${item?.product?.collection_slug} ${item?.product?.shape} ${item?.product?.size} ${item?.product?.ct_weight} Quality ${item?.product?.quality}`;
  }
  return item?.product?.collection_slug || "Custom Product";
};

export const getOrderPayload = (
  paymentMethod: any,
  deliveryMethod: any,
  shippingAddress: any,
  selectedShippingAddress: any,
  user: any,
  guestUser: any,
  cart: any
) => {
  const orderPayload = {
    order: {
      line_items: cart?.map((item: any) => {
        console.log("item", item);
        const productType = item?.product?.productType;
        const isStone = productType === "stone";
        const isFreeGemstone = productType === "freeSizeStone";

        let price = item.product?.price;
        let quantity: number = 1;
        let properties: any[] = [];

        if (isStone) {
          if (item?.product?.purchaseByCarat) {
            price = Number(item?.product?.price) * Number(item?.caratWeight);
            quantity = 1;
            properties.push(
              { name: "Shape", value: item?.product?.shape },
              { name: "Size", value: item?.product?.size },
              { name: "Quality", value: item?.product?.quality },
              {
                name: "Selected Carat Weight",
                value: formatCarat(item?.caratWeight),
              },
              { name: "Total Amount", value: formatCurrency(price) }
            );
          } else {
            price = item?.product?.price;
            quantity = Number(item?.quantity) || 1;
            properties.push(
              { name: "Shape", value: item?.product?.shape },
              { name: "Size", value: item?.product?.size },
              { name: "Quality", value: item?.product?.quality }
            );
          }
        } else if (isFreeGemstone) {
          price = item?.product?.price * Number(item?.product?.ct_weight);
          quantity = 1;
          properties.push(
            { name: "Shape", value: item?.product?.shape },
            { name: "Size", value: item?.product?.size },
            { name: "Quality", value: item?.product?.quality },
            {
              name: "Price per Carat",
              value: formatCurrency(item?.product?.price),
            },
            {
              name: "Gemstone Carat Weight",
              value: formatCarat(item?.product?.ct_weight),
            }
          );
        } else {
          quantity = Number(item?.quantity) || 1;
          properties.push(
            {
              name: "Price per Unit",
              value: formatCurrency(item?.product?.price),
            },
            { name: "Quantity", value: String(item?.quantity) }
          );

          if (item?.product?.goldColor) {
            properties.push({
              name: "Gold Color",
              value: item?.product?.goldColor,
            });
          }
          if (item?.product?.gemstone) {
            properties.push({ name: "Stone", value: item?.product?.gemstone });
          }
          if (item?.product?.shape) {
            properties.push({ name: "Shape", value: item?.product?.shape });
          }
          if (item?.product?.size) {
            properties.push({ name: "Stone Size", value: item?.product?.size });
          }
          if (item?.product?.length) {
            properties.push({ name: "Length", value: item?.product?.length });
          }
        }

        const imageUrl =
          item?.jewelryProduct?.image_url ?? item?.product?.image_url ?? "";
        const isStored = !!item?.product?.variantId;

        return isStored
          ? {
              variant_id: item?.product?.variantId,
              quantity,
              properties,
              requires_shipping: deliveryMethod === "delivery",
              fulfillment_service: "manual",
            }
          : {
              title: getTitle(item, productType),
              quantity,
              price: price,
              requires_shipping: deliveryMethod === "delivery",
              taxable: true,
              fulfillment_service: "manual",
              properties: [
                ...properties,
                { name: "_image_url", value: imageUrl },
              ],
            };
      }),
      tags:
        paymentMethod === "cod"
          ? "Pickup Payment"
          : paymentMethod === "memo"
          ? "Memo Purchase"
          : paymentMethod === "online"
          ? "Already Paid"
          : "",
      email: user ? user?.email : guestUser?.email,
      phone: user ? user?.phoneNumber : guestUser?.phoneNumber,
      customer: {
        email: user ? user?.email : guestUser?.email || "guest@example.com",
        first_name: user ? user?.firstName : guestUser?.firstName || "Guest",
        last_name: user ? user?.lastName : guestUser?.lastName || "User",
        phone: user ? user?.phoneNumber : guestUser?.phoneNumber || null,
        accepts_marketing: false,
        accepts_marketing_updated_at: new Date().toISOString(),
        marketing_opt_in_level: "single_opt_in",
        tags: "online-store",
      },
      financial_status: "pending",
      send_receipt: paymentMethod === "cod",
      fulfillment_status: "unfulfilled",
      currency: "USD",
      buyer_accepts_marketing: false,
      billing_address: {
        first_name:
          selectedShippingAddress?.fullName ??
          shippingAddress?.fullName ??
          "Guest",
        last_name:
          selectedShippingAddress?.fullName ??
          shippingAddress?.fullName ??
          "User",
        address1:
          selectedShippingAddress?.addressLine1 ??
          shippingAddress?.addressLine1 ??
          "",
        address2:
          selectedShippingAddress?.addressLine2 ??
          shippingAddress?.addressLine2 ??
          "",
        city: selectedShippingAddress?.city ?? shippingAddress?.city ?? "",
        province:
          selectedShippingAddress?.state ?? shippingAddress?.state ?? "",
        country:
          selectedShippingAddress?.country ?? shippingAddress?.country ?? "",
        zip: selectedShippingAddress?.zipCode ?? shippingAddress?.zipCode ?? "",
        phone:
          selectedShippingAddress?.phoneNumber ??
          shippingAddress?.phoneNumber ??
          guestUser?.phoneNumber ??
          "",
      },
      shipping_address: {
        first_name:
          selectedShippingAddress?.fullName ??
          shippingAddress?.fullName ??
          "Guest",
        last_name:
          selectedShippingAddress?.fullName ??
          shippingAddress?.fullName ??
          "User",
        address1:
          selectedShippingAddress?.addressLine1 ??
          shippingAddress?.addressLine1 ??
          "",
        address2:
          selectedShippingAddress?.addressLine2 ??
          shippingAddress?.addressLine2 ??
          "",
        city: selectedShippingAddress?.city ?? shippingAddress?.city ?? "",
        province:
          selectedShippingAddress?.state ?? shippingAddress?.state ?? "",
        country:
          selectedShippingAddress?.country ?? shippingAddress?.country ?? "",
        zip: selectedShippingAddress?.zipCode ?? shippingAddress?.zipCode ?? "",
        phone:
          selectedShippingAddress?.phoneNumber ??
          shippingAddress?.phoneNumber ??
          guestUser?.phoneNumber ??
          "",
      },
    },
  };

  return orderPayload;
};

const getCompositeKey = (
  productId: any,
  variables: any,
  isRingCategory: any,
  isNecklaces: any
) => {
  if (isRingCategory) {
    return `${productId}_${variables?.goldColor}_${variables?.size}_${variables?.stone}`;
  } else {
    return `${productId}_${variables?.goldColor}_${variables?.size}_${variables?.length}`;
  }
};

export const addProductToCart = (
  productData: any,
  quantity: number,
  addToCart: any,
  variables: any,
  isBead: boolean,
  isRingCategory: boolean,
  isNecklaces: boolean,
  isBracelets: boolean,
  isEarringCategory: boolean,
  firstStone: string | any,
  secondStone: any
) => {
  if (!productData) return;
  console.log("prodd", productData);

  const showshapeoptions = productData?.showshapeoptions?.value === "true";

  const jewelryItem = {
    product: {
      productType: isBead
        ? "bead"
        : isRingCategory
        ? "ringJewelry"
        : isNecklaces
        ? "necklaceJewelry"
        : isBracelets
        ? "braceletJewelry"
        : isEarringCategory
        ? "earringJewelry"
        : "Product",
      productId: isBead
        ? productData?.productId
        : getCompositeKey(
            productData?.id,
            variables,
            isRingCategory,
            isNecklaces
          ),
      handle: productData?.handle,
      collection_slug: productData?.title,
      color: "",
      ct_weight: productData?.ct_weight,
      cut: "",
      image_url: variables?.image || productData?.images?.edges?.[0]?.node?.url,
      price: productData?.variants?.edges?.[0]?.node?.price?.amount,

      gemstone: variables?.stone,
      size: variables?.size || "",
      shape: productData?.shape?.value || "",
      type: "",
      goldColor: variables?.goldColor || "",
      length: variables?.length || "",
      firstStone: isRingCategory ? firstStone : "",
      secondStone: isRingCategory ? secondStone : "",
    },
    quantity,
  };

  addToCart(jewelryItem);
};
