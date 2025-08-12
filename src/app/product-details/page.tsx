"use client";

import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Modal,
  NumberInput,
  NumberInputHandlers,
  Switch,
  Text,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getCategoryData,
  getParticularProductsData,
  getShapesData,
} from "@/apis/api";
import { ProductSpecifications } from "@/components/ProductDetails/ProductSpecifications";
import {
  IconCheck,
  IconInfoCircle,
  IconMinus,
  IconPlus,
  IconZoomIn,
} from "@tabler/icons-react";
import { ProductAccordion } from "@/components/ProductDetails/ProductAccordion";
import { useDisclosure } from "@mantine/hooks";
import { SizeToleranceGuide } from "@/components/Tolerance/SizeToleranceGuide";
import { getCartStore } from "@/store/useCartStore";
import { notifications } from "@mantine/notifications";
import { useAuth } from "@/hooks/useAuth";
import { ImageZoom } from "@/components/CommonComponents/ImageZoom";
import { AuthForm } from "@/components/Auth/AuthForm";

/** ---------- Helpers ---------- */
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

export default function ProductDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [modalOpened, { open, close }] = useDisclosure(false);

  const [product, setProduct] = useState<any>();
  const [shopifyProduct, setShopifyProduct] = useState<any>();
  const [allProducts, setAllProducts] = useState<any>();
  const [quantity, setQuantity] = useState<number>(1);
  const [caratWeight, setCaratWeight] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [purchaseByCarat, setPurchaseByCarat] = useState<boolean>(false);
  const handlersRef = useRef<NumberInputHandlers>(null);
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";

  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);
  const router = useRouter();

  const [tableOpened, { open: openTable, close: closeTable }] =
    useDisclosure(false);

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

  const handleQuantityChanges = (value: number) => {
    const qty = Math.max(1, Number(value) || 1);
    setQuantity(qty);
    recalcTotal(product, qty, caratWeight);
  };

  const handleCaratWeightChanges = (value: number) => {
    const ctw = Math.max(0.01, Number(value) || 0.01);
    setCaratWeight(ctw);
    recalcTotal(product, quantity, ctw);
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

  useEffect(() => {
    if (id) getProduct(id);
    if (name) getData(name);
  }, [id]);

  useEffect(() => {
    if (product) recalcTotal(product, quantity, caratWeight);
  }, [product, purchaseByCarat]);

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
                    Per Stone Price:{" "}
                    <strong>${getPerStonePrice(product).toFixed(2)}</strong>
                  </span>
                  <span>
                    Per Carat Price:{" "}
                    <strong>${getPerCaratPrice(product).toFixed(2)}</strong>
                  </span>
                  <span className="text-lg font-semibold">
                    Total: ${price.toFixed(2)}
                  </span>
                </div>
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
              />
            )}

            {/* Input section changes based on mode */}
            {user &&
              (purchaseByCarat ? (
                <div className="flex items-center justify-between gap-2">
                  <div>Carat Weight:</div>
                  <NumberInput
                    value={caratWeight}
                    onChange={(value: any) => handleCaratWeightChanges(value)}
                    min={0.01}
                    step={0.01}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div>Quantity:</div>
                  <Button
                    onClick={() => handlersRef.current?.decrement()}
                    variant="default"
                  >
                    <IconMinus />
                  </Button>
                  <NumberInput
                    value={quantity}
                    onChange={(value: any) => handleQuantityChanges(value)}
                    handlersRef={handlersRef}
                    min={1}
                    hideControls
                  />
                  <Button
                    onClick={() => handlersRef.current?.increment()}
                    variant="default"
                  >
                    <IconPlus />
                  </Button>
                </div>
              ))}

            {/* Match checkbox */}
            {user && (
              <Checkbox label="Match For Size and Color" color="#0b182d" />
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
      <SizeToleranceGuide opened={tableOpened} close={closeTable} />
    </div>
  );
}
