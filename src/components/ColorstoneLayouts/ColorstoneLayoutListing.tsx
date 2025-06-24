import React, { useEffect, useState } from "react";
import { ViewAllProductComponent } from "../CommonComponents/ViewAllProductComponent";
import { Divider, Tabs, TabsList, TabsTab } from "@mantine/core";
import { useParams } from "next/navigation";
import { FilterDialog } from "../Jewerly/FilterDialog";
import { JewelryCategoryCard } from "../Jewerly/JewerlyCard";
import { fetchColorstoneLayouts } from "@/apis/api";

export const ColorstoneLayoutListing = () => {
  const [rawProducts, setRawProducts] = useState<any>([]);
  const [allProducts, setAllProducts] = useState<any>([]);
  const [activeTab, setActiveTab] = useState("alphabetical");

  const category = "layouts";
  useEffect(() => {
    getAllColorstoneLayouts();
  }, []);

  const getAllColorstoneLayouts = async () => {
    const response = await fetchColorstoneLayouts();

    setRawProducts(response);
    setAllProducts(response);
  };

  useEffect(() => {
    if (activeTab === "alphabetical") {
      const sorted = [...rawProducts].sort((a, b) =>
        a.node.title.localeCompare(b.node.title)
      );
      setAllProducts(sorted);
    } else if (activeTab === "newest") {
      const sorted: any = [...rawProducts].sort(
        (a: any, b: any) =>
          new Date(b.node.createdAt).getTime() -
          new Date(a.node.createdAt).getTime()
      );
      setAllProducts(sorted);
    }
  }, [activeTab, rawProducts]);
  return (
    <div className="p-8">
      <div className="w-[100%]">
        <Tabs
          color="gray"
          value={activeTab}
          onChange={(val) => {
            if (val) setActiveTab(val);
          }}
        >
          <div className="flex justify-between items-center w-full">
            <TabsList className="flex space-x-6">
              <TabsTab value="alphabetical">
                <span
                  className={`text-xl ${
                    activeTab === "alphabetical"
                      ? "text-gray-500"
                      : "text-black"
                  }`}
                >
                  ALPHABETICAL (A-Z)
                </span>
              </TabsTab>
              <TabsTab value="newest">
                <span
                  className={`text-xl ${
                    activeTab === "newest" ? "text-gray-500" : "text-black"
                  }`}
                >
                  NEWEST ARRIVAL
                </span>
              </TabsTab>
            </TabsList>

            <FilterDialog />
          </div>
          <Divider />
        </Tabs>
      </div>

      <ViewAllProductComponent
        keyProp={activeTab}
        items={allProducts}
        renderItem={(product, index) => (
          <JewelryCategoryCard
            category={category}
            product={product}
            index={index}
          />
        )}
      />
    </div>
  );
};
