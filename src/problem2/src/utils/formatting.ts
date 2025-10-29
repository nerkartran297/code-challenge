/**
 * Format amount để hiển thị cho "You receive" với decimal places từ settings
 * @param value - Giá trị cần format (number)
 * @param decimalPlaces - Số chữ số thập phân (default: 4)
 * @returns String đã được format với số decimal places được chọn (remove trailing zeros)
 * 
 * Note: 
 * - JavaScript Number có precision limit ~15-17 chữ số có nghĩa
 * - Với số > 17 chữ số có nghĩa, sẽ bị làm tròn và mất precision
 * 
 * Example (với decimalPlaces = 4): 
 * - 1.000000 → "1"
 * - 0.500000 → "0.5"
 * - 1.234567890 → "1.2346" (round to 4 decimals)
 * - 0 → "0.00"
 */
export const formatReceivedAmount = (value: number, decimalPlaces: number = 4): string => {
  if (value === 0) return "0.00";

  // Format với số decimal places được chọn
  const formatted = value.toFixed(decimalPlaces);

  // Remove trailing zeros và dấu chấm thừa
  const trimmed = formatted.replace(/\.?0+$/, "");

  return trimmed;
};

/**
 * Validate và format input amount cho "You pay" section
 * - Remove leading zeros (except "0.")
 * - Chỉ cho phép số và dấu chấm
 * - Giới hạn: tối đa 10 chữ số phần nguyên, tổng tối đa 15 chữ số (không tính dấu chấm)
 * 
 * Note: Chỉ áp dụng cho input field ("You pay"), không áp dụng cho "You receive"
 */
export const validateAmount = (value: string): string | null => {
  // Allow empty string
  if (value === "") return "";

  // Cho phép chỉ có dấu chấm (khi user đang nhập)
  if (value === ".") return ".";

  // Remove leading zeros except for "0."
  let processedValue = value;
  if (value.length > 1 && value.startsWith("0") && value[1] !== ".") {
    processedValue = value.replace(/^0+/, "");
  }

  // Chỉ cho phép number format: digits + optional dot + optional digits
  if (!/^\d*\.?\d*$/.test(processedValue)) {
    return null;
  }

  const parts = processedValue.split(".");
  const integerPart = parts[0] || "";
  const decimalPart = parts[1] || "";
  
  const MAX_INTEGER_DIGITS = 10; // Tối đa 10 chữ số phần nguyên
  const MAX_TOTAL_DIGITS = 15; // Tổng tối đa 15 chữ số

  // Truncate phần nguyên nếu vượt quá 10 chữ số
  let truncatedInteger = integerPart;
  if (integerPart.length > MAX_INTEGER_DIGITS) {
    truncatedInteger = integerPart.slice(0, MAX_INTEGER_DIGITS);
  }

  // Tính số chữ số thập phân có thể dùng (sau khi đã truncate phần nguyên)
  const availableForDecimal = Math.max(0, MAX_TOTAL_DIGITS - truncatedInteger.length);
  
  // Truncate phần thập phân nếu cần
  let truncatedDecimal = decimalPart;
  if (decimalPart.length > availableForDecimal) {
    truncatedDecimal = decimalPart.slice(0, availableForDecimal);
  }

  // Tính tổng số chữ số sau khi truncate
  const totalDigits = truncatedInteger.length + truncatedDecimal.length;

  // Nếu tổng vẫn > 15, truncate thêm phần thập phân
  if (totalDigits > MAX_TOTAL_DIGITS) {
    const finalDecimalLength = Math.max(0, MAX_TOTAL_DIGITS - truncatedInteger.length);
    truncatedDecimal = truncatedDecimal.slice(0, finalDecimalLength);
  }

  // Format kết quả
  // Nếu có dấu chấm trong value gốc hoặc có phần thập phân, giữ lại dấu chấm
  const hasDecimalPoint = value.includes(".") || truncatedDecimal.length > 0;
  
  if (hasDecimalPoint) {
    return truncatedInteger ? `${truncatedInteger}.${truncatedDecimal}` : `0.${truncatedDecimal}`;
  } else {
    return truncatedInteger || "0";
  }
};

