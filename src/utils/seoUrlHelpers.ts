export const generateCalibratedStoneUrl = (item: any, stoneHandle: string) => {
  const shape = item?.shape?.toLowerCase().replace(/\s+/g, "-") || "unknown-shape";
  const size = item?.size ? encodeURIComponent(item.size.replace(/\s+/g, "-")) : "unknown-size";
  const type = item?.type?.toLowerCase().replace(/\s+/g, "-") || "natural";
  
  const slug = `${type}-${stoneHandle}-${item.id}`;
  return `/calibrated-stones/${stoneHandle}/${shape}/${size}/${slug}`;
};

export const generateFreeSizeStoneUrl = (item: any, stoneHandle: string) => {
  const type = item?.type?.toLowerCase().replace(/\s+/g, "-") || "natural";
  const shape = item?.shape?.toLowerCase().replace(/\s+/g, "-") || "unknown-shape";
  const slug = `${type}-${stoneHandle}-${shape}-${item.id}`;
  return `/free-size-gemstones/${stoneHandle}/${slug}`;
};
