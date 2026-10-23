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

/**
 * Sanitizes variant titles to prevent multi-segment URL breakage (e.g., "White / 6.5" -> "white-6.5")
 */
export const formatJewelryVariantSlug = (title?: string): string => {
  if (!title) return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/\//g, "-")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

/**
 * Normalizes jewelry category handles to match existing Next.js routes
 */
export const normalizeJewelryCategory = (product: any, fallbackCategory?: string): string => {
  if (fallbackCategory) {
    const cat = fallbackCategory.toLowerCase().trim();
    if (cat === "bead" || cat === "beads") return "beads";
    if (cat === "finished-bead-necklaces" || cat === "finished bead necklaces") return "finished-bead-necklaces";
    if (["rings", "necklaces", "bracelets", "earrings"].includes(cat)) return cat;
  }

  const pType = (product?.productType || product?.jewelryType?.value || "").toLowerCase();
  if (pType.includes("bead necklace") || pType.includes("finished bead")) return "finished-bead-necklaces";
  if (pType.includes("bead")) return "beads";
  if (pType.includes("ring")) return "rings";
  if (pType.includes("earring")) return "earrings";
  if (pType.includes("necklace")) return "necklaces";
  if (pType.includes("bracelet")) return "bracelets";

  return fallbackCategory || "rings";
};

/**
 * Generates clean, robust URLs for jewelry product & variant pages
 */
export const generateJewelryUrl = (
  category: string | undefined,
  handle: string | undefined,
  variantTitle?: string
): string => {
  if (!handle) return "/jewelry/rings";
  const cat = category || "rings";
  const slug = formatJewelryVariantSlug(variantTitle);
  return slug ? `/jewelry/${cat}/${handle}/${slug}` : `/jewelry/${cat}/${handle}`;
};

