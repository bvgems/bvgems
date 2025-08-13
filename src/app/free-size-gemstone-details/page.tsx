"use client";

import { fetchFreeSizeGemstones, fetchFreeSizeGemstonesById } from "@/apis/api";
import { AuthForm } from "@/components/Auth/AuthForm";
import { ImageZoom } from "@/components/CommonComponents/ImageZoom";
import { ProductAccordion } from "@/components/ProductDetails/ProductAccordion";
import { ProductSpecifications } from "@/components/ProductDetails/ProductSpecifications";
import { useAuth } from "@/hooks/useAuth";
import { getCartStore } from "@/store/useCartStore";
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Modal,
  NumberInput,
  Switch,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconInfoCircle, IconZoomIn } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function FreeSizeGemstonePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState<any>();
  const [caratWeight, setCaratWeight] = useState<number>(0);
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";

  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);

  const [modalOpened, { open, close }] = useDisclosure(false);

  const router = useRouter();
  const addProductToCart = () => {
    if (!product) return;

    const getPerCaratPrice = (item: any): number => {
      if (!item) return 0;
      return Number((item.price * caratWeight).toFixed(2));
    };
    const perCarat = getPerCaratPrice(product);
    console.log("per carat", perCarat, product, caratWeight);

    addToCart({
      product: {
        id: product?.id,
        handle: "",
        productType: "freeSizeStone",
        purchaseByCarat: true,
        productId: product.id,
        collection_slug: product.gemstone_type,
        color: product.color,
        ct_weight: product.ct_weight,
        cut: "",
        image_url: product.image_url,
        price: product?.price,
        quality: "",
        shape: product.shape,
        size: product.dimension,
        type: "",
      },
      quantity: 1,
      caratWeight: `${caratWeight}`,
    });

    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      message: "Product Added To The Cart!",
      position: "top-right",
      autoClose: 4000,
    });
  };

  const getFreeSizeGemstonesById = async () => {
    const result = await fetchFreeSizeGemstonesById(id);
    setProduct(result);
  };
  const handleCaratWeightChanges = (value: number) => {
    const ctw = Math.max(0.01, Number(value) || 0.01);
    setCaratWeight(ctw);
  };

  useEffect(() => {
    getFreeSizeGemstonesById();
  }, [id]);

  return (
    <div className="flex flex-col md:flex-row gap-6 px-5 mt-6">
      <Modal
        opened={modalOpened}
        onClose={close}
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        <AuthForm onClose={close} />
      </Modal>

      {/* Left: Image and specs */}
      <div className="w-full md:w-2/3 pr-2">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-7/12 flex flex-col items-center">
              <ImageZoom src={product?.image_url} />
              <div className="text-xs text-gray-500 flex items-center mt-2">
                <IconZoomIn size={15} className="mr-1" />
                Hover on the image to zoom
              </div>
            </div>
            <div className="w-full md:w-5/12">
              <ProductSpecifications
                // getProduct={getProduct}
                product={product}
                // allProducts={allProducts}
                isFreeSize={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Pricing and actions */}
      <div className="w-full md:w-1/3">
        <div className="sticky top-5">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <h1 className="text-xl font-semibold">
                {product?.collection_slug} {product?.shape} {product?.size}{" "}
                {product?.ct_weight}cts., {product?.quality} Quality
              </h1>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  Item: #{product?.id}
                </span>
                <Badge color="#37B24D" radius="xs">
                  Available
                </Badge>
              </div>
            </div>

            {/* Price section */}
            {user ? (
              <div className="mt-2">
                <div className="text-md font-medium flex flex-col gap-2">
                  <span>
                    Per Carat Price: <strong>{product?.price}</strong>
                  </span>
                </div>

                {/* Show Request Pricing only once */}
              </div>
            ) : (
              <Alert className="uppercase" color="gray" variant="light">
                Please{" "}
                <button
                  onClick={open}
                  className="underline text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  SIGN IN
                </button>{" "}
                to view gemstone prices.
              </Alert>
            )}

            {/* Switch for mode selection */}

            {/* Input section */}
            {user && (
              <div className="flex items-center justify-between gap-2">
                <div>Carat Weight:</div>
                <NumberInput
                  value={caratWeight}
                  onChange={(value: any) => handleCaratWeightChanges(value)}
                  min={0.01}
                  step={0.01}
                />
              </div>
            )}

            {/* Alert */}
            <Alert
              variant="light"
              color="#0b182d"
              title="HAVE A QUESTION?"
              icon={<IconInfoCircle />}
            >
              <div className="flex flex-col gap-3">
                <Text size="md">Contact us now</Text>
                <Text size="sm" c="dimmed">
                  We're here to help with any questions or concerns about your
                  order — feel free to reach out for assistance.
                </Text>
                <Button
                  onClick={() => router.push("/customer-support/contact-us")}
                  color="#99a1af"
                  size="xs"
                  className="self-start"
                >
                  CONTACT US NOW
                </Button>
              </div>
            </Alert>

            <ProductAccordion />
            {user && (
              <Button color="#0b182d" onClick={addProductToCart} fullWidth>
                ADD TO CART
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
