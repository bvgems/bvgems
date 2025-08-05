"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Autocomplete,
  AutocompleteProps,
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Select,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconDiamond,
  IconHeart,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { AuthForm } from "../Auth/AuthForm";
import { addProductToCart } from "@/utils/commonFunctions";

import { GoldColorData } from "@/utils/constants";
import { JeweleryDetailsAccordion } from "./JeweleryDetailsTable";
import { getCartStore } from "@/store/useCartStore";

export const JewelryProductDetails = ({
  path,
  productData,
  selectedShape,
  onShapeChange,
  selectedImage,
  twoStoneRings,
}: any) => {
  console.log("proddd", productData);
  const { user } = useAuth();
  const segments = path?.split("/").filter(Boolean);
  const category = segments?.[1];
  const showShapeOptions = productData?.showshapeoptions?.value === "true";
  const isTwoStoneRing = productData?.isTwoStoneRing?.value === "true";
  const isRingCategory = category === "rings";
  const isEarringCategory = category === "earrings";
  const isNecklaces = category === "necklaces";
  const isBracelets = category === "bracelets";
  const isBead = category === "beads";

  const ringSizes = () => {
    if (!twoStoneRings && !showShapeOptions) {
      if (!productData?.variants?.edges?.length || !selectedGoldColor)
        return [];

      const sizeSet = new Set<string>();

      productData.variants.edges.forEach(({ node }: any) => {
        const [gold, size] = node.title.split(" / ");
        if (gold.trim() === selectedGoldColor.trim()) {
          sizeSet.add(`${size.trim()}`);
        }
      });

      return Array.from(sizeSet);
    } else {
      const ringSizes = Array.from({ length: 15 }, (_, i) =>
        (4 + i * 0.5).toFixed(2)
      );
      return ringSizes;
    }
  };

  const [selectedRingSize, setSelectedRingSize] = useState<any>();
  const [selectedNecklaceStoneSize, setSelectedNecklacesStoneSize] =
    useState<any>("2.0 MM");
  const [selectedBeadStoneSize, setSelectedBeadStoneSize] =
    useState<any>("2.0 MM");

  const [selectedNecklaceLength, setSelectedNecklaceLength] =
    useState<any>("16 INCH");

  const userKey = user?.id?.toString() || "guest";
  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);
  const [quantity, setQuantity] = useState<any>(1);
  const [selectedGoldColor, setSelectedGoldColor] = useState<any>();
  const [firstStone, setFirstStone] = useState(null);
  const [secondStone, setSecondStone] = useState(null);
  const [modalOpened, { open, close }] = useDisclosure(false);

  const addProduct = async () => {
    let variables;

    if (isRingCategory) {
      variables = {
        goldColor: selectedGoldColor,
        size: selectedRingSize,
        stone: isTwoStoneRing
          ? `${firstStone} - ${productData?.firstShape?.value} , ${secondStone} - ${productData?.secondShape?.value}`
          : selectedShape
          ? selectedShape
          : productData?.gemstone?.value,
        image: selectedImage,
      };
    } else if (isNecklaces) {
      variables = {
        goldColor: selectedGoldColor,
        size:
          productData?.showGoldColor?.value === "true"
            ? selectedNecklaceStoneSize
            : null,
        length:
          productData?.showGoldColor?.value === "true"
            ? selectedNecklaceLength
            : null,
      };
    } else if (isEarringCategory) {
      variables = {
        goldColor:
          productData?.showGoldColor?.value === "true" ? selectedGoldColor : "",
      };
    } else if (isBracelets) {
      variables = {
        goldColor: selectedGoldColor,
      };
    } else if (isBead) {
      variables = {
        size: selectedBeadStoneSize,
      };
    }
    addProductToCart(
      productData,
      quantity,
      addToCart,
      variables,
      isBead,
      isRingCategory,
      isNecklaces,
      isBracelets,
      isEarringCategory,
      firstStone,
      secondStone
    );
    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      message: "Jewelry product added to the cart!",
      position: "top-right",
      autoClose: 4000,
    });
  };

  useEffect(() => {
    if (!isNecklaces || !productData?.variants?.edges?.length) return;
    const firstVariant = productData.variants.edges[0]?.node;
    const parts = firstVariant?.title?.split(" / ");

    if (parts?.length === 3) {
      const [gold, stoneSize, length] = parts;
      if (!selectedGoldColor) setSelectedGoldColor(gold?.trim());
      if (!selectedNecklaceStoneSize)
        setSelectedNecklacesStoneSize(stoneSize?.trim());
      if (!selectedNecklaceLength) setSelectedNecklaceLength(length?.trim());
    }
  }, [productData, isNecklaces]);

  useEffect(() => {
    if (
      !isRingCategory ||
      isTwoStoneRing ||
      !productData?.variants?.edges?.length
    )
      return;

    const firstVariant = productData.variants.edges[0]?.node;
    const parts = firstVariant?.title?.split(" / ");
    if (parts?.length === 2) {
      const [gold, size] = parts;
      if (!selectedGoldColor) setSelectedGoldColor(gold?.trim());
      if (!selectedRingSize) setSelectedRingSize(size?.trim());
    }
  }, [productData, isRingCategory, isTwoStoneRing]);

  const getData = () => {
    if (isBead) {
      return (
        productData?.variants?.edges?.map((item: any) => item?.node?.title) ||
        []
      );
    } else if (isNecklaces) {
      const sizeSet = new Set<string>();
      productData?.variants?.edges?.forEach(({ node }: any) => {
        const parts = node?.title?.split(" / ");
        if (parts?.length === 3) sizeSet.add(parts[1].trim());
      });
      return Array.from(sizeSet);
    }
    return [];
  };

  const getLengthData = () => {
    const lengthSet = new Set<string>();
    productData?.variants?.edges?.forEach(({ node }: any) => {
      const parts = node?.title?.split(" / ");
      if (parts?.length === 3) lengthSet.add(parts[2].trim());
    });
    return Array.from(lengthSet);
  };

  const isDisabled = () => {
    if (isBead) {
      if (!selectedBeadStoneSize) {
        return true;
      }
      return false;
    }
    if (isEarringCategory) {
      if (productData?.showGoldColor?.value === "true" && !selectedGoldColor) {
        return true;
      } else {
        return false;
      }
    }
    if (isRingCategory && !selectedRingSize) return true;
    if (!selectedGoldColor) return true;

    if (
      productData?.showshapeoptions?.value === "true" &&
      twoStoneRings &&
      (!firstStone || !secondStone)
    )
      return true;

    if (
      productData?.showshapeoptions?.value === "true" &&
      !twoStoneRings &&
      !selectedShape
    )
      return true;

    return false;
  };

  const setStones = (val: any) => {
    const splitedStones = val?.split("/");
    setFirstStone(splitedStones[0]);
    setSecondStone(splitedStones[1]);
  };

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={close}
        overlayProps={{
          style: {
            backdropFilter: "blur(4px)",
          },
        }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        <AuthForm onClose={close} />
      </Modal>
      <div
        className={`mt-10 lg:mt-0 px-9 flex flex-col ${
          isBead ? "gap-2" : "gap-4"
        }`}
      >
        <h1 className="uppercase text-[1.5rem] sm:text-[2rem] leading-snug sm:leading-relaxed tracking-wide">
          {productData?.title}
        </h1>

        <div className="text-[1.3rem] sm:text-[1.9rem] text-gray-700 font-bold">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className="font-sans">
              {(() => {
                const getPrice = (title: string) => {
                  const variant = productData?.variants?.edges?.find(
                    (v: any) => v?.node?.title === title
                  );
                  return variant?.node?.price?.amount;
                };

                if (isBead) {
                  const price = getPrice(selectedBeadStoneSize);
                  return price
                    ? `$${Number(price).toFixed(2)} USD`
                    : "Select Size";
                }

                if (isNecklaces) {
                  const title = `${selectedGoldColor} / ${selectedNecklaceStoneSize} / ${selectedNecklaceLength}`;
                  const price = getPrice(title);
                  if (price) return `$${Number(price).toFixed(2)} USD`;

                  const fallback =
                    productData?.variants?.edges?.[0]?.node?.price?.amount;
                  return fallback
                    ? `$${Number(fallback).toFixed(2)} USD`
                    : "Unavailable";
                }

                if (isRingCategory) {
                  if (!isTwoStoneRing && !showShapeOptions) {
                    if (!selectedGoldColor || !selectedRingSize)
                      return "Select options";
                    const title = `${selectedGoldColor} / ${selectedRingSize.replace(
                      " mm",
                      ""
                    )}`;
                    const price = getPrice(title);
                    return price
                      ? `$${Number(price).toFixed(2)} USD`
                      : "Unavailable";
                  } else if (!isTwoStoneRing && showShapeOptions) {
                    return productData?.variants?.edges?.map((item: any) => {
                      if (item?.node?.title === selectedShape) {
                        return `$${Number(item?.node?.price?.amount).toFixed(
                          2
                        )} USD`;
                      }
                    });
                  } else if (isTwoStoneRing) {
                    const price = productData?.variants?.edges?.map(
                      (item: any) => {
                        if (
                          item?.node?.title === `${firstStone}/${secondStone}`
                        ) {
                          return `$${Number(item?.node?.price?.amount).toFixed(
                            2
                          )} USD`;
                        }
                      }
                    );
                    console.log("priiii", price);
                    if (price === undefined) {
                      return "Select Options";
                    } else {
                      return price;
                    }
                  }

                  const title = `${selectedGoldColor} / ${selectedRingSize}`;
                  const price = getPrice(title);
                  return price
                    ? `$${Number(price).toFixed(2)} USD`
                    : "Unavailable";
                }

                const price =
                  productData?.variants?.edges?.[0]?.node?.price?.amount;
                return `$${Number(price || 0).toFixed(2)} USD`;
              })()}
            </span>
          </div>
        </div>

        <Divider />
        {isEarringCategory && (
          <>
            {productData?.ct_weight?.value && (
              <span className="text-lg text-gray-500">
                Ct Weight: {productData.ct_weight.value}
              </span>
            )}
            {productData?.gemstone?.value && (
              <span className="text-lg text-gray-500">
                Gemstone: {productData.gemstone.value}
              </span>
            )}
          </>
        )}

        <p className="text-lg mt-2 pb-1.5">{productData?.description}</p>

        {isRingCategory ? (
          <JeweleryDetailsAccordion productData={productData} />
        ) : null}
        {isBead ? <p>Straight Size</p> : null}
        {isEarringCategory ? (
          <>
            <NumberInput
              className="flex-1"
              label="Quantity"
              min={1}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
              allowNegative={false}
              radius={0}
              styles={{
                input: {
                  padding: "22px 15px",
                  backgroundColor: "#dbdddf",
                },
              }}
            />
            {productData?.showGoldColor ? (
              productData?.showGoldColor?.value === "true" ? (
                <Autocomplete
                  clearable
                  data={GoldColorData.map((item) => item.value)}
                  value={selectedGoldColor}
                  onChange={setSelectedGoldColor}
                  renderOption={({ option }) => {
                    const matched = GoldColorData.find(
                      (color) => color.value === option.value
                    );
                    return (
                      <Group gap="sm">
                        <span
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: matched?.color }}
                        ></span>
                        <Text size="sm">{option.value}</Text>
                      </Group>
                    );
                  }}
                  maxDropdownHeight={300}
                  label="Select Gold Color"
                  placeholder="Gold Color"
                />
              ) : null
            ) : null}
          </>
        ) : isNecklaces ? (
          <>
            <Autocomplete
              clearable
              data={GoldColorData.map((item) => item.value)}
              value={selectedGoldColor}
              onChange={setSelectedGoldColor}
              renderOption={({ option }) => {
                const matched = GoldColorData.find(
                  (color) => color.value === option.value
                );
                return (
                  <Group gap="sm">
                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: matched?.color }}
                    ></span>
                    <Text size="sm">{option.value}</Text>
                  </Group>
                );
              }}
              maxDropdownHeight={300}
              label="Select Gold Color"
              placeholder="Gold Color"
            />

            {productData?.showGoldColor ? (
              <>
                <Select
                  className="flex-1"
                  leftSection={<IconDiamond size={20} />}
                  label={`Select Stone Size`}
                  placeholder={`${"Stone Size"}`}
                  data={getData()}
                  value={selectedNecklaceStoneSize}
                  onChange={setSelectedNecklacesStoneSize}
                  styles={{
                    input: {
                      padding: "22px 35px",
                      backgroundColor: "#dbdddf",
                    },
                  }}
                />
                <Select
                  className="flex-1"
                  leftSection={<IconDiamond size={20} />}
                  label={`Select Length`}
                  placeholder={`${"Length of Necklace"}`}
                  data={getLengthData()}
                  value={selectedNecklaceLength}
                  onChange={setSelectedNecklaceLength}
                  styles={{
                    input: {
                      padding: "22px 35px",
                      backgroundColor: "#dbdddf",
                    },
                  }}
                />
              </>
            ) : null}
          </>
        ) : (
          <div className="flex gap-4 w-full">
            {isBead ? (
              <Select
                className="flex-1"
                leftSection={<IconDiamond size={20} />}
                label="Select Stone Size"
                placeholder="Stone Size"
                data={getData()}
                value={selectedBeadStoneSize}
                onChange={setSelectedBeadStoneSize}
                styles={{
                  input: {
                    padding: "22px 35px",
                    backgroundColor: "#dbdddf",
                  },
                }}
              />
            ) : (
              <Autocomplete
                className="flex-1"
                leftSection={<IconDiamond size={20} />}
                label="Select Gold Color"
                placeholder="Gold Color"
                clearable
                data={GoldColorData.map((item) => item.value)}
                value={selectedGoldColor}
                onChange={setSelectedGoldColor}
                renderOption={({ option }) => {
                  const matched = GoldColorData.find(
                    (c) => c.value === option.value
                  );
                  return (
                    <Group gap="sm">
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: matched?.color }}
                      />
                      <Text size="sm">{option.value}</Text>
                    </Group>
                  );
                }}
                styles={{
                  input: {
                    padding: "22px 35px",
                    backgroundColor: "#dbdddf",
                  },
                }}
              />
            )}

            <NumberInput
              className="flex-1"
              label="Quantity"
              min={1}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
              allowNegative={false}
              radius={0}
              styles={{
                input: {
                  padding: "22px 15px",
                  backgroundColor: "#dbdddf",
                },
              }}
            />
          </div>
        )}

        {isRingCategory ? (
          <div>
            <Autocomplete
              className="flex-1"
              clearable
              leftSection={<IconDiamond size={20} />}
              label="Select Ring Size (mm)"
              placeholder="Ring size"
              data={ringSizes()}
              value={selectedRingSize}
              onChange={setSelectedRingSize}
              styles={{
                input: {
                  padding: "22px 35px",
                  backgroundColor: "#dbdddf",
                },
              }}
            />
          </div>
        ) : null}

        {productData?.showshapeoptions?.value === "true" ? (
          twoStoneRings ? (
            <div className="flex flex-col gap-3">
              <Autocomplete
                clearable
                className="flex-1"
                leftSection={<IconDiamond size={20} />}
                label={`Select Stones For ${productData?.firstShape?.value} / ${productData?.secondShape?.value} shape`}
                placeholder={`${productData?.firstShape?.value} / ${productData?.secondShape?.value}`}
                data={productData?.variants?.edges?.map(
                  (v: any) => v?.node?.title
                )}
                onChange={(val: any) => setStones(val)}
                styles={{
                  input: {
                    padding: "22px 35px",
                    backgroundColor: "#dbdddf",
                  },
                }}
              />
            </div>
          ) : (
            <div>
              <Select
                className="flex-1"
                leftSection={<IconDiamond size={20} />}
                label="Select Shape"
                placeholder="Shape"
                data={productData?.variants?.edges?.map(
                  (v: any) => v?.node?.title
                )}
                value={selectedShape}
                onChange={onShapeChange}
                styles={{
                  input: {
                    padding: "22px 35px",
                    backgroundColor: "#dbdddf",
                  },
                }}
              />
            </div>
          )
        ) : null}
        <div className="mt-3 flex flex-col gap-2">
          <Button
            disabled={isDisabled()}
            color="#0b182d"
            onClick={addProduct}
            fullWidth
          >
            ADD TO CART
          </Button>
          {/* {user ? (
            <Button color="#0b182d" onClick={addProduct} fullWidth>
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
          )} */}
        </div>

        <div className="flex items-center justify-end text-gray-500">
          <IconTruckDelivery size={20} />
          <span className="ml-1.5">Estimated delivery: 4 Days</span>
        </div>
      </div>
    </>
  );
};
