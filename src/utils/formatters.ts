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
  // The cart should show exact. The database usually stores 2 decimals for prices or exact floats.
  return num.toFixed(2);
};

export const formatDisplayWeight = (weight: number | string | undefined | null): string => {
  if (weight === undefined || weight === null || weight === "") return "0";
  const num = Number(weight);
  if (isNaN(num)) return weight.toString();
  // round to max 2 decimals, e.g. 1.256 -> 1.26
  // Number(num.toFixed(2)).toString() removes trailing zeroes (e.g. 1.50 -> 1.5, we might want 1.50 if it had it, but standard is to let toFixed(2) format it or just Number().toString() to trim trailing zeros)
  // Let's use toFixed(2) so it looks consistent, e.g., 1.50 ct
  return num.toFixed(2);
};

export const formatCartWeight = (weight: number | string | undefined | null): string => {
  if (weight === undefined || weight === null || weight === "") return "0";
  const num = Number(weight);
  if (isNaN(num)) return weight.toString();
  // exact weight
  return num.toString();
};
