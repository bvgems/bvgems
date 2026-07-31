import { Grid, GridCol, Image } from "@mantine/core";
import React from "react";

export const RingComparison = ({ productData }: any) => {
  return (
    <div className="mt-20 py-20">
      <Grid>
        <GridCol
          className="flex items-center justify-center relative"
          span={{ base: 12, md: 12 }}
        >
          <Grid>
            <GridCol span={{ base: 12, md: 9 }}>
              <Image loading="lazy"
                src={productData?.images?.edges[4]?.node?.url}
                h={300}
                w={400}
                className="object-contain"
              />
            </GridCol>

            {/* Horizontal Arrow + Label */}

            <GridCol className="flex items-center" span={{ base: 12, md: 3 }}>
              {/* Dime with measurement arrows */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <div className="flex justify-center items-center pointer-events-none">
                    <svg width="84px" height="16">
                      <line
                        x1="5%"
                        y1="8"
                        x2="95%"
                        y2="8"
                        stroke="black"
                        strokeWidth="1.5"
                        markerStart="url(#dimeTopArrowhead)"
                        markerEnd="url(#dimeTopArrowhead)"
                      />
                      <defs>
                        <marker
                          id="dimeTopArrowhead"
                          markerWidth="8"
                          markerHeight="6"
                          refX="4"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0 0, 8 3, 0 6" fill="black" />
                        </marker>
                      </defs>
                    </svg>
                    <span className="absolute text-xs bg-white px-1 rounded shadow-sm">
                      7.50 Ring Size
                    </span>
                  </div>
                </div>

                {/* Dime image with bottom measurement arrow */}
                <div className="relative">
                  <img
                    src="/assets/dime.webp"
                    alt="Dime for scale"
                    className="w-[84px] h-[84px] object-contain"
                  />

                  {/* Bottom arrow below dime */}
                  <div className="absolute top-full left-0 right-0 flex justify-center items-center pointer-events-none mt-2">
                    <svg width="100%" height="16">
                      <line
                        x1="5%"
                        y1="8"
                        x2="95%"
                        y2="8"
                        stroke="black"
                        strokeWidth="1.5"
                        markerStart="url(#dimeBottomArrowhead)"
                        markerEnd="url(#dimeBottomArrowhead)"
                      />
                      <defs>
                        <marker
                          id="dimeBottomArrowhead"
                          markerWidth="8"
                          markerHeight="6"
                          refX="4"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0 0, 8 3, 0 6" fill="black" />
                        </marker>
                      </defs>
                    </svg>
                    <span className="absolute text-xs bg-white px-1 rounded shadow-sm">
                      17.91 mm
                    </span>
                  </div>
                </div>
              </div>
            </GridCol>
          </Grid>
        </GridCol>
      </Grid>
    </div>
  );
};
