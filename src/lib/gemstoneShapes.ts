import { pool } from "@/lib/pool";

export const DEFAULT_SHAPES = [
  "Round",
  "Oval",
  "Princess Cut",
  "Emerald Cut",
  "Pear",
  "Marquise",
  "Cushion",
  "Elongated Cushion",
  "Trillion",
  "Heart",
  "Straight Baguette",
];

/**
 * Returns distinct shapes present in gemstone_specs for a given gemstone handle,
 * ordered by the standard business sequence (Round first, etc.).
 * e.g., 'ruby' -> includes 'Elongated Cushion' and 'Cushion'
 *       'sapphire' -> includes 'Cushion', but NOT 'Elongated Cushion'
 *       'tanzanite' -> only 7 shapes (no Cushion, no Elongated Cushion, no Heart, no Straight Baguette)
 */
export async function getDbShapesForGemstone(handle: string): Promise<string[]> {
  if (!handle) return DEFAULT_SHAPES;
  try {
    const res = await pool.query(
      `SELECT DISTINCT shape FROM gemstone_specs 
       WHERE REPLACE(LOWER(collection_slug), ' ', '-') = LOWER($1) 
          OR LOWER(collection_slug) = LOWER($1)
          OR REPLACE(LOWER(collection_slug), ' ', '') = LOWER(REPLACE($1, '-', ''))`,
      [handle.trim()]
    );
    if (res.rows && res.rows.length > 0) {
      const dbShapes: string[] = res.rows.map((r: { shape: string }) => r.shape);
      return dbShapes.sort((a, b) => {
        const idxA = DEFAULT_SHAPES.indexOf(a);
        const idxB = DEFAULT_SHAPES.indexOf(b);
        if (idxA === -1 && idxB === -1) return a.localeCompare(b);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });
    }
  } catch (error) {
    console.error("Error fetching shapes for gemstone:", handle, error);
  }
  return DEFAULT_SHAPES;
}
