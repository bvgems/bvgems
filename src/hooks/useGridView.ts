import { fetchBeads, getJewelryData } from "@/apis/api";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useGridView = () => {
  const [allProducts, setAllProducts] = useState<any>([]);
  const [beads, setBeads] = useState<any>([]);
  const [activeTab, setActiveTab] = useState("alphabetical");

  const { category } = useParams();
  const path = usePathname();

  useEffect(() => {
    if (path && path.includes("precious-beads")) {
      getBeads();
    }
  }, [path]);

  useEffect(() => {
    const fetchJewelryData = async () => {
      if (category) {
        const response = await getJewelryData(category);
        const products: any = response?.products || [];
        setAllProducts(products);
      }
    };

    fetchJewelryData();
  }, [category]);

  const getBeads = async () => {
    const response = await fetchBeads();
    setBeads(response);
  };

  return {
    category,
    activeTab,
    setActiveTab,
    allProducts,
    setAllProducts,
    beads,
  };
};
