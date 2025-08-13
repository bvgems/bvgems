"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Card, CardSection, Modal } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useDisclosure } from "@mantine/hooks";
import { AuthForm } from "../Auth/AuthForm";

interface AnimatedCardProps {
  item: any;
  index: number;
  baseDelay?: number;
  isFreeSize?: boolean;
}

export const AnimatedCard = ({
  item,
  index,
  baseDelay = 0,
  isFreeSize = false,
}: AnimatedCardProps) => {
  const controls = useAnimation();
  const { user } = useAuth();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const router = useRouter();

  const getProductName = (item: any) => {
    const ctWeightPart = item?.ct_weight ? `${item.ct_weight} cttw. ` : "";
    return `${ctWeightPart}${item?.color} ${item?.shape} ${item?.collection_slug}, ${item?.quality} Quality - ${item?.size}`;
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const redirectToStonePage = () => {
    !isFreeSize
      ? router.push(
          `/product-details?id=${
            item?.id
          }&name=${item?.collection_slug?.toLowerCase()}`
        )
      : router.push(`/free-size-gemstone-details?id=${item?.id}`);
  };

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={close}
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        <AuthForm onClose={close} />
      </Modal>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Card
          className="flex flex-col justify-start bg-white cursor-pointer h-[250px] lg:h-[350px]"
          padding="lg"
          withBorder
          shadow="md"
          onClick={redirectToStonePage}
        >
          <CardSection h={250} withBorder>
            <div className="mt-5 flex items-center justify-center">
              <motion.img
                src={item?.image_url}
                alt={item?.title}
                className="object-contain h-[80px] md:h-[150px] lg:h-[200px]"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </CardSection>

          <div className="text-gray-700 text-[1rem] mt-3">
            {!isFreeSize ? (
              getProductName(item)
            ) : (
              <div>
                <p>Dimension: {item?.dimension}</p>
                <p>Carat Weight: {item?.ct_weight}</p>

                {!user ? (
                  <p className="text-gray-700 text-sm font-medium mt-2">
                    Please{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        open();
                      }}
                      className="underline text-blue-600 hover:text-blue-800"
                    >
                      sign in
                    </button>{" "}
                    to view gemstone prices.
                  </p>
                ) : (
                  <p>Per Carat Price: {item?.price}</p>
                )}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </>
  );
};
