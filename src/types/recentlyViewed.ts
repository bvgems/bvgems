export interface RecentlyViewedItem {
  id: string; // Composite unique key e.g. "calibrated_12345" or "free_size_89"
  productId: string | number;
  productType: "calibrated" | "free-size" | "layout" | "jewelry";
  title: string;
  gemstone: string;
  shape?: string;
  size?: string;
  dimension?: string;
  color?: string;
  quality?: string;
  carat_weight?: number | string;
  price?: number | string;
  price_per_carat?: number | string;
  image_url: string;
  url: string;
  lot_number?: string;
  viewedAt: string; // ISO 8601 string
}
