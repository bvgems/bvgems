"use client";

import { fetchProductByHandle } from "@/apis/api";
import {
  Anchor,
  Breadcrumbs,
  Card,
  Container,
  Flex,
  Grid,
  GridCol,
  Image,
} from "@mantine/core";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ImageZoom } from "@/components/CommonComponents/ImageZoom";
import { JewelryProductDetails } from "@/components/Jewerly/JewerlyProductDetails";
import Script from "next/script";
import type { Metadata } from "next";
import { RingComparison } from "./RingComparison";

type PageProps = {
  params: any;
};

// ---------- Metadata for SEO ----------
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { product, category, stone } = params;
  const response = await fetchProductByHandle(product);
  const productData = response?.product;

  if (!productData) {
    return {
      title: "Jewelry | B.V. Gems",
      description: "Explore fine gemstone jewelry from B.V. Gems.",
    };
  }

  const gemstone = stone ? stone.replace(/-/g, " ") : "";
  const title = `${productData.title} in ${gemstone} | B.V. Gems`;
  const description = `Shop the ${
    productData.title
  } with ${gemstone} gemstones at B.V. Gems. Crafted in ${
    productData?.goldType?.value || "14K Gold"
  }, ethically sourced and shipped free in the U.S.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website", // ✅ changed from "product" to "website"
      images:
        productData?.images?.edges?.map((img: any) => img?.node?.url) || [],
      url: `https://bvgems.com/jewelry-details/${category}/${product}/${stone}`,
      siteName: "B.V. Gems",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        productData?.images?.edges?.[0]?.node?.url || "/default-jewelry.jpg",
      ],
    },
    alternates: {
      canonical: `https://bvgems.com/jewelry-details/${category}/${product}/${stone}`,
    },
  };
}

// ---------- Component ----------
type Thumb = { url: string; title?: string | null };

export default function JewelryProductPage() {
  const { product, category, stone } = useParams<any>();

  const path = usePathname();
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const [productData, setProductData] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [thumbnails, setThumbnails] = useState<Thumb[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [twoStoneRings, setTwoStoneRings] = useState<boolean>(false);
  const [productType, setProductType] = useState<string | undefined>();

  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: capitalize(category), href: `/jewelry/${category}` },
    // { title: productData?.title, href: undefined as any },
    { title: capitalize(stone), href: undefined as any },
  ];

  useEffect(() => {
    const getProductByHandle = async () => {
      if (!product) return;

      const response = await fetchProductByHandle(product as string);
      const productInfo = response?.product;
      if (!productInfo) return;

      const isTwoStoneRing = productInfo?.isTwoStoneRing?.value === "true";
      const shapeOptionValue = productInfo?.showshapeoptions?.value === "true";

      setTwoStoneRings(isTwoStoneRing);
      setProductType(productInfo?.productType);
      setProductData(productInfo);

      let images: Thumb[] = [];
      const variantEdges = productInfo?.variants?.edges ?? []; // ✅ define here

      if (isTwoStoneRing) {
        images =
          productInfo?.images?.edges?.map((e: any) => ({
            url: e?.node?.url,
            title: null,
          })) ?? [];
      } else if (shapeOptionValue) {
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

      const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, "-");

      // Inside your effect:
      if (stone && variantEdges?.length) {
        const match = variantEdges.find(
          (v: any) => slugify(v?.node?.title || "") === stone.toLowerCase()
        );

        if (match?.node) {
          setSelectedShape(match.node.title);
          setSelectedImage(match.node.image?.url || images?.[0]?.url);
          return;
        }
      }

      const firstUrl = images?.[0]?.url || "/placeholder.png";
      setSelectedImage(firstUrl);

      const firstShape = images?.[0]?.title || null;
      if (firstShape) setSelectedShape(firstShape);
    };

    getProductByHandle();
  }, [product, stone]);

  const handleShapeChange = (shape: string) => {
    setSelectedShape(shape);
    const matched = thumbnails.find(
      (t) => (t.title || "").toLowerCase() === shape.toLowerCase()
    );
    if (matched?.url) setSelectedImage(matched.url);
  };

  const selectedIdx = useMemo(
    () => thumbnails.findIndex((t) => t.url === selectedImage),
    [thumbnails, selectedImage]
  );

  return (
    <>
      <Container size={1350} className="py-6">
        <Breadcrumbs separator=">">
          {breadcrumbItems.map((item, index) => (
            <Anchor
              size="sm"
              href={item.href}
              key={index}
              style={{ fontSize: 12 }}
              onClick={(e) => {
                if (!item.href) e.preventDefault();
              }}
            >
              {item.title}
            </Anchor>
          ))}
        </Breadcrumbs>
      </Container>

      <Container size={1350} className="pb-14">
        <Grid gutter="xl" align="flex-start">
          {/* LEFT: Imagery */}
          <GridCol span={{ base: 12, md: 7 }}>
            {productData && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <div className="flex flex-col items-center">
                  <ImageZoom
                    src={selectedImage || "/placeholder.png"}
                    alt={`${productData?.title} - ${selectedShape}`}
                    radius="md"
                    fit="contain"
                    height={420}
                    style={{ objectFit: "contain" }}
                  />
                </div>

                {/* Thumbnails row */}
                <Flex justify="center" gap="md" mt="md" wrap="wrap">
                  {thumbnails.map((thumb, idx) => {
                    const isActive = idx === selectedIdx;
                    return (
                      <Card
                        key={`${thumb.url}-${idx}`}
                        radius="md"
                        shadow="sm"
                        padding={4}
                        withBorder
                        style={{
                          cursor: "pointer",
                          border: isActive
                            ? "2px solid #0b182d"
                            : "1px solid #ddd",
                          width: 82,
                          height: 82,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => {
                          setSelectedImage(thumb.url);
                          if (thumb.title) setSelectedShape(thumb.title);
                        }}
                        title={thumb.title ?? `Image ${idx + 1}`}
                        aria-selected={isActive}
                      >
                        <Image
                          src={thumb.url}
                          alt={`${productData?.title} - ${
                            thumb.title || `Image ${idx + 1}`
                          }`}
                          fit="contain"
                          width={72}
                          height={72}
                          style={{ objectFit: "contain" }}
                        />
                      </Card>
                    );
                  })}
                </Flex>

                {productType === "Rings" ? (
                  <div className="mt-10">
                    <RingComparison productData={productData} />
                  </div>
                ) : null}
              </motion.div>
            )}
          </GridCol>

          {/* RIGHT: Details panel */}
          <GridCol span={{ base: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            >
              <JewelryProductDetails
                path={path}
                productData={productData}
                selectedShape={selectedShape}
                onShapeChange={handleShapeChange}
                selectedImage={selectedImage}
                twoStoneRings={twoStoneRings}
                category={category}
              />
            </motion.div>
          </GridCol>
        </Grid>
      </Container>

      {/* ✅ JSON-LD Schema for SEO */}
      {productData && (
        <>
          <Script
            id="product-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                name: `${productData.title} - ${selectedShape}`,
                image: thumbnails.map((t) => t.url),
                description:
                  productData.description ||
                  `${productData.title} from B.V. Gems.`,
                sku: productData.id,
                brand: {
                  "@type": "Brand",
                  name: "B.V. Gems",
                },
                offers: {
                  "@type": "Offer",
                  url: `https://bvgems.com/jewelry-details/${category}/${product}/${stone}`,
                  priceCurrency: "USD",
                  price:
                    productData?.priceRange?.minVariantPrice?.amount || "0",
                  availability: "https://schema.org/InStock",
                },
              }),
            }}
          />

          <Script
            id="breadcrumb-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: breadcrumbItems.map((item, idx) => ({
                  "@type": "ListItem",
                  position: idx + 1,
                  name: item.title,
                  item: item.href
                    ? `https://bvgems.com${item.href}`
                    : `https://bvgems.com${path}`,
                })),
              }),
            }}
          />
        </>
      )}
    </>
  );
}
