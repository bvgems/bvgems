const LAB_LABELS = new Set(["Lab Grown", "Lab-Grown"]);
const SMALL_LAB_SIZES = new Set(["1.00 mm", "1.25 mm", "1.50 mm", "1.75 mm"]);

export const isLabGrown = (item: any) =>
  LAB_LABELS.has(item?.type) || LAB_LABELS.has(item?.quality);

export const isSmallLabGrown = (item: any) =>
  isLabGrown(item) && SMALL_LAB_SIZES.has(item?.size);

export const getPerCaratPrice = (item: any): number => {
  if (!item) return 0;
  if (isSmallLabGrown(item)) return 0; // no per-carat for these
  if (isLabGrown(item)) {
     if (item?.collection_slug === "Alexandrite" || item?.collection_slug === "Paraiba Tourmaline") {
       return 85;
     }
     return 50;
  }
  if (!item?.ct_weight || !item?.price) return 0;
  return Number((item.price / item.ct_weight).toFixed(2));
};

export const getPerStonePrice = (item: any): number => {
  if (!item) return 0;
  if (isSmallLabGrown(item)) return Number(item.price); // flat $2.50 from DB
  if (isLabGrown(item)) {
     const rate = (item?.collection_slug === "Alexandrite" || item?.collection_slug === "Paraiba Tourmaline") ? 85 : 50;
     if (item?.ct_weight) {
       return Math.round((rate * Number(item.ct_weight) + 1e-6) * 100) / 100;
     }
     return item?.price ? Number(item.price) : 0;
  }
  return item?.price ? Number(item.price) : 0;
};

export const formatDisplayPrice = (price: number | string | undefined | null): string => {
  if (price === undefined || price === null || price === "") return "0";
  const num = Number(price);
  if (isNaN(num)) return "0";
  return Math.round(num).toString();
};

export const formatCartPrice = (price: number | string | undefined | null): string => {
  if (price === undefined || price === null || price === "") return "0.00";
  const num = Number(price);
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
};

export const formatDisplayWeight = (weight: number | string | undefined | null): string => {
  if (weight === undefined || weight === null || weight === "") return "0";
  const num = Number(weight);
  if (isNaN(num)) return weight.toString();
  return num.toFixed(2);
};

export const formatCartWeight = (weight: number | string | undefined | null): string => {
  if (weight === undefined || weight === null || weight === "") return "0";
  const num = Number(weight);
  if (isNaN(num)) return weight.toString();
  return num.toString();
};

export const getStoneWeight = (product: any): number => {
  if (!product) return 0;
  const raw = product.ct_weight;
  if (typeof raw === "number") return raw > 0 ? raw : 0;
  if (typeof raw === "string") {
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return !isNaN(parsed) && parsed > 0 ? parsed : 0;
  }
  return 0;
};

export const getMinCaratWeight = (product: any): number => {
  const stoneWeight = getStoneWeight(product);
  if (stoneWeight <= 0) return 1;
  if (product?.productType === "freeSizeStone") {
    return Number(stoneWeight.toFixed(2));
  }
  if (stoneWeight <= 1) return 1;
  return Number(stoneWeight.toFixed(2));
};

export const getCaratOptions = (product: any): string[] => {
  const minWeight = getMinCaratWeight(product);
  const options: string[] = [];

  if (!Number.isInteger(minWeight)) {
    options.push(String(minWeight));
  }

  const startInt = Math.max(1, Math.ceil(minWeight));
  const maxInt = Math.max(100, startInt);
  for (let i = startInt; i <= maxInt; i++) {
    options.push(String(i));
  }

  return options;
};

/**
 * Calculates nearest whole stone count and exact total carats for carat-wise purchase.
 * Example: 3.2 ct stone, customer enters 5 ct:
 * 1 stone = 3.2 ct (distance |5 - 3.2| = 1.8 ct)
 * 2 stones = 6.4 ct (distance |5 - 6.4| = 1.4 ct) -> 2 stones is closer!
 * Formula: stoneCount = Math.max(1, Math.round(requestedCarat / singleStoneWeight))
 * totalCarats = Number((stoneCount * singleStoneWeight).toFixed(4))
 */
export const calculateNearestStones = (
  singleStoneWeight: number | string | undefined | null,
  requestedCarat: number | string | undefined | null,
): { stoneCount: number; totalCarats: number } => {
  const weight = typeof singleStoneWeight === "number" ? singleStoneWeight : parseFloat(String(singleStoneWeight || "0").replace(/[^0-9.]/g, "")) || 0;
  const requested = typeof requestedCarat === "number" ? requestedCarat : parseFloat(String(requestedCarat || "0")) || 0;
  
  if (weight <= 0) {
    const safe = Math.max(1, requested);
    return { stoneCount: 1, totalCarats: safe };
  }
  const stoneCount = Math.max(1, Math.round(requested / weight));
  const totalCarats = Number((stoneCount * weight).toFixed(4));
  return { stoneCount, totalCarats };
};

