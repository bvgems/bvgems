"use client";

import { fetchFreeSizeGemstonesById } from "@/apis/api";
import { AuthForm } from "@/components/Auth/AuthForm";
import { ImageZoom } from "@/components/CommonComponents/ImageZoom";
import { ProductSpecifications } from "@/components/ProductDetails/ProductSpecifications";
import { useAuth } from "@/hooks/useAuth";
import { getCartStore } from "@/store/useCartStore";
import {
  Alert,
  Badge,
  Button,
  Modal,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconZoomIn, IconShare } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { QuestionAndDeliveryAccordian } from "../CommonComponents/QuestionAndDeliveryAccordian";

// 📦 PDF imports
import jsPDF from "jspdf";

type FreeSizeGemstoneDetailsProps = {
  id: string;
};

export default function FreeSizeGemstoneDetails({
  id,
}: FreeSizeGemstoneDetailsProps) {
  const [product, setProduct] = useState<any>();
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

  const [isSharing, setIsSharing] = useState(false);

  const handleShareAsPDF = async () => {
    if (!product || isSharing) return; // prevent double trigger
    setIsSharing(true);

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      // --- Add Image Centered ---
      if (product?.image_url) {
        try {
          const imgData = await fetch(product.image_url)
            .then((res) => res.blob())
            .then(
              (blob) =>
                new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.readAsDataURL(blob);
                })
            );

          const imgWidth = 70;
          const imgHeight = 70;
          pdf.addImage(
            imgData,
            "JPEG",
            (pageWidth - imgWidth) / 2,
            15,
            imgWidth,
            imgHeight
          );
        } catch (err) {
          console.error("Image load failed:", err);
        }
      }

      let y = 95;

      // --- Title ---
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text(
        `Loose ${product?.gemstone_type} ${product?.shape} ${product?.dimension}`,
        pageWidth / 2,
        y,
        { align: "center" }
      );
      y += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text(
        `${product?.ct_weight} Carat Free Size Gemstone`,
        pageWidth / 2,
        y,
        { align: "center" }
      );
      y += 15;

      // --- Two Columns ---
      const leftX = 20;
      const rightX = pageWidth / 2 + 5;
      let leftY = y;
      pdf.setFontSize(11);

      // Left column
      pdf.text(`Lot Number: ${product?.lot_number}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Stone: ${product?.gemstone_type}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Shape: ${product?.shape}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Size: ${product?.dimension}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Color: ${product?.color}`, leftX, leftY);
      leftY += 6;
      pdf.text(`CT Weight: ${product?.ct_weight}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Origin: ${product?.origin ?? "-"}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Treatment: ${product?.enhancement ?? "-"}`, leftX, leftY);
      leftY += 6;
      pdf.text(
        `Certified: ${product?.is_certified ? "Yes" : "No"}`,
        leftX,
        leftY
      );

      // Right column - Pricing
      let rightY = y;
      pdf.setFont("helvetica", "bold");
      pdf.text("Pricing:", rightX, rightY);
      rightY += 7;

      pdf.setFont("helvetica", "normal");
      pdf.text(`Per Carat Price: $${product?.price}`, rightX, rightY);
      rightY += 6;
      pdf.text(
        `Total Price: $${(product?.price * product?.ct_weight).toFixed(2)}`,
        rightX,
        rightY
      );

      // --- Description ---
      let descY = Math.max(leftY, rightY) + 15;
      pdf.setFont("helvetica", "bold");
      pdf.text("Description:", 20, descY);
      descY += 7;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const desc = `This ${product?.gemstone_type?.toLowerCase()} free size gemstone is cut and polished to showcase its brilliance. Measuring ${
        product?.dimension
      } and weighing ${
        product?.ct_weight
      } carats, it is ideal for custom jewelry designs where flexibility in size is required.`;
      const wrapped = pdf.splitTextToSize(desc, pageWidth - 40);
      pdf.text(wrapped, 20, descY);

      // --- Footer ---
      const fileName = `${product?.dimension}_${product?.gemstone_type}_${product?.ct_weight}_Details.pdf`;
      const pdfBlob = pdf.output("blob");

      // ✅ Safe Share with Fallback
      if (
        navigator.share &&
        navigator.canShare?.({
          files: [new File([pdfBlob], fileName, { type: "application/pdf" })],
        })
      ) {
        const file = new File([pdfBlob], fileName, { type: "application/pdf" });
        await navigator.share({
          title: `${product?.dimension} ${product?.gemstone_type} ${product?.ct_weight} Details`,
          files: [file],
        });
      } else {
        pdf.save(fileName); // fallback for desktop
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 px-5 mt-6">
      <Modal opened={modalOpened} onClose={close} centered>
        <AuthForm onClose={close} />
      </Modal>

      {/* Left */}
      <div className="w-full md:w-2/3 pr-2">
        <div className="p-4">
          <div className="flex mt-3">
            <Tooltip label="Share As PDF" position="left" withArrow>
              {/* <ActionIcon color="black" onClick={handleShareAsPDF}> */}
              <IconShare
                className=""
                color="gray"
                size={20}
                onClick={handleShareAsPDF}
              />
              {/* </ActionIcon> */}
            </Tooltip>
          </div>
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
              <ProductSpecifications product={product} isFreeSize={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full md:w-1/3 py-6">
        <div className="sticky top-5">
          <div className="flex flex-col gap-4">
            {/* Share PDF button */}

            {/* Title */}
            <div>
              <h1 className="text-xl font-semibold">
                Loose {product?.gemstone_type} {product?.shape}{" "}
                {product?.dimension} mm – {product?.ct_weight} Carat Free Size
                Gemstone
              </h1>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  Lot: #{product?.lot_number}
                </span>
                <Badge color="#37B24D" radius="xs">
                  Available
                </Badge>
              </div>
            </div>

            {/* Pricing */}
            {user ? (
              <div className="mt-2">
                <div className="text-md font-medium flex flex-col gap-2">
                  <span>
                    Per Carat Price: <strong>${product?.price}</strong>
                  </span>
                  <span>
                    Total Price:{" "}
                    <strong>
                      ${(product?.price * product?.ct_weight).toFixed(2)}
                    </strong>
                  </span>
                </div>
              </div>
            ) : (
              <Alert className="uppercase" color="gray" variant="light">
                Please{" "}
                <button onClick={open} className="underline text-blue-600">
                  SIGN IN
                </button>{" "}
                to view gemstone prices.
              </Alert>
            )}

            <QuestionAndDeliveryAccordian
              description={`This ${product?.gemstone_type?.toLowerCase()} free size gemstone is cut and polished to showcase its brilliance. Measuring ${
                product?.dimension
              } and weighing ${
                product?.ct_weight
              } carats, it is ideal for custom jewelry designs.`}
            />

            {user && (
              <Button color="#0b182d" onClick={addProductToCart} fullWidth>
                ADD TO CART
              </Button>
            )}
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
                url: `https://www.bvgems.com/free-size/${product?.id}`,
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
