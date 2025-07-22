export const NormalizeParam = (text: string) => {
  return text?.toLowerCase().replace(/\s+/g, "-");
};

// utils/formatting.ts
// utils/formatting.ts
export const formatNumber = (num: number, locale = "en-US"): string => {
  return new Intl.NumberFormat(locale).format(num);
};