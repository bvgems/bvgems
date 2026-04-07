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
  } else if (productType === "bead") {
    return `${item?.product?.title}`;
  }
  return (
    item?.product?.collection_slug || item?.product?.title || "Custom Product"
  );
};

export const getOrderPayload = (
  paymentMethod: any,
  deliveryMethod: any,
  shippingAddress: any,
  selectedShippingAddress: any,
  user: any,
  guestUser: any,
  cart: any,
) => {
  const orderPayload = {
    order: {
      line_items: cart?.map((item: any) => {
        console.log("first", item);
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
              { name: "Total Amount", value: formatCurrency(price) },
            );
          } else {
            price = item?.product?.price;
            quantity = Number(item?.quantity) || 1;
            properties.push(
              { name: "Shape", value: item?.product?.shape },
              { name: "Size", value: item?.product?.size },
              { name: "Color", value: item?.product?.color },
              { name: "Quality", value: item?.product?.quality },
            );
          }
          if (item?.product?.collection_slug === "Emerald") {
            if (item?.product?.shade) {
              properties?.push({ name: "Shade", value: item?.product?.shade });
            }
          }

          if (item?.product?.collection_slug === "Sapphire") {
            if (item?.product?.shade) {
              properties?.push({ name: "Shade", value: item?.product?.shade });
            }
          }
          if (item?.product?.additionalComments) {
            properties?.push({
              name: "Additional Comments",
              value: item?.product?.additionalComments,
            });
          }
        } else if (isFreeGemstone) {
          price = item?.product?.price * Number(item?.product?.ct_weight);
          quantity = 1;
          properties.push(
            { name: "Shape", value: item?.product?.shape },
            { name: "Size", value: item?.product?.size },
            { name: "Color", value: item?.product?.color },
            { name: "Quality", value: item?.product?.quality },
            {
              name: "Price per Carat",
              value: formatCurrency(item?.product?.price),
            },
            {
              name: "Gemstone Carat Weight",
              value: formatCarat(item?.product?.ct_weight),
            },
          );
        } else {
          quantity = Number(item?.quantity) || 1;
          properties.push(
            {
              name: "Price per Unit",
              value: formatCurrency(item?.product?.price),
            },
            { name: "Quantity", value: String(item?.quantity) },
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
          // if (item?.product?.size) {
          //   properties.push({ name: "Stone Size", value: item?.product?.size });
          // }

          if (item?.product?.productType === "ringJewelry") {
            properties.push({ name: "Ring Size", value: item?.product?.size });
          }
          if (item?.product?.productType === "braceletJewelry") {
            properties.push({
              name: "Bracelet Length",
              value: item?.product?.length,
            });
          }

          // if (item?.product?.length) {
          //   properties.push({ name: "Length", value: item?.product?.length });
          // }
          if (item?.product?.totalCaratWeight) {
            properties.push({
              name: "Total Carat Weight",
              value: item?.product?.totalCaratWeight,
            });
          }
        }

        if (item?.product?.needCertification) {
          properties.push({
            name: "Need Certification",
            value: item?.product?.needCertification === true ? "YES" : "NO",
          });
        }

        if (item?.product?.isGift) {
          properties.push({
            name: "FREE GIFT",
            value: "STUDS EARRINGS",
          });
        }

        if (item?.product?.quality) {
          properties.push({
            name: "Quality",
            value: item?.product?.quality,
          });
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
        paymentMethod === "memo"
          ? "Memo Purchase"
          : paymentMethod === "online"
            ? "Already Paid"
            : "",
      email: guestUser?.email || user?.email,
      phone: guestUser?.phoneNumber || user?.phoneNumber,
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
      financial_status: "paid",
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
