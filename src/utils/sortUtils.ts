export const parseDimension = (dimStr: string) => {
  if (!dimStr) return { length: 0, width: 0, depth: 0, isNumber: false, raw: 0 };
  
  // Try to match standard format like "10x8", "10.5 x 8.5", "10 * 8", "10x8x5"
  const normalized = dimStr.toString().toLowerCase().replace(/\s+/g, '').replace(/\*/g, 'x');
  const parts = normalized.split('x').map(s => parseFloat(s));
  
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return {
      length: parts[0],
      width: parts[1],
      depth: parts[2] || 0,
      isNumber: true,
      raw: parts[0]
    };
  }
  
  const single = parseFloat(normalized);
  if (!isNaN(single)) {
    return {
      length: single,
      width: single, // Fallback width to length for square/round stones specified as single number
      depth: 0,
      isNumber: true,
      raw: single
    };
  }
  
  return { length: 0, width: 0, depth: 0, isNumber: false, raw: 0 };
};

/**
 * Sorts two items by size strictly by length descending, then width descending, then depth descending.
 * Largest to Smallest.
 * 
 * @param a First item (can be a string or an object)
 * @param b Second item (can be a string or an object)
 * @param sizeKey The key to check on the object (e.g. 'size' or 'dimension'). If omitted and a/b are strings, compares the strings directly.
 */
export const sortBySizeDesc = (a: any, b: any, sizeKey = 'size') => {
  const getDimStr = (item: any) => {
    if (typeof item === 'string') return item;
    return item?.[sizeKey] || item?.dimension || item?.Dimension || "";
  };

  const sizeA = parseDimension(getDimStr(a));
  const sizeB = parseDimension(getDimStr(b));
  
  if (sizeA.isNumber && sizeB.isNumber) {
    if (sizeB.length !== sizeA.length) {
      return sizeB.length - sizeA.length; // Sort length descending
    }
    if (sizeB.width !== sizeA.width) {
      return sizeB.width - sizeA.width; // Sort width descending
    }
    return sizeB.depth - sizeA.depth; // Sort depth descending
  }
  
  // Fallback to basic string comparison if not parseable
  return String(getDimStr(b)).localeCompare(String(getDimStr(a)));
};

/**
 * Sorts two items by size strictly by length ascending, then width ascending, then depth ascending.
 * Smallest to Largest.
 */
export const sortBySizeAsc = (a: any, b: any, sizeKey = 'size') => {
  return sortBySizeDesc(b, a, sizeKey);
};
