"use client";
import { useGridView } from "@/hooks/useGridView";
import { ViewAllProductComponent } from "./ViewAllProductComponent";
import { JewelryCategoryCard } from "../Jewerly/JewerlyCard";

export const CommonGridView = ({ isBead }: any) => {
  const { category, activeTab, allProducts, beads } =
    useGridView();

  return (
    <div className="px-4 sm:px-8 pt-6 pb-14">
      <ViewAllProductComponent
        keyProp={activeTab}
        items={allProducts?.length ? allProducts : beads}
        renderItem={(product, index) => (
          <JewelryCategoryCard
            isBead={isBead}
            category={category}
            product={product}
            index={index}
          />
        )}
      />
    </div>
  );
};
