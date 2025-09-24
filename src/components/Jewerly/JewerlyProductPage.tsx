"use client";

import { fetchProductByHandle } from "@/apis/api";
import {
  Anchor,
  Breadcrumbs,
  Card,
  Container,
  Grid,
  GridCol,
  Image,
} from "@mantine/core";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Script from "next/script";
import type { Metadata } from "next";
import { RingComparison } from "./RingComparison";
import { JewelryProductDetails } from "@/components/Jewerly/JewerlyProductDetails";
import { useMediaQuery } from "@mantine/hooks";

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
      type: "website",
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
  const [images, setImages] = useState<Thumb[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [twoStoneRings, setTwoStoneRings] = useState<boolean>(false);
  const [productType, setProductType] = useState<string | undefined>();
  const [mainImage, setMainImage] = useState<string | null>(null);

  const isMobile = useMediaQuery("(max-width: 800px)");

  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: capitalize(category), href: `/jewelry/${category}` },
    { title: capitalize(stone), href: undefined as any },
  ];

  useEffect(() => {
    const getProductByHandle = async () => {
      if (!product) return;

      const response = await fetchProductByHandle(product as string);
      const productInfo = response?.product;
      if (!productInfo) return;

      const isTwoStoneRing = productInfo?.isTwoStoneRing?.value === "true";
      setTwoStoneRings(isTwoStoneRing);
      setProductType(productInfo?.productType);
      setProductData(productInfo);

      // Base image list
      let imgs: Thumb[] =
        productInfo?.images?.edges?.map((e: any) => ({
          url: e?.node?.url,
          title: null,
        })) ?? [];

      const variantImgs =
        productInfo?.variants?.edges
          ?.map((v: any) => ({
            url: v?.node?.image?.url,
            title: v?.node?.title,
          }))
          .filter((t: Thumb) => !!t.url) ?? [];

      imgs = [...imgs, ...variantImgs].filter(
        (v, i, arr) => arr.findIndex((x) => x.url === v.url) === i
      );

      // Always extract the last image (keep aside for 2nd position)
      let lastImage: Thumb | undefined;
      if (imgs.length > 1) {
        lastImage = imgs[imgs.length - 1];
        imgs = imgs.slice(0, -1);
      }

      // Handle variant selection
      const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, "-");
      const variantEdges = productInfo?.variants?.edges ?? [];
      if (stone && variantEdges?.length) {
        const match = variantEdges.find(
          (v: any) => slugify(v?.node?.title || "") === stone.toLowerCase()
        );
        if (match?.node) {
          setSelectedShape(match.node.title);

          if (match.node.image?.url) {
            const variantImgUrl = match.node.image.url;
            imgs = [
              { url: variantImgUrl, title: match.node.title },
              ...imgs.filter((img) => img.url !== variantImgUrl),
            ];
          }
        }
      }

      // Reinsert last image always at index 1
      if (lastImage) {
        imgs.splice(1, 0, lastImage);
      }

      // Update state
      setImages(imgs);
      setMainImage(imgs[0]?.url || null);
    };

    getProductByHandle();
  }, [product, stone]);

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

      <div className="mx-6 pb-14">
        <Grid gutter="xl" align="flex-start">
          {/* LEFT: Images */}
          <GridCol span={{ base: 12, md: 8 }}>
            {productData && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {!isMobile ? (
                  // ✅ Desktop: Grid layout
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "16px",
                    }}
                  >
                    {images.map((thumb, idx) => (
                      <Card
                        key={`${thumb.url}-${idx}`}
                        radius="0"
                        shadow="0"
                        padding={0}
                        withBorder
                        style={{
                          aspectRatio: "1 / 1",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          src={thumb.url}
                          alt={`${productData?.title} - ${
                            thumb.title || `Image ${idx + 1}`
                          }`}
                          fit="contain"
                          width="100%"
                          height="100%"
                          style={{ objectFit: "contain", padding: "6px" }}
                        />
                      </Card>
                    ))}
                  </div>
                ) : (
                  // ✅ Mobile: main image + thumbnails
                  <div>
                    {mainImage && (
                      <Card
                        radius="0"
                        shadow="0"
                        padding={0}
                        withBorder
                        style={{
                          width: "100%",
                          height: "420px",
                          marginBottom: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          src={mainImage}
                          alt={`${productData?.title} - Main`}
                          fit="fill"
                          width="100%"
                          height="100%"
                        />
                      </Card>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {images.map((thumb, idx) => (
                        <Card
                          key={`${thumb.url}-${idx}`}
                          radius="0"
                          shadow="0"
                          padding={0}
                          withBorder
                          onClick={() => setMainImage(thumb.url)}
                          style={{
                            width: "70px",
                            height: "70px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border:
                              thumb.url === mainImage
                                ? "2px solid #000"
                                : "1px solid #ddd",
                          }}
                        >
                          <Image
                            src={thumb.url}
                            alt={`${productData?.title} - Thumb ${idx + 1}`}
                            fit="contain"
                            width="100%"
                            height="100%"
                            style={{ objectFit: "contain", padding: "4px" }}
                          />
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {productType === "Rings" ? (
                  <div className="mt-10">
                    <RingComparison productData={productData} />
                  </div>
                ) : null}
              </motion.div>
            )}
          </GridCol>

          {/* RIGHT: Details */}
          <GridCol span={{ base: 12, md: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            >
              <JewelryProductDetails
                path={path}
                productData={productData}
                selectedShape={selectedShape}
                onShapeChange={() => {}}
                selectedImage={mainImage || images[0]?.url}
                twoStoneRings={twoStoneRings}
                category={category}
              />
            </motion.div>
          </GridCol>
        </Grid>
      </div>

      {/* ✅ JSON-LD */}
      {productData && (
        <>
          <Script
            id="product-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                name: `${productData.title}`,
                image: images.map((t) => t.url),
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
