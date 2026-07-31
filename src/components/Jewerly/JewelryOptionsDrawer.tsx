import { Divider, Image, NumberFormatter } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

export const JewelryOptionsDrawer = ({
  selectedShape,
  productData,
  category,
  close,
  open,
  isFreeGift,
}: any) => {
  const router = useRouter();

  return (
    <div className="">
      <h1 className="text-2xl px-6 pb-6 text-center">
        More Options For This Design
      </h1>

      <div
        className="
          grid gap-6 px-6
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
        "
      >
        {productData?.variants?.edges?.map((item: any, idx: number) => {
          return (
            <div
              key={idx}
              className="bg-white transition-all duration-300 cursor-pointer p-4 flex flex-col justify-between shadow-md hover:shadow-xl rounded-xl"
              onClick={() => {
                !isFreeGift
                  ? router.push(
                      `/jewelry-details/${category}/${
                        productData?.handle
                      }/${item?.node?.title.toLowerCase().replace(/\s+/g, "-")}`,
                    )
                  : router.push(
                      `/jewelry-details/${category}/${
                        productData?.handle
                      }/${item?.node?.title.toLowerCase().replace(/\s+/g, "-")}?freeGift=true`,
                    );
              }}
            >
              <div className="w-full flex justify-center">
                <Image loading="lazy"
                  radius="md"
                  h={200}
                  fit="contain"
                  src={item?.node?.image?.url}
                  alt={item?.node?.title}
                  className="object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>

              <p className="text-sm  font-medium text-gray-500 mt-3">
                {item?.node?.title}
              </p>
              <NumberFormatter
                thousandSeparator
                prefix="$"
                className="text-sm  text-gray-500 mt-2"
                value={item?.node?.price?.amount}
                suffix=" USD"
              />
            </div>
          );
        })}
      </div>
      <div
        onClick={() => {
          close();
          open();
        }}
        className="text-md underline cursor-pointer flex justify-center mt-10"
      >
        Want this style with your favorite gemstone? Start here.
      </div>
    </div>
  );
};
