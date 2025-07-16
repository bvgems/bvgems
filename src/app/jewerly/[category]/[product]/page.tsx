"use client";
import { fetchProductByHandle } from "@/apis/api";
import { JewerlyProductDetails } from "@/components/Jewerly/JewerlyProductDetails";
import { Grid, GridCol } from "@mantine/core";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ImageZoom } from "@/components/CommonComponents/ImageZoom";

export default function JewerlyProductPage() {
  const { product } = useParams();
  const path = usePathname();
  const isBead = path?.includes("beads");
  const [productData, setProductData] = useState<any>(null);

  useEffect(() => {
    const getProductByHandle = async () => {
      if (product) {
        const response = await fetchProductByHandle(product);
        console.log('response',response.product)
        setProductData(response?.product);
      }
    };
    getProductByHandle();
  }, [product]);

  return (
    <div className="mt-9 p-9">
      <Grid>
        <GridCol span={{ base: 12, md: 7 }}>
          {productData && (
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ImageZoom
                src={
                  productData?.images?.edges?.[0]?.node?.url ||
                  "/placeholder.png"
                }
                alt={productData?.title}
                isBead={isBead}
              />
            </motion.div>
          )}
        </GridCol>

        <GridCol span={{ base: 12, md: 5 }}>
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <JewerlyProductDetails isBead productData={productData} />
          </motion.div>
        </GridCol>
      </Grid>
    </div>
  );
}
