import { fetchBeads, getJewerlyData } from "@/apis/api";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useGridView = () => {
  const [rawProducts, setRawProducts] = useState<any>([]);
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
    const fetchJewerlyData = async () => {
      if (category) {
        const response = await getJewerlyData(category);
        const products: any = response?.products?.edges || [];
        setRawProducts(products);
        setAllProducts(
          [...products].sort((a, b) => a.node.title.localeCompare(b.node.title))
        );
      }
    };

    fetchJewerlyData();
  }, [category]);

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
