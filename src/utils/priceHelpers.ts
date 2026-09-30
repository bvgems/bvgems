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
     if (!item?.price) return 0;
     return 50;
  }
  if (!item?.ct_weight || !item?.price) return 0;
  return Number((item.price / item.ct_weight).toFixed(2));
};

export const getPerStonePrice = (item: any): number => {
  if (!item) return 0;
  if (isSmallLabGrown(item)) return Number(item.price); // flat $2.50 from DB
  if (!item?.ct_weight) return 0;
  if (isLabGrown(item)) {
     if (!item?.price) return 0;
     return Number((50 * item.ct_weight).toFixed(2));
  }
  return item?.price ? Number(item.price) : 0;
};
