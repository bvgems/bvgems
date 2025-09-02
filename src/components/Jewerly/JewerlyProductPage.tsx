"use client";
import { fetchProductByHandle } from "@/apis/api";
import {
  Anchor,
  Breadcrumbs,
  Grid,
  GridCol,
  Image,
  Slider,
} from "@mantine/core";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ImageZoom } from "@/components/CommonComponents/ImageZoom";
import { JewelryProductDetails } from "@/components/Jewerly/JewerlyProductDetails";
import { RingComparison } from "./RingComparison";

type Thumb = { url: string; title?: string | null };

export default function JewelryProductPage() {
  const { product } = useParams();
  const path = usePathname();
  const pathArray = path?.split("/");
  const category = pathArray[2];
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const [productData, setProductData] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [thumbnails, setThumbnails] = useState<Thumb[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [showShapeOptions, setShowShapeOptions] = useState<boolean>(false);
  const [twoStoneRings, setTwoStoneRings] = useState<boolean>(false);
  const [productType, setProductType] = useState();
  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: capitalize(category), href: `/jewelry/${category}` },
    { title: productData?.title },
  ].map((item, index) => (
    <Anchor
    size="sm"
      href={item.href}
      key={index}
      style={{
        fontSize: "10px",
      }}
    >
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    const getProductByHandle = async () => {
      if (!product) return;

      const response = await fetchProductByHandle(product as string);
      const productInfo = response?.product;
      if (!productInfo) return;

      const isTwoStoneRing = productInfo?.isTwoStoneRing?.value === "true";
      const shapeOptionValue = productInfo?.showshapeoptions?.value === "true";
      setShowShapeOptions(shapeOptionValue);
      setTwoStoneRings(isTwoStoneRing);
      setProductType(productInfo?.productType);
      setProductData(productInfo);

      let images: Thumb[] = [];

      if (isTwoStoneRing) {
        images =
          productInfo?.images?.edges?.map((e: any) => ({
            url: e?.node?.url,
            title: null,
          })) ?? [];
      } else if (shapeOptionValue) {
        const variantEdges = productInfo?.variants?.edges ?? [];
        images = variantEdges
          .map((v: any) => ({
            url: v?.node?.image?.url,
            title: v?.node?.title,
          }))
          .filter((t: Thumb) => !!t.url);
      } else {
        images =
          productInfo?.images?.edges?.map((e: any) => ({
            url: e?.node?.url,
            title: null,
          })) ?? [];
      }

      setThumbnails(images);
      const firstUrl = images?.[0]?.url || "/placeholder.png";
      setSelectedImage(firstUrl);

      const firstShape = images?.[0]?.title || null;
      if (firstShape) setSelectedShape(firstShape);
    };

    getProductByHandle();
  }, [product]);

  const handleShapeChange = (shape: string) => {
    setSelectedShape(shape);
    const matched = thumbnails.find((t) =>
      (t.title || "").toLowerCase().includes(shape.toLowerCase())
    );
    if (matched?.url) setSelectedImage(matched.url);
  };

  const selectedIdx = useMemo(
    () => thumbnails.findIndex((t) => t.url === selectedImage),
    [thumbnails, selectedImage]
  );

  return (
    <>
      <div className="p-6">
        <Breadcrumbs separator=">" className="mb-6">
          {breadcrumbItems}
        </Breadcrumbs>
      </div>
      <div className="p-9">
        <Grid>
          {/* LEFT: Imagery */}
          <GridCol span={{ base: 12, md: 7 }}>
            {productData && (
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Product Image */}
                <div className="flex flex-col items-center">
                  <ImageZoom
                    src={selectedImage || "/placeholder.png"}
                    alt={productData?.title}
                  />

                  {/* Thumbnails below ONLY the product image */}
                  <div className="flex gap-3 flex-wrap justify-center mt-6">
                    {thumbnails.map((thumb, idx) => {
                      const isActive = idx === selectedIdx;
                      return (
                        <button
                          key={`${thumb.url}-${idx}`}
                          type="button"
                          onClick={() => {
                            setSelectedImage(thumb.url);
                            if (thumb.title) setSelectedShape(thumb.title);
                          }}
                          aria-selected={isActive}
                          className={`rounded border overflow-hidden w-20 h-20 focus:outline-none ${
                            isActive ? "border-black" : "border-gray-300"
                          }`}
                          title={thumb.title ?? `Image ${idx + 1}`}
                        >
                          <Image
                            src={thumb.url}
                            alt={thumb.title || `thumb-${idx}`}
                            fit="cover"
                            height={80}
                            width={80}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
                {productType === "Rings" ? (
                  <RingComparison productData={productData} />
                ) : null}
              </motion.div>
            )}
          </GridCol>

          {/* RIGHT: Details */}
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
    </>
  );
}
