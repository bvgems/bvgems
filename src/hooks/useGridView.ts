import {
  fetchBeads,
  fetchFinishedBeadNecklace,
  getJewelryData,
} from "@/apis/api";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useGridView = (initialData?: {
  allProducts?: any[];
  beads?: any[];
  finishedBeadNecklace?: any[];
}) => {
  const [allProducts, setAllProducts] = useState<any>(initialData?.allProducts || []);
  const [beads, setBeads] = useState<any>(initialData?.beads || []);
  const [finishedBeadNeclace, setFinishedBeadNecklace] = useState<any>(initialData?.finishedBeadNecklace || []);
  const [activeTab, setActiveTab] = useState("alphabetical");

  const { category }: any = useParams();
  const path = usePathname();

  useEffect(() => {
    if (path && path.includes("precious-beads")) {
      if (initialData?.beads) return;
      getBeads();
    }
    if (path && path.includes("finished-bead-necklaces")) {
      if (initialData?.finishedBeadNecklace) return;
      getFinishedBeadNecklace();
    }
  }, [path, initialData]);

  useEffect(() => {
    if (initialData?.allProducts) return;
    const fetchJewelryData = async () => {
      if (category) {
        const response = await getJewelryData(category);
        const products: any = response?.products || [];
        setAllProducts(products);
      }
    };

    fetchJewelryData();
  }, [category, initialData]);

  const getBeads = async () => {
    const response = await fetchBeads();
    setBeads(response);
  };

  const getFinishedBeadNecklace = async () => {
    const response = await fetchFinishedBeadNecklace();
    setFinishedBeadNecklace(response);
  };
  return {
    category,
    activeTab,
    setActiveTab,
    allProducts,
    setAllProducts,
    beads,
    finishedBeadNeclace,
  };
};
