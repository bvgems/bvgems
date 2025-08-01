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
import { useState } from "react";
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

  const ringSizes = Array.from({ length: 15 }, (_, i) =>
    (4 + i * 0.5).toFixed(2)
  );

  const [selectedRingSize, setSelectedRingSize] = useState<string | null>(
    ringSizes[0]
  );
  const [selectedNecklaceStoneSize, setSelectedNecklacesStoneSize] =
    useState<any>("2.00 MM");
  const [selectedBeadStoneSize, setSelectedBeadStoneSize] =
    useState<any>("2.00");

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

  const getData = () => {
    const sizeArray = ["2.00", "2.50", "3.00", "3.50", "4.00", "4.50", "5.00"];
    return sizeArray;
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
              $
              {Number(
                productData?.variants?.edges?.[0]?.node?.price?.amount || 0
              ).toFixed(2)}{" "}
              {productData?.variants?.edges?.[0]?.node?.price?.currencyCode ||
                "USD"}
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
        {isBead}
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
                  data={["2.00 MM", "3.00 MM", "4.00 MM"]}
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
                  data={["16 INCH", "18 INCH", "20 INCH", "22 INCH"]}
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
                data={getData()} // string[]
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
            <Select
              className="flex-1"
              leftSection={<IconDiamond size={20} />}
              label="Select Ring Size (mm)"
              placeholder="Ring size"
              data={ringSizes}
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
              <Select
                className="flex-1"
                leftSection={<IconDiamond size={20} />}
                label={`Select Stone For ${productData?.firstShape?.value} shape`}
                placeholder="Select stone"
                data={productData?.variants?.edges?.map(
                  (v: any) => v?.node?.title
                )}
                value={firstStone}
                onChange={(val: any) => setFirstStone(val)}
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
                label={`Select Stone For ${productData?.secondShape?.value} shape`}
                placeholder="Select stone"
                data={productData?.variants?.edges?.map(
                  (v: any) => v?.node?.title
                )}
                value={secondStone}
                onChange={(val: any) => setSecondStone(val)}
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

          <Button
            leftSection={<IconHeart />}
            className="mt-3"
            color="#0b182d"
            variant="outline"
            fullWidth
          >
            ADD TO FAVORITES
          </Button>
        </div>

        <div className="flex items-center justify-end text-gray-500">
          <IconTruckDelivery size={20} />
          <span className="ml-1.5">Estimated delivery: 4 Days</span>
        </div>
      </div>
    </>
  );
};
