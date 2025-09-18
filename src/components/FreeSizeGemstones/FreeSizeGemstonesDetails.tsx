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
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { QuestionAndDeliveryAccordian } from "../CommonComponents/QuestionAndDeliveryAccordian";

type FreeSizeGemstoneDetailsProps = {
  id: string;
};

export default function FreeSizeGemstoneDetails({
  id,
}: FreeSizeGemstoneDetailsProps) {
  const searchParams = useSearchParams();

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
      caratWeight: ``,
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
              <ImageZoom
                alt={`Loose ${product?.gemstone_type} ${product?.shape} ${product?.dimension} gemstone – Free Size`}
                src={product?.image_url}
              />
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
      <div className="w-full md:w-1/3 py-6">
        <div className="sticky top-5">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <h1 className="text-xl font-semibold">
                Loose {product?.gemstone_type} {product?.shape}{" "}
                {product?.dimension} – {product?.ct_weight} Carat Free Size
                Gemstone
              </h1>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  Item: #{product?.lot_number}
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
                  <span>
                    Total Price:{" "}
                    <strong>
                      {product?.price ? product?.price * product?.ct_weight : 0}
                    </strong>
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

            <QuestionAndDeliveryAccordian
              description={` This ${product?.gemstone_type?.toLowerCase()} free size gemstone is
              cut and polished to showcase its brilliance. Measuring
              ${product?.dimension} and weighing ${
                product?.ct_weight
              } carats, it
              is ideal for custom jewelry designs where flexibility in size is
              required. B.V. Gems provides a curated collection of loose
              gemstones, ethically sourced and hand-inspected in New York’s
              Diamond District. Perfect for jewelers, collectors, and designers
              seeking high-quality stones for unique projects.`}
            />
            {user && (
              <Button color="#0b182d" onClick={addProductToCart} fullWidth>
                ADD TO CART
              </Button>
            )}
            <div className="flex gap-2">
              <IconInfoCircle size={20} color="gray" />
              <p className="text-sm text-gray-400">
                Prices and availability are subject to change without notice.
                All weights and dimensions are approximate.
              </p>
            </div>
          </div>
        </div>
      </div>
      {product && (
        <Script
          id="product-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: `Loose ${product?.gemstone_type} ${product?.shape} ${product?.dimension}`,
              image: product?.image_url,
              description: `Loose ${product?.gemstone_type} gemstone (${product?.shape}, ${product?.dimension}, ${product?.ct_weight} carats). Free size stone ideal for custom jewelry.`,
              sku: product?.lot_number,
              brand: { "@type": "Brand", name: "B.V. Gems" },
              offers: {
                "@type": "Offer",
                url: `https://bvgems.com/free-size/${product?.id}`,
                priceCurrency: "USD",
                price: product?.price,
                availability: "http://schema.org/InStock",
              },
            }),
          }}
        />
      )}
    </div>
  );
}
