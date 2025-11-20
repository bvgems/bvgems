"use client";

import {
  Alert,
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  Modal,
  Switch,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getCategoryData,
  getParticularProductsData,
  getShapesData,
} from "@/apis/api";
import { ProductSpecifications } from "@/components/ProductDetails/ProductSpecifications";
import { IconCheck, IconZoomIn, IconShare } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { SizeToleranceGuide } from "@/components/Tolerance/SizeToleranceGuide";
import { getCartStore } from "@/store/useCartStore";
import { notifications } from "@mantine/notifications";
import { useAuth } from "@/hooks/useAuth";
import { ImageZoom } from "@/components/CommonComponents/ImageZoom";
import { AuthForm } from "@/components/Auth/AuthForm";
import { GemstonesInputSection } from "../CommonComponents/GemstonesInputSection";
import { EmeraldShade } from "../CommonComponents/EmeraldShade";
import { QuestionAndDeliveryAccordian } from "../CommonComponents/QuestionAndDeliveryAccordian";
import Script from "next/script";

import jsPDF from "jspdf";

/** ---------- Helpers ---------- */
const LAB_LABELS = new Set(["Lab Grown", "Lab-Grown"]);

const isLabGrown = (item: any) =>
  LAB_LABELS.has(item?.type) || LAB_LABELS.has(item?.quality);

const getPerCaratPrice = (item: any): number => {
  if (!item) return 0;
  if (isLabGrown(item)) {
    if (item?.collection_slug === "Alexandrite") {
      return 85;
    }
  }
  if (!item?.ct_weight || !item?.price) return 0;
  return Number((item.price / item.ct_weight).toFixed(2));
};

const getPerStonePrice = (item: any): number => {
  if (!item) return 0;
  if (!item?.ct_weight) return 0;
  if (isLabGrown(item)) {
    if (item?.collection_slug === "Alexandrite") {
      return Number((85 * item.ct_weight).toFixed(2));
    } else {
      return Number((50 * item.ct_weight).toFixed(2));
    }
  }
  return item?.price ? Number(item.price) : 0;
};

export default function ProductDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [modalOpened, { open, close }] = useDisclosure(false);

  const [product, setProduct] = useState<any>();
  const [displayImage, setDisplayImage] = useState<any>();
  const [shopifyProduct, setShopifyProduct] = useState<any>();
  const [allProducts, setAllProducts] = useState<any>();
  const [quantity, setQuantity] = useState<number>(1);
  const [caratError, setCaratError] = useState<string | null>(null);
  const [emeraldShade, setEmeraldShade] = useState<string | null>("Zambian");
  const [description, setDescription] = useState("");

  const [caratWeight, setCaratWeight] = useState<number>(0);
  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: "Calibrated Faceted Gemstones", href: "/loose-gemstones" },
    {
      title: product?.collection_slug,
      href: `/calibrated-faceted-gemstones/${name}`,
    },
  ].map((item, index) => (
    <Anchor
      href={item.href}
      key={index}
      className="text-gray-600 hover:text-black"
    >
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    if (product?.ct_weight) {
      setCaratWeight(product.ct_weight);
    }
  }, [product]);

  const [price, setPrice] = useState<number>(0);
  const [purchaseByCarat, setPurchaseByCarat] = useState<boolean>(false);
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";

  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);
  const router = useRouter();

  const [tableOpened, { open: openTable, close: closeTable }] =
    useDisclosure(false);

  // 📌 Ref to capture page content for PDF
  const pageRef = useRef<HTMLDivElement>(null);

  const recalcTotal = (item: any, qty: number, ctw?: number) => {
    if (!item) return;
    if (purchaseByCarat && ctw) {
      const perCarat = getPerCaratPrice(item);
      setPrice(Number((perCarat * ctw).toFixed(2)));
    } else {
      const perStone = getPerStonePrice(item);
      setPrice(Number((perStone * (qty || 1)).toFixed(2)));
    }
  };

  const getProduct = async (pid: string) => {
    const productDetails = await getParticularProductsData(pid);

    setProduct(productDetails);
    setDescription(
      `This ${productDetails?.collection_slug?.toLowerCase()} gemstone is carefully cut and calibrated for precision. Perfect for fine jewelry designs such as engagement rings, necklaces, and earrings, our gemstones are ethically sourced and graded for brilliance and clarity. Located in NYC’s Diamond District, B.V. Gems provides jewelers and collectors with trusted quality stones for generations.`
    );

    const allDetails = await getShapesData(
      productDetails?.shape,
      productDetails?.collection_slug
    );
    setAllProducts(allDetails?.data);

    recalcTotal(productDetails, quantity, caratWeight);
  };

  const getData = async (handle: any) => {
    const response = await getCategoryData(handle);
    setShopifyProduct(response);
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
        shade: emeraldShade || "",
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
  };

  const [isSharing, setIsSharing] = useState(false);

  const handleShareAsPDF = async () => {
    if (!product || isSharing) return; // prevent double trigger
    setIsSharing(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      // ---------------------------
      // 1. Add Image at Top Center
      // ---------------------------
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

          const imgWidth = 60;
          const imgHeight = 60;
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

      let y = 85; // below image

      // ---------------------------
      // 2. Title (Centered)
      // ---------------------------
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text(
        `Loose ${product?.collection_slug} ${product?.shape} ${product?.size}`,
        pageWidth / 2,
        y,
        { align: "center" }
      );
      y += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text(
        `${product?.ct_weight} Carat ${product?.quality} Quality Calibrated Gemstone`,
        pageWidth / 2,
        y,
        { align: "center" }
      );

      y += 15;

      // ---------------------------
      // 3. Two Column Section
      // ---------------------------
      const leftX = 20;
      const rightX = pageWidth / 2 + 5;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      // Left column - product details
      let leftY = y;
      pdf.text(`Item ID: ${product?.id}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Stone: ${product?.collection_slug}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Shape: ${product?.shape}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Size: ${product?.size}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Color: ${product?.color}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Cut: ${product?.cut}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Quality: ${product?.quality}`, leftX, leftY);
      leftY += 6;
      pdf.text(`Carat Weight: ${product?.ct_weight}`, leftX, leftY);

      // Right column - pricing
      let rightY = y;
      pdf.setFont("helvetica", "bold");
      pdf.text("Pricing:", rightX, rightY);
      rightY += 7;

      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Per Stone Price: $${getPerStonePrice(product).toFixed(2)}`,
        rightX,
        rightY
      );
      rightY += 6;
      pdf.text(
        `Per Carat Price: $${getPerCaratPrice(product).toFixed(2)}`,
        rightX,
        rightY
      );

      // ---------------------------
      // 4. Description (Full Width)
      // ---------------------------
      let descY = Math.max(leftY, rightY) + 15;

      pdf.setFont("helvetica", "bold");
      pdf.text("Description:", 20, descY);
      descY += 7;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const desc =
        `This ${product?.collection_slug?.toLowerCase()} gemstone is carefully cut and calibrated for precision. ` +
        `Perfect for fine jewelry designs such as engagement rings, necklaces, and earrings. ` +
        `Ethically sourced and graded for brilliance and clarity.`;
      const wrapped = pdf.splitTextToSize(desc, pageWidth - 40);
      pdf.text(wrapped, 20, descY);

      // ---------------------------
      // 5. Footer (Brand Info)
      // ---------------------------
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(100);

      // Export
      const pdfBlob = pdf.output("blob");

      if (
        navigator.share &&
        navigator.canShare?.({
          files: [
            new File([pdfBlob], "product-details.pdf", {
              type: "application/pdf",
            }),
          ],
        })
      ) {
        const file = new File(
          [pdfBlob],
          `${product?.size}_${product?.collection_slug}_${product?.ct_weight}_Details.pdf`,
          {
            type: "application/pdf",
          }
        );
        await navigator.share({
          title: `${product?.size} ${product?.collection_slug} ${product?.ct_weight} Details`,
          files: [file],
        });
      } else {
        pdf.save(
          `${product?.size}_${product?.collection_slug}_${product?.ct_weight}_Details.pdf`
        );
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      // release lock whether success or fail
      setIsSharing(false);
    }
  };

  useEffect(() => {
    if (id) getProduct(id);
    if (name) getData(name);
  }, [id]);

  useEffect(() => {
    setDisplayImage(
      product?.extra_images?.length > 0
        ? product?.extra_images[0]
        : product?.image_url
    );
  }, [product]);

  useEffect(() => {
    if (product) recalcTotal(product, quantity, caratWeight);
  }, [product, purchaseByCarat]);

  const hasPricing = !(
    getPerStonePrice(product) === 0 &&
    getPerCaratPrice(product) === 0 &&
    price === 0
  );

  return (
    <div ref={pageRef} className="flex flex-col md:flex-row gap-6 px-5 mt-6">
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
        <Breadcrumbs separator="›" className="mb-4">
          {breadcrumbItems}
        </Breadcrumbs>
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
                alt={`${product?.collection_slug} ${product?.shape} ${product?.size} gemstone – ${product?.quality} Quality`}
                src={displayImage}
              />
              <div className="text-xs text-gray-500 flex items-center mt-2">
                <IconZoomIn size={15} className="mr-1" />
                Hover on the image to zoom
              </div>
              <Button
                onClick={openTable}
                variant="outline"
                size="compact-xs"
                className="mt-4"
                color="#0b182d"
              >
                SIZE TOLERANCE GUIDE
              </Button>
            </div>
            <div className="w-full md:w-5/12">
              <ProductSpecifications
                getProduct={getProduct}
                product={product}
                allProducts={allProducts}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Pricing and actions */}
      <div className="w-full md:w-1/3 pb-9">
        <div className="sticky top-5">
          <div className="flex flex-col gap-4">
            {/* 🔹 Share Button */}

            {/* Title */}
            <div>
              <h1 className="text-xl font-semibold">
                Loose {product?.collection_slug} {product?.shape}{" "}
                {product?.size} – {product?.ct_weight} Carat {product?.quality}{" "}
                Quality Calibrated Gemstone
              </h1>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  Item: #{product?.id}
                </span>
                <Badge
                  color={product?.type === "Natural" ? "#37B24D" : "blue"}
                  radius="xs"
                >
                  {product?.type}
                </Badge>
              </div>
            </div>

            {/* Price section */}
            {user ? (
              <div className="mt-2">
                <div className="text-md font-medium flex flex-col gap-2">
                  <span>
                    Per Stone Price:{" "}
                    <strong>
                      {getPerStonePrice(product) === 0
                        ? "-"
                        : `$${getPerStonePrice(product).toFixed(2)}`}
                    </strong>
                  </span>
                  <span>
                    Per Carat Price:{" "}
                    <strong>
                      {getPerCaratPrice(product) === 0
                        ? "-"
                        : `$${getPerCaratPrice(product).toFixed(2)}`}
                    </strong>
                  </span>
                </div>

                {!hasPricing && (
                  <a
                    href={`mailto:sales@bvgems.com?subject=${encodeURIComponent(
                      `Price Request for ${product?.collection_slug} ${product?.shape} ${product?.size} ${product?.ct_weight}cts., ${product?.quality} Quality`
                    )}&body=${encodeURIComponent(
                      `Hello,\n\nI would like to request the price for the following gemstone:\n\nGemstone: ${product?.collection_slug}\nShape: ${product?.shape}\nSize: ${product?.size}\nCarat Weight: ${product?.ct_weight} cts\nQuality: ${product?.quality}\n\nPlease let me know the pricing and availability.\n\nThank you!`
                    )}`}
                    className="underline text-blue-600"
                  >
                    Request Pricing
                  </a>
                )}
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

            {/* Input section */}
            {user && (
              <GemstonesInputSection
                purchaseByCarat={purchaseByCarat}
                caratWeight={caratWeight}
                product={product}
                quantity={quantity}
                setQuantity={setQuantity}
                caratError={caratError}
                recalcTotal={recalcTotal}
                setCaratError={setCaratError}
                setCaratWeight={setCaratWeight}
              />
            )}

            {/* ✅ Emerald Lab shade buttons */}
            {user &&
              product?.collection_slug === "Emerald" &&
              isLabGrown(product) && (
                <EmeraldShade
                  product={product}
                  emeraldShade={emeraldShade}
                  setEmeraldShade={setEmeraldShade}
                  setDisplayImage={setDisplayImage}
                />
              )}

            {user && (
              <Checkbox label="Match For Size and Color" color="#0b182d" />
            )}
            {user && (
              <Button color="#0b182d" onClick={addProductToCart} fullWidth>
                ADD TO CART
              </Button>
            )}
            <QuestionAndDeliveryAccordian description={description} />
          </div>
        </div>
      </div>
      <SizeToleranceGuide opened={tableOpened} close={closeTable} />
      {product && (
        <Script
          id="product-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: `Loose ${product?.collection_slug} ${product?.shape} ${product?.size}`,
              image: product?.image_url,
              description: `${product?.quality} quality ${product?.collection_slug} gemstone, calibrated and ethically sourced from B.V. Gems, NYC Diamond District.`,
              sku: product?.id,
              brand: { "@type": "Brand", name: "B.V. Gems" },
              offers: {
                "@type": "Offer",
                url: `https://bvgems.com/product?id=${product?.id}&name=${product?.collection_slug}`,
                priceCurrency: "USD",
                price: getPerStonePrice(product) || getPerCaratPrice(product),
                availability: "http://schema.org/InStock",
              },
            }),
          }}
        />
      )}
    </div>
  );
}
