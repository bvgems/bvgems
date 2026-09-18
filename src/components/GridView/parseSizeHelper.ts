export const parseSize = (sizeStr: string): [number, number] | null => {
  if (!sizeStr) return null;
  const s = String(sizeStr).toLowerCase().replace(/mm/g, '').replace(/ /g, '').trim();
  if (s.includes('x')) {
    const parts = s.split('x').map(p => parseFloat(p));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
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
