"use client";
import { fetchProductByHandle } from "@/apis/api";
import { Grid, GridCol, Image } from "@mantine/core";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImageZoom } from "@/components/CommonComponents/ImageZoom";
import { JewelryProductDetails } from "@/components/Jewerly/JewerlyProductDetails";

export default function JewelryProductPage() {
  const { product } = useParams();
  const path = usePathname();

  const [productData, setProductData] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [showShapeOptions, setShowShapeOptions] = useState<boolean>(false);
  const [twoStoneRings, setTwoStoneRings] = useState<boolean>(false);

  useEffect(() => {
    const getProductByHandle = async () => {
      if (!product) return;

      const response = await fetchProductByHandle(product);
      const productInfo = response?.product;

      const isTwoStoneRing = productInfo?.isTwoStoneRing?.value === "true";
      const shapeOptionValue = productInfo?.showshapeoptions?.value === "true";
      setShowShapeOptions(shapeOptionValue);
      setTwoStoneRings(isTwoStoneRing);
      setProductData(productInfo);

      let images = [];

      if (isTwoStoneRing) {
        images = productInfo?.images?.edges?.map(
          (item: any) => item?.node?.url
        );
      } else {
        if (shapeOptionValue) {
          const variantEdges = productInfo?.variants?.edges || [];
          images = variantEdges.map((v: any) => ({
            url: v?.node?.image?.url,
            title: v?.node?.title,
          }));
        } else {
          images = productInfo?.images?.edges?.map(
            (item: any) => item?.node?.url
          );
        }
      }

      setThumbnails(images);
      setSelectedImage(images?.[0]?.url || images?.[0] || "/placeholder.png");

      const firstShape = images?.[0]?.title || null;
      if (firstShape) {
        setSelectedShape(firstShape);
      }
    };

    getProductByHandle();
  }, [product]);

  const handleShapeChange = (shape: string) => {
    setSelectedShape(shape);

    const matched = thumbnails.find((t) =>
      t.title?.toLowerCase().includes(shape.toLowerCase())
    );
    if (matched) {
      setSelectedImage(matched.url);
    }
  };

  return (
    <div className="mt-9 p-9">
      <Grid>
        <GridCol span={{ base: 12, md: 7 }}>
          {productData && (
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ImageZoom
                src={selectedImage || "/placeholder.png"}
                alt={productData?.title}
              />

              <div className="flex gap-3 flex-wrap justify-center">
                {!showShapeOptions
                  ? thumbnails.map((thumb: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(thumb)}
                        className={`border rounded cursor-pointer overflow-hidden w-20 h-20 ${
                          selectedImage === thumb
                            ? "border-black"
                            : "border-gray-300"
                        }`}
                      >
                        <Image
                          src={thumb}
                          alt={`thumb-${idx}`}
                          fit="cover"
                          height={80}
                          width={80}
                        />
                      </div>
                    ))
                  : twoStoneRings && showShapeOptions
                  ? thumbnails.map((thumb: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(thumb)}
                        className={`border rounded cursor-pointer overflow-hidden w-20 h-20 ${
                          selectedImage === thumb
                            ? "border-black"
                            : "border-gray-300"
                        }`}
                      >
                        <Image
                          src={thumb}
                          alt={`thumb-${idx}`}
                          fit="cover"
                          height={80}
                          width={80}
                        />
                      </div>
                    ))
                  : thumbnails.map((thumb: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedImage(thumb?.url);
                          setSelectedShape(thumb?.title || null);
                        }}
                        className={`border rounded cursor-pointer overflow-hidden w-20 h-20 ${
                          selectedImage === thumb?.url
                            ? "border-black"
                            : "border-gray-300"
                        }`}
                      >
                        <Image
                          src={thumb?.url}
                          alt={`thumb-${idx}`}
                          fit="cover"
                          height={80}
                          width={80}
                        />
                      </div>
                    ))}
              </div>
            </motion.div>
          )}
        </GridCol>

        <GridCol span={{ base: 12, md: 5 }}>
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <JewelryProductDetails
              path={path}
              productData={productData}
              selectedShape={selectedShape}
              onShapeChange={handleShapeChange}
              selectedImage={selectedImage}
              twoStoneRings={twoStoneRings}
            />
          </motion.div>
        </GridCol>
      </Grid>
    </div>
  );
}
