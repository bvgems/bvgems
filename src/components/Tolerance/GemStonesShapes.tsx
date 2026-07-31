import { Image, SegmentedControl } from "@mantine/core";
import { useState } from "react";

export const GemStonesShapes = ({ activeSegment, setActiveSegment }: any) => {
  return (
    <div className="p-8">
      <SegmentedControl
        orientation="vertical"
        radius={"xl"}
        size="xl"
        value={activeSegment}
        onChange={setActiveSegment}
        data={[
          {
            value: "round-princess-cushion",
            label: (
              <div className="flex p-2 justify-center items-center">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col items-center">
                    <Image loading="lazy" src="/assets/round.webp" h={50} w={50} />
                    <span className="text-sm mt-1 text-violet-800">Round</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Image loading="lazy" src="/assets/princess-cut.webp" h={50} w={50} />
                    <span className="text-sm mt-1 text-center text-violet-800">
                      Princess
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Image loading="lazy" src="/assets/cushion.webp" h={50} w={50} />
                    <span className="text-sm mt-1 text-violet-800">
                      Cushion
                    </span>
                  </div>
                </div>
              </div>
            ),
          },
          {
            value: "heart-trillion",
            label: (
              <div className="flex p-2 justify-center items-center">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col items-center">
                    <Image loading="lazy" src="/assets/heart.webp" h={50} w={50} />
                    <span className="text-sm mt-1 text-violet-800">Heart</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Image loading="lazy" src="/assets/trillion.webp" h={50} w={50} />
                    <span className="text-sm mt-1 text-center text-violet-800">
                      Trillion
                    </span>
                  </div>
                </div>
              </div>
            ),
          },
          {
            value: "oval-emerald",
            label: (
              <div className="flex p-2 justify-center items-center">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col items-center">
                    <Image loading="lazy" src="/assets/oval.webp" h={50} w={50} />
                    <span className="text-sm mt-1 text-violet-800">Oval</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Image loading="lazy" src="/assets/emerald.webp" h={50} w={50} />
                    <span className="text-sm mt-1 text-center text-violet-800">
                      Emerald
                    </span>
                  </div>
                </div>
              </div>
            ),
          },
          {
            value: "marquise-baguette",
            label: (
              <div className="flex p-2 justify-center items-center">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col items-center">
                    <Image loading="lazy" src="/assets/marquise.webp" h={50} w={50} />
                    <span className="text-sm mt-1 text-violet-800">
                      Marquise
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Image loading="lazy" src="/assets/straight-bugget.webp" h={50} w={50} />
                    <span className="text-sm mt-1 text-center text-violet-800">
                      Baguette
                    </span>
                  </div>
                </div>
              </div>
            ),
          },
          {
            value: "pear",
            label: (
              <div className="flex p-2 justify-center items-center">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col items-center">
                    <Image loading="lazy" src="/assets/pear.webp" h={50} w={50} />
                    <span className="text-sm mt-1 text-violet-800">Pear</span>
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
