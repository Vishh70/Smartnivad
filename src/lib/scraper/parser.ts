export function parsePrice(priceText: string | null | undefined): number | null {
  if (!priceText) return null;
  // Remove currency symbols, commas, and formatting
  // Need to handle Indian rupees formatting where it might be 1,49,999 -> 149999
  const cleaned = priceText.replace(/[^0-9.]/g, "");
  const value = parseFloat(cleaned);
  if (isNaN(value) || value <= 0) return null;
  return value;
}
