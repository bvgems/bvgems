const parseDimension = (dimStr) => {
  if (!dimStr) return { length: 0, width: 0, depth: 0, isNumber: false, raw: 0 };
  const normalized = dimStr.toString().toLowerCase().replace(/\s+/g, '').replace(/\*/g, 'x');
  const parts = normalized.split('x').map(s => parseFloat(s));
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { length: parts[0], width: parts[1], depth: parts[2] || 0, isNumber: true, raw: parts[0] };
  }
  const single = parseFloat(normalized);
  if (!isNaN(single)) {
    return { length: single, width: single, depth: 0, isNumber: true, raw: single };
  }
  return { length: 0, width: 0, depth: 0, isNumber: false, raw: 0 };
};

const sortBySizeDesc = (a, b, sizeKey = 'size') => {
  const getDimStr = (item) => {
    if (typeof item === 'string') return item;
    return item?.[sizeKey] || item?.dimension || item?.Dimension || "";
  };
  const sizeA = parseDimension(getDimStr(a));
  const sizeB = parseDimension(getDimStr(b));
  if (sizeA.isNumber && sizeB.isNumber) {
    if (sizeB.length !== sizeA.length) return sizeB.length - sizeA.length;
    if (sizeB.width !== sizeA.width) return sizeB.width - sizeA.width;
    return sizeB.depth - sizeA.depth;
  }
  return String(getDimStr(b)).localeCompare(String(getDimStr(a)));
};

const sortBySizeAsc = (a, b, sizeKey = 'size') => sortBySizeDesc(b, a, sizeKey);

const arr = [
  { dimension: "10x8", name: "10x8" },
  { dimension: "", name: "E1" },
  { dimension: "9x7", name: "9x7" },
  { dimension: "", name: "E2" },
  { dimension: "ROUND", name: "ROUND" },
  { dimension: "", name: "E3" },
  { dimension: "12x10", name: "12x10" },
];

arr.sort((a,b) => sortBySizeAsc(a, b, 'dimension'));
console.log(arr);
