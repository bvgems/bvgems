"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";
import { Center, Loader, Title, Table, TextInput, Select, Button, Grid, GridCol, ActionIcon, Pagination, Checkbox, Modal, Group, Text } from "@mantine/core";
import { IconSearch, IconLayoutGrid, IconList, IconBrandWhatsapp, IconMail, IconFileExcel, IconPrinter, IconShoppingCart } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { TopFilters } from "./TopFilters";
import { CSVLink } from "react-csv";
import { gemstoneOptions as importedGemstoneOptions, ShapeFilterList } from "@/utils/constants";
import { AddToCartModal } from "@/components/CommonComponents/AddToCartModal";

const SHAPE_MAP: Record<string, string> = {
  "RD": "Round", "RDS": "Round", "CUS": "Cushion", "E/C": "Emerald Cut", "EC": "Emerald Cut",
  "S.E/C": "Square Emerald Cut", "SQ": "Square", "AC": "Asscher Cut", "PS": "Pear",
  "TRI": "Trillion", "TR": "Trillion", "HS": "Heart", "MQ": "Marquise", "OV": "Oval",
  "PC": "Princess Cut", "PR": "Princess Cut", "D/C": "Diamond Cut"
};

const GEM_MAP: Record<string, string> = {
  "Sapp": "Sapphire", "Emld": "Emerald", "Ruby": "Ruby", "Lab": "Lab Grown",
};

const gemstoneOptions = importedGemstoneOptions.map((gem: any) => ({
  label: gem.label,
  value: gem.value,
  image: gem.shopImage || gem.image
}));

const shapeOptions = ShapeFilterList.map((shape: any) => ({
  label: shape.label,
  value: shape.value,
  image: shape.image
}));

export const FILTER_SIZES = [
  "2 mm", "3 mm", "4", "5", "6", "7", "8", "9",
  "4x2", "5x3", "6x3", "6x4", "7x5", "8x4", "8x6", "9x6", "9x7", 
  "10x5", "10x7", "10x8", "11x9", "12x6", "12x10", "13x8", "14x7", 
  "14x10", "16x12", "18x13", "20x15"
];

const parseSize = (sizeStr: string): [number, number] | null => {
  if (!sizeStr) return null;
  const s = String(sizeStr).toLowerCase().replace(/mm/g, '').trim();
  if (s.includes('x')) {
    const parts = s.split('x').map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [Math.max(parts[0], parts[1]), Math.min(parts[0], parts[1])];
    }
  } else {
    const num = parseFloat(s);
    if (!isNaN(num)) {
      return [num, num];
    }
  }
  return null;
};

const parsedFilters = FILTER_SIZES.map(f => ({
  label: f,
  dims: parseSize(f)
}));

export const getNearestSize = (sizeStr: string): [number, number] | null => {
  const dims = parseSize(sizeStr);
  if (!dims) return null;
  let minDistance = Infinity;
  let nearestDims: [number, number] | null = null;
  for (const f of parsedFilters) {
    if (!f.dims) continue;
    const dist = Math.pow(dims[0] - f.dims[0], 2) + Math.pow(dims[1] - f.dims[1], 2);
    if (dist < minDistance) {
      minDistance = dist;
      nearestDims = f.dims;
    }
  }
  return nearestDims || dims;
};

const parseAllSizes = (sizeStr: string): [number, number][] => {
  if (!sizeStr) return [];
  const parts = String(sizeStr).split('|').map(s => s.trim());
  const sizes: [number, number][] = [];
  for (const p of parts) {
     const exact = parseSize(p);
     if (exact) sizes.push(exact);
  }
  return sizes;
};

const parseSearchQueryForDims = (query: string): { type: 'dims' | 'weight' | 'single', values: number[] } | null => {
  const q = query.toLowerCase().trim();
  
  // Check for weight explicitly (e.g. 6ct, 6 ct)
  const weightMatch = q.match(/^(\d+(\.\d+)?)\s*ct$/);
  if (weightMatch) {
     return { type: 'weight', values: [parseFloat(weightMatch[1])] };
  }
  
  // Strip 'mm' and check for dimensions
  const qClean = q.replace(/mm/g, '').trim();
  
  if (qClean.includes('x')) {
    const parts = qClean.split('x').map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { type: 'dims', values: [Math.max(parts[0], parts[1]), Math.min(parts[0], parts[1])] };
    }
  } else {
    // Single number
    const num = parseFloat(qClean);
    if (!isNaN(num) && num > 0) {
      return { type: 'single', values: [num] };
    }
  }
  
  return null;
};

const toTitleCase = (str: string) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

export default function SpecialPage() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [search, setSearch] = useState("");
  const [selectedGems, setSelectedGems] = useState<string[]>([]);
  const [selectedSapphireColors, setSelectedSapphireColors] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  
  const [weightRange, setWeightRange] = useState<{min: number|"", max: number|""}>({min: "", max: ""});
  const [lengthRange, setLengthRange] = useState<{min: number|"", max: number|""}>({min: "", max: ""});
  const [widthRange, setWidthRange] = useState<{min: number|"", max: number|""}>({min: "", max: ""});
  
  const [singlePair, setSinglePair] = useState("");
  const [viewMode, setViewMode] = useState<"list"|"grid">("list");
  
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [sortOrder, setSortOrder] = useState<string | null>("lowToHigh");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  const csvLinkRef = useRef<any>(null);
  const [emailModalOpened, { open: openEmail, close: closeEmail }] = useDisclosure(false);
  const [emailTo, setEmailTo] = useState("");

  const [productModal, { open: openProductModal, close: closeProductModal }] = useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    Promise.all([
        axios.get(`/api/monthly-data?t=${Date.now()}`, { withCredentials: true }),
        axios.get(`/api/getSpecialPageImages?t=${Date.now()}`)
      ])
        .then(([csvRes, imagesRes]) => {
          const dbImages = imagesRes.data?.data || [];
          const dbImageMap: Record<string, string> = {};
          dbImages.forEach((img: any) => {
            const key = img.collection_slug.toLowerCase() === "sapphire" 
              ? `${img.collection_slug.toLowerCase()}-${img.shape.toLowerCase()}-${img.color.toLowerCase()}`
              : `${img.collection_slug.toLowerCase()}-${img.shape.toLowerCase()}`;
            dbImageMap[key] = img.image_url;
          });

          const rawData = csvRes.data.data || [];
          const normalized = rawData.map((item: any, index: number) => {
            const rawShape = item.Shape ? String(item.Shape).trim().toUpperCase() : "";
            const fullShape = toTitleCase(SHAPE_MAP[rawShape] || rawShape);

            const rawGem = item["Gem Type"] ? String(item["Gem Type"]).trim() : "";
            const gemKey = Object.keys(GEM_MAP).find(k => k.toLowerCase() === rawGem.toLowerCase());
            const fullGem = toTitleCase(gemKey ? GEM_MAP[gemKey] : rawGem);
            
            const isLab = fullGem.toLowerCase().includes("lab") || String(item.Description).toLowerCase().includes("lab");
            const type = isLab ? "Lab Grown" : "Natural";

            const stockWt = parseFloat(item["Stock Wt."]) || 0;
            const stockPcs = parseInt(item["Stock Pcs."]) || 0;
            const rawColor = item.Color ? String(item.Color).trim() : "";
            const normalizedColor = rawColor.toLowerCase() === "pink" ? "Pink" : rawColor;

            let lookupGem = fullGem;
            if (isLab && rawColor) {
              const colorAsGemKey = Object.keys(GEM_MAP).find(k => k.toLowerCase() === rawColor.toLowerCase());
              if (colorAsGemKey) {
                lookupGem = GEM_MAP[colorAsGemKey];
              } else if (rawColor.toLowerCase() === "alex") {
                lookupGem = "Alexandrite";
              }
            }
            
            let lookupShape = fullShape;
            if (fullShape === "Diamond Cut") lookupShape = "Round";
            
            const imageKey = lookupGem.toLowerCase() === "sapphire"
              ? `${lookupGem.toLowerCase()}-${lookupShape.toLowerCase()}-${normalizedColor.toLowerCase()}`
              : `${lookupGem.toLowerCase()}-${lookupShape.toLowerCase()}`;
              
            const imageUrl = dbImageMap[imageKey] || "";

            let sizeStr = item.Size ? String(item.Size).trim() : "";

            return {
              ...item,
              id: item.id || `row-${index}`,
              normalizedShape: fullShape,
              normalizedGem: fullGem,
              normalizedColor,
              imageUrl,
              type,
              Size: sizeStr,
              "Stock Wt.": stockWt,
              "Stock Pcs.": stockPcs
            };
          });
          setData(normalized);
        })
        .catch((err) => {
          console.error("Failed to load data", err);
          setData([]);
        })
        .finally(() => {
          setLoadingData(false);
        });
  }, []);

  const bounds = useMemo(() => {
    let minWt = 0, maxWt = 0, minL = 0, maxL = 0, minW = 0, maxW = 0;
    data.forEach(d => {
       if (d["Stock Wt."] > maxWt) maxWt = d["Stock Wt."];
       const sizes = parseAllSizes(d.Size);
       sizes.forEach(dims => {
           if (dims[0] > maxL) maxL = dims[0];
           if (dims[1] > maxW) maxW = dims[1];
       });
    });
    return {
      weight: { min: 0, max: Math.ceil(maxWt) || 100 },
      length: { min: 0, max: Math.ceil(maxL) || 30 },
      width: { min: 0, max: Math.ceil(maxW) || 30 }
    };
  }, [data]);

  const sapphireColors = useMemo(() => {
    const colors = new Set<string>();
    data.forEach(item => {
      if (String(item.normalizedGem || "").toLowerCase().includes("sapphire") && item.normalizedColor) {
        colors.add(toTitleCase(item.normalizedColor));
      }
    });
    return Array.from(colors).sort();
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    let result = data.filter((item) => {
      // 1. Text Search
      if (search) {
        const searchLower = search.toLowerCase();
        const str = [item.Item, item.Description, item.normalizedGem, item.normalizedShape, item.Color, item.Size].join(" ").toLowerCase();
        let matchesText = str.includes(searchLower);

        // Advanced Dimension/Weight Search
        let matchesAdvanced = false;
        const parsedSearch = parseSearchQueryForDims(searchLower);
        if (parsedSearch) {
           const itemSizes = parseAllSizes(item.Size);
           const itemWt = item["Stock Wt."];
           
           if (parsedSearch.type === 'weight') {
              const [wt] = parsedSearch.values;
              matchesAdvanced = Math.abs(itemWt - wt) <= 0.5;
           } 
           else if (parsedSearch.type === 'dims') {
              const [sL, sW] = parsedSearch.values;
              matchesAdvanced = itemSizes.some(dims => 
                 Math.abs(dims[0] - sL) <= 0.5 && Math.abs(dims[1] - sW) <= 0.5
              );
           } 
           else if (parsedSearch.type === 'single') {
              const [sVal] = parsedSearch.values;
              // Check if matches length, width, OR weight
              matchesAdvanced = itemSizes.some(dims => 
                 Math.abs(dims[0] - sVal) <= 0.5 || Math.abs(dims[1] - sVal) <= 0.5
              ) || Math.abs(itemWt - sVal) <= 0.5;
           }
        }

        if (!matchesText && !matchesAdvanced) return false;
      }

      // 2. Visual Filters
      if (selectedGems.length > 0 && !selectedGems.some(g => String(item.normalizedGem || "").toLowerCase().includes(g.toLowerCase()))) return false;
      if (selectedShapes.length > 0 && !selectedShapes.some(s => String(item.normalizedShape || "").toLowerCase().includes(s.toLowerCase()))) return false;
      
      // 2b. Sapphire Color Filter (Only applies if Sapphire is selected and colors are chosen)
      if (selectedGems.includes("Sapphire") && selectedSapphireColors.length > 0) {
        // If the item is a sapphire, it must match one of the selected colors
        if (String(item.normalizedGem || "").toLowerCase().includes("sapphire")) {
           if (!selectedSapphireColors.some(c => String(item.normalizedColor || "").toLowerCase().includes(c.toLowerCase()))) {
             return false;
           }
        }
      }

      // 3. Weight Filter (with +/- 0.5 tolerance)
      const wtMin = weightRange.min !== "" ? Number(weightRange.min) - 0.5 : null;
      const wtMax = weightRange.max !== "" ? Number(weightRange.max) + 0.5 : null;
      if (wtMin !== null && item["Stock Wt."] < wtMin) return false;
      if (wtMax !== null && item["Stock Wt."] > wtMax) return false;

      // 4. Dimensions Filter (with +/- 0.5 tolerance)
      const sizes = parseAllSizes(item.Size);
      if (sizes.length > 0) {
         const matchesL = (l: number) => {
            const lMin = lengthRange.min !== "" ? Number(lengthRange.min) - 0.5 : null;
            const lMax = lengthRange.max !== "" ? Number(lengthRange.max) + 0.5 : null;
            if (lMin !== null && l < lMin) return false;
            if (lMax !== null && l > lMax) return false;
            return true;
         };
         const matchesW = (w: number) => {
            const wMin = widthRange.min !== "" ? Number(widthRange.min) - 0.5 : null;
            const wMax = widthRange.max !== "" ? Number(widthRange.max) + 0.5 : null;
            if (wMin !== null && w < wMin) return false;
            if (wMax !== null && w > wMax) return false;
            return true;
         };
         
         const hasMatchingDim = sizes.some(dims => matchesL(dims[0]) && matchesW(dims[1]));
         if (!hasMatchingDim && (lengthRange.min !== "" || lengthRange.max !== "" || widthRange.min !== "" || widthRange.max !== "")) return false;
      } else if (lengthRange.min !== "" || lengthRange.max !== "" || widthRange.min !== "" || widthRange.max !== "") {
         return false;
      }

      // 5. Single / Pair
      if (singlePair === "Single" && item["Stock Pcs."] !== 1) return false;
      if (singlePair === "Pair" && item["Stock Pcs."] !== 2) return false;
      
      return true;
    });

    // Sort
    if (sortOrder === "lowToHigh") {
      result.sort((a, b) => {
        const sizesA = parseAllSizes(a.Size || "");
        const sizesB = parseAllSizes(b.Size || "");
        const maxA = sizesA.length > 0 ? Math.max(...sizesA.map(d => d[0])) : 0;
        const maxB = sizesB.length > 0 ? Math.max(...sizesB.map(d => d[0])) : 0;
        return maxA - maxB;
      });
    } else if (sortOrder === "highToLow") {
      result.sort((a, b) => {
        const sizesA = parseAllSizes(a.Size || "");
        const sizesB = parseAllSizes(b.Size || "");
        const maxA = sizesA.length > 0 ? Math.max(...sizesA.map(d => d[0])) : 0;
        const maxB = sizesB.length > 0 ? Math.max(...sizesB.map(d => d[0])) : 0;
        return maxB - maxA;
      });
    }

    return result;
  }, [data, search, selectedGems, selectedShapes, selectedSapphireColors, weightRange, lengthRange, widthRange, singlePair, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const paginatedData = filteredAndSortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const toggleSelectAll = () => {
    const allSelected = paginatedData.length > 0 && paginatedData.every(row => selectedRows[row.id]);
    const newSelection = { ...selectedRows };
    paginatedData.forEach(row => {
      newSelection[row.id] = !allSelected;
    });
    setSelectedRows(newSelection);
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedItems = data.filter(d => selectedRows[d.id]);

  const getTextString = () => {
    return selectedItems.map(item => `Item: ${item.Item} | ${item.normalizedGem} ${item.normalizedShape} ${item.Size} | Wt: ${item["Stock Wt."]} ct`).join("\n");
  };

  const sendWhatsApp = () => {
    const text = encodeURIComponent(getTextString());
    window.open(`https://wa.me/12129444382?text=${text}`, "_blank");
  };

  const sendEmail = () => {
    axios.post("/api/send-email", {
      to: emailTo,
      subject: "B.V. Gems Inquiry",
      text: getTextString()
    }).then(() => {
      alert("Email sent!");
      closeEmail();
    }).catch(e => {
      alert("Failed to send email");
    });
  };

  const printSelected = () => {
    const w = window.open();
    const rows = selectedItems.map(item => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; vertical-align: middle;">
          <img src="${item.imageUrl || ''}" style="width: 50px; height: 50px; object-fit: contain;" alt="gem" />
        </td>
        <td style="padding: 10px; border: 1px solid #ddd; vertical-align: middle;">${item.Item || ""}</td>
        <td style="padding: 10px; border: 1px solid #ddd; vertical-align: middle;">${item.normalizedGem || ""}</td>
        <td style="padding: 10px; border: 1px solid #ddd; vertical-align: middle;">${item.normalizedShape || ""}</td>
        <td style="padding: 10px; border: 1px solid #ddd; vertical-align: middle;">${item.Size || ""}</td>
        <td style="padding: 10px; border: 1px solid #ddd; vertical-align: middle;">${item["Stock Wt."] || ""}</td>
        <td style="padding: 10px; border: 1px solid #ddd; vertical-align: middle;">${item.Color || ""}</td>
      </tr>
    `).join("");

    const content = `
      <html>
        <head>
          <title>Selected Gemstones</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            h1 { font-size: 24px; margin-bottom: 20px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f9f9f9; padding: 12px 10px; border: 1px solid #ddd; text-align: left; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Selected Gemstones</h1>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Item #</th>
                <th>Gemstone</th>
                <th>Shape</th>
                <th>Size</th>
                <th>Carat</th>
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `;
    w?.document.write(content);
    w?.document.close();
    w?.print();
  };

  if (loadingData) {
    return <Center className="h-[60vh]"><Loader color="blue" /></Center>;
  }

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      <div className="px-4 md:px-8 mt-5 mb-20 max-w-[1600px] mx-auto">
        <TopFilters 
           gemstoneOptions={gemstoneOptions}
           shapeOptions={shapeOptions}
           selectedGems={selectedGems} setSelectedGems={setSelectedGems}
           selectedShapes={selectedShapes} setSelectedShapes={setSelectedShapes}
           weightRange={weightRange} setWeightRange={setWeightRange} weightBounds={bounds.weight}
           lengthRange={lengthRange}            setLengthRange={setLengthRange}
            lengthBounds={bounds.length}
            widthRange={widthRange}
            setWidthRange={setWidthRange}
            widthBounds={bounds.width}
            singlePair={singlePair}
            setSinglePair={setSinglePair}
            sapphireColors={sapphireColors}
            selectedSapphireColors={selectedSapphireColors}
            setSelectedSapphireColors={setSelectedSapphireColors}
            resetAll={() => {
              setSearch("");
              setSelectedGems([]);
              setSelectedShapes([]);
              setSelectedSapphireColors([]);
              setWeightRange({min: "", max: ""}); setLengthRange({min:"", max:""}); setWidthRange({min:"", max:""});
              setSinglePair(""); setSearch("");
           }}
        />

        <div className="bg-white p-4 shadow-sm rounded border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
             {selectedItems.length > 0 ? (
               <div className="flex gap-2">
                 <Button onClick={sendWhatsApp} color="#0b182d" leftSection={<IconBrandWhatsapp size={16}/>}>WhatsApp</Button>
                 <Button onClick={openEmail} color="#0b182d" leftSection={<IconMail size={16}/>}>Email</Button>
                 <Button color="#0b182d" leftSection={<IconFileExcel size={16}/>} onClick={() => csvLinkRef.current?.link.click()}>Export Excel</Button>
                 <Button onClick={printSelected} color="#0b182d" leftSection={<IconPrinter size={16}/>}>Print</Button>
                 <CSVLink
                   data={selectedItems.map(d => ({
                     "Item ID": d.Item,
                     "Type": d.normalizedGem,
                     "Color": d.Color,
                     "Shape": d.normalizedShape,
                     "Dimension": d.Size,
                     "Carat Wt.": d["Stock Wt."],
                     "Stock Pc.": d["Stock Pcs."]
                   }))}
                   filename="bvgems-selection.csv"
                   className="hidden"
                   ref={csvLinkRef}
                 />
               </div>
             ) : (
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-[#0b182d] text-[15px]">Result ({filteredAndSortedData.length})</span>
                </div>
              )}
              
              <div className="flex gap-4 items-center flex-1 md:justify-end">
                <TextInput placeholder="Search item # or stone" leftSection={<IconSearch size={16} />} value={search} onChange={(e) => { setSearch(e.currentTarget.value); setCurrentPage(1); }} className="w-[200px]" />
                <Select value={sortOrder} onChange={setSortOrder} data={[{ label: "High to Low (Dim)", value: "highToLow" }, { label: "Low to High (Dim)", value: "lowToHigh" }]} placeholder="Sort by Dimension" clearable className="w-[180px]" />
               <div className="flex border border-gray-300 rounded-md overflow-hidden bg-white">
                 <ActionIcon radius="0" variant={viewMode === "list" ? "filled" : "transparent"} color="dark" onClick={() => setViewMode("list")} size="lg"><IconList size={18} /></ActionIcon>
                 <ActionIcon radius="0" variant={viewMode === "grid" ? "filled" : "transparent"} color="dark" onClick={() => setViewMode("grid")} size="lg"><IconLayoutGrid size={18} /></ActionIcon>
               </div>
             </div>
          </div>

          {viewMode === "list" ? (
             <div className="overflow-x-auto">
               <Table highlightOnHover highlightOnHoverColor="#f5f5f5" striped verticalSpacing="md">
                 <Table.Thead>
                   <Table.Tr className="font-extrabold text-[12px] text-gray-700 uppercase">
                     <Table.Th><Checkbox checked={paginatedData.length > 0 && paginatedData.every(r => selectedRows[r.id])} onChange={toggleSelectAll} /></Table.Th>
                     <Table.Th>Item ID</Table.Th>
                     <Table.Th>Image</Table.Th>
                     <Table.Th>Type</Table.Th>
                     <Table.Th>Color</Table.Th>
                     <Table.Th>Shape</Table.Th>
                     <Table.Th>Dimension</Table.Th>
                     <Table.Th>Carat Wt.</Table.Th>
                     <Table.Th>Stock Pc.</Table.Th>
                     <Table.Th></Table.Th>
                   </Table.Tr>
                 </Table.Thead>
                 <Table.Tbody>
                   {paginatedData.length > 0 ? (
                     paginatedData.map((row) => (
                       <Table.Tr key={row.id}>
                         <Table.Td><Checkbox checked={selectedRows[row.id] || false} onChange={() => toggleSelectRow(row.id)} /></Table.Td>
                         <Table.Td className="text-sm font-medium">{row.Item || "-"}</Table.Td>
                         <Table.Td>
                           {row.imageUrl ? <img src={row.imageUrl} alt={row.normalizedGem} className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>}
                         </Table.Td>
                         <Table.Td className="text-sm font-medium whitespace-nowrap">{row.normalizedGem || "-"}</Table.Td>
                         <Table.Td className="text-sm">{row.Color || "-"}</Table.Td>
                         <Table.Td className="text-sm whitespace-nowrap">{row.normalizedShape || "-"}</Table.Td>
                         <Table.Td className="text-sm whitespace-nowrap">{row.Size || "-"}</Table.Td>
                         <Table.Td className="text-sm">{row["Stock Wt."] || "-"}</Table.Td>
                         <Table.Td className="text-sm">{row["Stock Pcs."] || "-"}</Table.Td>
                         <Table.Td>
                            <Button
                              leftSection={<IconShoppingCart size={16} />}
                              variant="outline"
                              size="xs"
                              color="#0b182d"
                              onClick={() => {
                                setSelectedProduct({
                                  id: row.Item,
                                  productId: row.Item,
                                  productType: "stone",
                                  collection_slug: row.normalizedGem,
                                  shape: row.normalizedShape,
                                  size: row.Size,
                                  quality: row.type || "Natural",
                                  ct_weight: row["Stock Wt."],
                                  color: row.Color,
                                  image_url: row.imageUrl,
                                  price: row["Cp Std"] || 0,
                                  type: row.type || "Natural",
                                  cut: row.cut || "Standard",
                                });
                                openProductModal();
                              }}
                            >
                              Add
                            </Button>
                         </Table.Td>
                       </Table.Tr>
                     ))
                   ) : (
                     <Table.Tr><Table.Td colSpan={9} className="text-center py-12 text-gray-500 italic">No matching stones found.</Table.Td></Table.Tr>
                   )}
                 </Table.Tbody>
               </Table>
             </div>
          ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {paginatedData.map(row => (
                  <div key={row.id} className="border rounded p-4 relative group hover:shadow-md transition">
                    <div className="absolute top-2 left-2 z-10"><Checkbox checked={selectedRows[row.id] || false} onChange={() => toggleSelectRow(row.id)} /></div>
                    <div className="w-full aspect-square bg-gray-50 rounded mb-4 overflow-hidden flex items-center justify-center">
                       {row.imageUrl ? <img src={row.imageUrl} alt={row.Item} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-xs">No Image</span>}
                    </div>
                    <p className="font-bold text-sm text-[#0b182d]">{row.Item}</p>
                    <p className="text-xs text-gray-600 mt-1">{row.normalizedGem} • {row.normalizedShape}</p>
                    <p className="text-xs text-gray-600">{row.Size}</p>
                    <p className="text-xs font-semibold mt-2">{row["Stock Wt."]} ct</p>
                    <Button
                      fullWidth
                      mt="md"
                      size="xs"
                      variant="outline"
                      color="#0b182d"
                      leftSection={<IconShoppingCart size={16} />}
                      onClick={() => {
                        setSelectedProduct({
                          id: row.Item,
                          productId: row.Item,
                          productType: "stone",
                          collection_slug: row.normalizedGem,
                          shape: row.normalizedShape,
                          size: row.Size,
                          quality: row.type || "Natural",
                          ct_weight: row["Stock Wt."],
                          color: row.Color,
                          image_url: row.imageUrl,
                          price: row["Cp Std"] || 0,
                          type: row.type || "Natural",
                          cut: row.cut || "Standard",
                        });
                        openProductModal();
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                ))}
             </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 py-4">
              <Pagination total={totalPages} value={currentPage} onChange={setCurrentPage} color="blue" />
            </div>
          )}
        </div>
      </div>
      
      <Modal opened={emailModalOpened} onClose={closeEmail} title="Send Email">
         <TextInput label="Email Address" placeholder="Enter recipient email" value={emailTo} onChange={e => setEmailTo(e.currentTarget.value)} />
         <Button onClick={sendEmail} fullWidth mt="md" color="#0b182d">Send Email</Button>
      </Modal>

      <Modal
        p={0}
        size={1000}
        opened={productModal}
        onClose={closeProductModal}
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        {selectedProduct && (
          <AddToCartModal
            opened={productModal}
            onClose={closeProductModal}
            price={selectedProduct.price}
            image_url={selectedProduct.image_url}
            name={`${selectedProduct.collection_slug} ${selectedProduct.shape}`}
            size={selectedProduct.size}
            quality={selectedProduct.quality}
            ct_weight={selectedProduct.ct_weight}
            color={selectedProduct.color}
            product={selectedProduct}
          />
        )}
      </Modal>
    </div>
  );
}
