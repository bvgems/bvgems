"use client";

import { getAllGemstones } from "@/apis/api";
import { useEffect, useState } from "react";
import { Container, Grid, GridCol, Image, Modal, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SpecificGemstoneKnowledge } from "./SpecificGemstoneKnowledge";

interface Collection {
  title: string;
  additionalImages?: {
    reference?: {
      image?: {
        url: string;
        altText?: string;
      };
    };
  } | null;
}

interface Gemstone {
  title: string;
  imageUrl: string;
}

export const GemstonesKnowledge = () => {
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [activeStone, setActiveStone] = useState<string>();

  const fetchGemStones = async () => {
    const response = await getAllGemstones();
    if (Array.isArray(response)) {
      const mapped: Gemstone[] = response
        .map((item: Collection) => {
          const imageUrl = item?.additionalImages?.reference?.image?.url;
          const title = item?.title;
          if (!imageUrl || !title) return null;
          return { title, imageUrl };
        })
        .filter(Boolean) as Gemstone[];
      setGemstones(mapped);
      if (mapped.length > 0) {
        setActiveStone(mapped[0].title);
      }
    }
  };

  useEffect(() => {
    fetchGemStones();
  }, []);

  const openModal = (title: string) => {
    setActiveStone(title);
    open();
  };

  return (
    <div className="mt-16">
      <Modal
        opened={modalOpened}
        onClose={close}
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
        transitionProps={{
          transition: "pop-top-left",
          duration: 200,
          timingFunction: "linear",
        }}
        centered
        size={"lg"}
      >
        <SpecificGemstoneKnowledge activeStone={activeStone} />
      </Modal>

      <div>
        <h3 className=" text-center">
          <span className="text-violet-800 text-2xl font-semibold mt-2">
            Know More About Gemstones
          </span>
          <p className="text-xs">Click on the stone to view more</p>
        </h3>
        <Container size={"lg"} className="mt-10">
          <div className="columns-1 sm:columns-2 md:columns-3 gap-0">
            {gemstones.map(({ title, imageUrl }, index) => {
              const fixedHeights = [160, 200, 240, 280];

              let height = fixedHeights[index % fixedHeights.length];
              if (title.toLowerCase().includes("morganite")) {
                height = 320;
              }

              return (
                <div
                  key={index}
                  className="break-inside-avoid cursor-pointer relative group overflow-hidden mb-0"
                  onClick={() => openModal(title)}
                  style={{ height }}
                >
                  <Image
                    src={imageUrl}
                    alt={title}
                    fit="cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white font-semibold text-center px-2">
                      {title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </div>
     
    </div>
  );
};
