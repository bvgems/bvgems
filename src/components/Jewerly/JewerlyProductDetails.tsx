"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Button,
  Divider,
  Modal,
  NumberInput,
  Select,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableTr,
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
import { getCartStore } from "@/store/useCartStore";

export const JewerlyProductDetails = ({ productData }: any) => {
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";
  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);

  const [quantity, setQuantity] = useState<any>(1);
  const [selectedGoldColor, setSelectedGoldColor] = useState<string | null>(
    null
  );
  const [modalOpened, { open, close }] = useDisclosure(false);

  const addProduct = async () => {
    await addProductToCart(productData, quantity, addToCart);
    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      message: "Jewelry product added to the cart!",
      position: "top-right",
      autoClose: 4000,
    });
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
      <div className="px-9 flex flex-col gap-4">
        <h1 className="uppercase text-[2rem] leading-relaxed tracking-wide">
          {productData?.title}
        </h1>

        <div className="text-[1.9rem] text-gray-700 font-bold">
          <div className="flex items-center gap-4">
            <span style={{ fontFamily: "system-ui, sans-serif" }}>
              $ {productData?.variants?.edges?.[0]?.node?.price?.amount}{" "}
              {productData?.variants?.edges?.[0]?.node?.price?.currencyCode}
            </span>
            <span
              style={{ fontFamily: "system-ui, sans-serif" }}
              className="line-through text-gray-400 font-sans"
            >
              ${" "}
              {Number(productData?.variants?.edges?.[0]?.node?.price?.amount) +
                2000}{" "}
              {productData?.variants?.edges?.[0]?.node?.price?.currencyCode}
            </span>
          </div>
        </div>

        <Divider />
        <p className="text-lg mt-2 pb-1.5">{productData?.description}</p>

        <div className="">
          <Table
            horizontalSpacing="lg"
            withRowBorders={false}
            variant="vertical"
            layout="fixed"
          >
            <TableTbody>
              <TableTr className="text-lg">
                <TableTh w={160}>Stone Color</TableTh>
                <TableTd>-</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh>Stone Size</TableTh>
                <TableTd>-</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh>Stone Wg.</TableTh>
                <TableTd>-</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh>Diamond Size</TableTh>
                <TableTd>-</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh>Total Wg.</TableTh>
                <TableTd>-</TableTd>
              </TableTr>
            </TableTbody>
          </Table>
        </div>

        <div className="flex gap-4 w-full">
          <Select
            className="flex-1"
            leftSection={<IconDiamond size={20} />}
            label="Select Gold Color"
            placeholder="Gold color"
            data={["Rose Gold", "White Gold", "Yellow Gold"]}
            value={selectedGoldColor}
            onChange={setSelectedGoldColor}
            styles={{
              input: {
                padding: "22px 35px",
                backgroundColor: "#dbdddf",
              },
            }}
          />

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

        <div className="mt-3 flex flex-col gap-2">
          {user ? (
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
          )}

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
