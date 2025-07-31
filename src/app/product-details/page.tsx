"use client";

import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Image,
  Modal,
  NumberInput,
  NumberInputHandlers,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getCategoryData,
  getParticularProductsData,
  getShapesData,
} from "@/apis/api";
import { ProductSpecifications } from "@/components/ProductDetails/ProductSpecifications";
import {
  IconCalendarCheck,
  IconCheck,
  IconHeart,
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

export default function ProductDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [product, setProduct] = useState<any>();
  const [shopifyProduct, setShopifyProduct] = useState<any>();
  const [allProducts, setAllProducts] = useState<any>();
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const handlersRef = useRef<NumberInputHandlers>(null);
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";
  const [modalOpened, { open, close }] = useDisclosure(false);
  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);

  const [tableOpened, { open: openTable, close: closeTable }] =
    useDisclosure(false);

  const getProduct = async (id: string) => {
    const productDetails = await getParticularProductsData(id);

    setProduct(productDetails);
    setPrice(productDetails?.price);

    const allDetails = await getShapesData(
      productDetails?.shape,
      productDetails?.collection_slug
    );
    setAllProducts(allDetails?.data);
  };

  const getData = async (handle: any) => {
    const response = await getCategoryData(handle);
    setShopifyProduct(response);
  };

  const addProductToCart = () => {
    if (!product) return;

    addToCart({
      product: {
        productType: "stone",
        productId: product.id,
        collection_slug: product.collection_slug,
        color: product.color,
        ct_weight: product.ct_weight,
        cut: product.cut,
        image_url: product.image_url,
        price: product.price,
        quality: product.quality,
        shape: product.shape,
        size: product.size,
        type: product.type,
      },
      quantity: quantity,
    });

    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      message: "Product Added To The Cart!",
      position: "top-right",
      autoClose: 4000,
    });
  };

  const handleQuantityChanges = (value: number) => {
    setQuantity(value);
    setPrice(value * product?.price);
  };

  useEffect(() => {
    if (id) {
      getProduct(id);
    }
    if (name) {
      getData(name);
    }
  }, [id]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 px-5 mt-6">
        <div className="w-full md:w-2/3 pr-2">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-1">
              <div className="w-full md:w-7/12 flex flex-col items-center">
                <ImageZoom src={product?.image_url} />
                <div className="text-xs text-gray-400 flex items-center">
                  <IconZoomIn size="15" />
                  Hover on the image to zoom
                </div>
                <div className="text-xs text-gray-400 mt-4 flex items-center">
                  <Button
                    onClick={openTable}
                    variant="outline"
                    size="compact-xs"
                    color="violet"
                  >
                    <span>Size Tolerance Guide</span>
                  </Button>
                </div>
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

        <div className="w-full md:w-1/3">
          <div className="sticky top-5">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl">
                  {product?.collection_slug +
                    " " +
                    product?.shape +
                    " " +
                    product?.size +
                    "mm" +
                    " " +
                    product?.ct_weight +
                    "cts. " +
                    "," +
                    " " +
                    product?.quality +
                    " Quality"}
                </h1>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {"Item: #" + product?.id}
                  </span>
                  <Badge color="#37B24D" radius="xs">
                    Available
                  </Badge>
                </div>
                <div className="text-2xl font-semibold">
                  $ {(Number(price) || 0).toFixed(2)}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div>Quantity:</div>
                <Button
                  onClick={() => handlersRef.current?.increment()}
                  variant="default"
                >
                  <IconPlus />
                </Button>
                <NumberInput
                  placeholder="Click the buttons"
                  handlersRef={handlersRef}
                  min={1}
                  value={quantity}
                  onChange={(value: any) => handleQuantityChanges(value)}
                />
                <Button
                  onClick={() => handlersRef.current?.decrement()}
                  variant="default"
                >
                  <IconMinus />
                </Button>
              </div>

              <Checkbox label="Match For Size and Color" color="#0b182d" />

              <Alert
                variant="light"
                color="#0b182d"
                title="Request a Visit"
                icon={<IconCalendarCheck />}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col text-sm">
                    <Text size="md">View Gemstone In Person</Text>
                    <Text size="sm" c="dimmed">
                      Your satisfaction is our priority — let us help you find
                      the perfect stone in person.
                    </Text>
                  </div>
                  <Button color="#99a1af" size="xs" className="self-start">
                    Request
                  </Button>
                </div>
              </Alert>

              <Textarea
                placeholder="Write your instructions here"
                label={
                  <div className="flex items-center gap-1 mb-1">
                    <div>Special Instructions</div>
                    <Tooltip
                      multiline
                      w={220}
                      withArrow
                      transitionProps={{ duration: 200 }}
                      label="Use this box to share any special instructions for your order, like stone sizes or if you want the stones to match with others in your order."
                    >
                      <span className="cursor-pointer">
                        <IconInfoCircle size={16} />
                      </span>
                    </Tooltip>
                  </div>
                }
                autosize
                minRows={2}
              />

              <ProductAccordion />

              {user ? (
                <Button color="#0b182d" onClick={addProductToCart} fullWidth>
                  ADD TO CART
                </Button>
              ) : (
                <Button
                  color="#0b182d"
                  onClick={(e) => {
                    e.stopPropagation();
                    open();
                  }}
                  fullWidth
                >
                  SIGN IN TO ORDER
                </Button>
              )}

              <Button
                leftSection={<IconHeart />}
                className="mt-3"
                color="#99a1af"
                variant="outline"
                fullWidth
              >
                Add To Favorites
              </Button>
            </div>
          </div>
        </div>
        <SizeToleranceGuide opened={tableOpened} close={closeTable} />
      </div>
    </>
  );
}
