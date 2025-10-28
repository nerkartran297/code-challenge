/**
 * Format amount để hiển thị (remove trailing zeros)
 * @param value - Giá trị cần format
 * @param decimalPlaces - Số chữ số thập phân (default: 6)
 * @returns String đã được format
 * 
 * Example: 
 * - 1.000000 → "1"
 * - 0.500000 → "0.5"
 * - 1.234567 → "1.234567"
 * - 0 → "0.00"
 */
export const formatReceivedAmount = (value: number, decimalPlaces: number = 6): string => {
  if (value === 0) return "0.00";

  // Format với số decimal places được chọn
  const formatted = value.toFixed(decimalPlaces);

  // Remove trailing zeros
  const trimmed = formatted.replace(/\.?0+$/, "");

  return trimmed;
};

/**
 * Validate và format input amount
 * - Remove leading zeros (except "0.")
 * - Chỉ cho phép số và dấu chấm
 */
export const validateAmount = (value: string): string | null => {
  // Allow empty string
  if (value === "") return "";

  // Remove leading zeros except for "0."
  let processedValue = value;
  if (value.length > 1 && value.startsWith("0") && value[1] !== ".") {
    processedValue = value.replace(/^0+/, "");
  }

  // Chỉ cho phép number format: digits + optional dot + optional digits
  if (/^\d*\.?\d*$/.test(processedValue)) {
    return processedValue;
  }

  // Invalid format
  return null;
};

