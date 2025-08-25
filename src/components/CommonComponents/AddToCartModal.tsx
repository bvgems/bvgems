"use client";

import {
  Button,
  Modal,
  Text,
  Image,
  Grid,
  GridCol,
  Switch,
  Textarea,
} from "@mantine/core";
import { IconCheck, IconShoppingCart } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { GemstonesInputSection } from "./GemstonesInputSection";
import { useAuth } from "@/hooks/useAuth";
import { addProductToCart } from "@/utils/commonFunctions";
import { notifications } from "@mantine/notifications";
import { getCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

interface AddToCartModalProps {
  opened: boolean;
  onClose: () => void;
  price: number | string;
  image_url: string;
  name: string;
  size?: string;
  quality?: string;
  ct_weight?: string | number;
  color?: string;
  product: any;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({
  opened,
  onClose,
  price,
  image_url,
  name,
  size,
  quality,
  ct_weight,
  color,
  product,
}) => {
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";
  const router = useRouter();
  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);
  const [purchaseByCarat, setPurchaseByCarat] = useState<boolean>(false);
  const [caratError, setCaratError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const [caratWeight, setCaratWeight] = useState<number>(0);

  const LAB_LABELS = new Set(["Lab Grown", "Lab-Grown"]);

  const isLabGrown = (item: any) =>
    LAB_LABELS.has(item?.type) || LAB_LABELS.has(item?.quality);

  const getPerCaratPrice = (item: any): number => {
    if (!item) return 0;
    if (isLabGrown(item)) return 50;
    if (!item?.ct_weight || !item?.price) return 0;
    return Number((item.price / item.ct_weight).toFixed(2));
  };

  const getPerStonePrice = (item: any): number => {
    if (!item) return 0;
    if (!item?.ct_weight) return 0;
    if (isLabGrown(item)) return Number((50 * item.ct_weight).toFixed(2));
    return item?.price ? Number(item.price) : 0;
  };

  const addProductToCart = () => {
    if (!product) return;

    const perStone = getPerStonePrice(product);
    const perCarat = getPerCaratPrice(product);

    addToCart({
      product: {
        id: product?.id,
        handle: product?.collection_slug?.toLowerCase(),
        productType: "stone",
        purchaseByCarat: purchaseByCarat,
        productId: product.id,
        collection_slug: product.collection_slug,
        color: product.color,
        ct_weight: product.ct_weight,
        cut: product.cut,
        shade: product?.shade || "",
        image_url: product.image_url,
        price: purchaseByCarat ? perCarat : perStone,
        quality: product.quality,
        shape: product.shape,
        size: product.size,
        type: product.type,
      },
      quantity: purchaseByCarat ? 1 : quantity,
      caratWeight: purchaseByCarat ? `${caratWeight}` : undefined,
    });

    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      message: "Product Added To The Cart!",
      position: "top-right",
      autoClose: 4000,
    });
    onClose();
  };

  useEffect(() => {
    if (product?.ct_weight) {
      setCaratWeight(product.ct_weight);
    }
  }, [product]);

  const handleRedirect = () => {
    console.log("prodddd", product);
    router?.push(
      `/product-details?id=${
        product?.id
      }&name=${product?.collection_slug?.toLowerCase()}`
    );
  };
  return (
    <Grid>
      <GridCol span={{ base: 12, md: 5 }}>
        <Image
          src={image_url}
          alt={name}
          radius="md"
          className="shadow-md border border-gray-200"
        />
      </GridCol>

      <GridCol span={{ base: 12, md: 7 }}>
        <div className="px-10 flex flex-col gap-4">
          <h1
            onClick={handleRedirect}
            className="text-blue-800 cursor-pointer text-[20px] hover:underline"
          >{`${size} ${name}, Quality ${quality}, ${ct_weight} ct.`}</h1>
          <div>
            <h1 className="mt-3 text-lg font-normal">
              Per Stone Price: $ {Number(price).toFixed(2)}
            </h1>
            <h1 className="mt-3 text-lg font-normal">
              Per Carat Price: ${" "}
              {(Number(price) / Number(ct_weight)).toFixed(2)}
            </h1>
          </div>
          <div>
            {user && (
              <Switch
                checked={purchaseByCarat}
                onChange={(event) =>
                  setPurchaseByCarat(event.currentTarget.checked)
                }
                label="Purchase by Carat Weight"
                color="teal"
                size="md"
                mt={"lg"}
              />
            )}
            <GemstonesInputSection
              purchaseByCarat={purchaseByCarat}
              caratWeight={caratWeight}
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              caratError={caratError}
              setCaratError={setCaratError}
              setCaratWeight={setCaratWeight}
              //   recalcTotal={recalcTotal}
            />
          </div>
          <div className="mt-4">
            <Textarea
              resize="vertical"
              label="Special Instructions For B. V."
              placeholder="Your comment"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <Button onClick={addProductToCart} color="#0b182d" fullWidth>
              ADD TO CART
            </Button>
          </div>
        </div>
      </GridCol>
    </Grid>
  );
};
