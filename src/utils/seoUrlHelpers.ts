export const generateCalibratedStoneUrl = (item: any, stoneHandle?: string) => {
  const handle = (
    (stoneHandle && stoneHandle !== "unknown" && stoneHandle !== "unknown-stone" ? stoneHandle : "") ||
    item?.collection_slug ||
    item?.gemstone_type ||
    item?.handle ||
    "gemstone"
  )
    .toLowerCase()
    .replace(/\s+/g, "-");

  const shape = item?.shape?.toLowerCase().replace(/\s+/g, "-") || "unknown-shape";
  const size = item?.size ? encodeURIComponent(item.size.replace(/\s+/g, "-")) : "unknown-size";
  const type = item?.type?.toLowerCase().replace(/\s+/g, "-") || "natural";
  
  const slug = `${type}-${handle}-${item.id}`;
  return `/calibrated-stones/${handle}/${shape}/${size}/${slug}`;
};

export const generateFreeSizeStoneUrl = (item: any, stoneHandle?: string) => {
  const handle = (
    (stoneHandle && stoneHandle !== "unknown" && stoneHandle !== "unknown-stone" ? stoneHandle : "") ||
    item?.gemstone_type ||
    item?.collection_slug ||
    item?.handle ||
    "gemstone"
  )
    .toLowerCase()
    .replace(/\s+/g, "-");

  const type = item?.type?.toLowerCase().replace(/\s+/g, "-") || "natural";
  const shape = item?.shape?.toLowerCase().replace(/\s+/g, "-") || "unknown-shape";
  const slug = `${type}-${handle}-${shape}-${item.id}`;
  return `/free-size-gemstones/${handle}/${slug}`;
};
