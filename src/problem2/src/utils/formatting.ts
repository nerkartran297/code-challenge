/**
* Format amount for the "You receive" display with decimal places from settings
* @param value - Value to format (number)
* @param decimalPlaces - Number of decimal places (default: 4)
* @returns String formatted with the selected decimal places (removes trailing zeros)
* 
* Note:
* - JavaScript Number has a precision limit of ~15-17 significant digits
* - For numbers with > 17 significant digits, values will be rounded and precision lost
* 
* Example (with decimalPlaces = 4):
* - 1.000000 → "1"
* - 0.500000 → "0.5"
* - 1.234567890 → "1.2346" (round to 4 decimals)
* - 0 → "0.00"
*/
export const formatReceivedAmount = (value: number, decimalPlaces: number = 4): string => {
  if (value === 0) return "0.00";

  // Format with the selected number of decimal places
  const formatted = value.toFixed(decimalPlaces);

  // Remove trailing zeros and extra decimal point
  const trimmed = formatted.replace(/\.?0+$/, "");

  return trimmed;
};

/**
* Validate and format input amount for the "You pay" section
* - Remove leading zeros (except "0.")
* - Allow only digits and a decimal point
* - Limits: up to 10 integer digits, total up to 15 digits (excluding the dot)
* 
* Note: Applies only to the input field ("You pay"), not to "You receive"
*/
export const validateAmount = (value: string): string | null => {
  // Allow empty string
  if (value === "") return "";

  // Allow only a dot (while the user is typing)
  if (value === ".") return ".";

  // Remove leading zeros except for "0."
  let processedValue = value;
  if (value.length > 1 && value.startsWith("0") && value[1] !== ".") {
    processedValue = value.replace(/^0+/, "");
  }

  // Only allow numeric format: digits + optional dot + optional digits
  if (!/^\d*\.?\d*$/.test(processedValue)) {
    return null;
  }

  const parts = processedValue.split(".");
  const integerPart = parts[0] || "";
  const decimalPart = parts[1] || "";
  
  const MAX_INTEGER_DIGITS = 10; // Maximum 10 integer digits
  const MAX_TOTAL_DIGITS = 15; // Maximum total 15 digits

  // Truncate integer part if it exceeds 10 digits
  let truncatedInteger = integerPart;
  if (integerPart.length > MAX_INTEGER_DIGITS) {
    truncatedInteger = integerPart.slice(0, MAX_INTEGER_DIGITS);
  }

  // Compute allowed decimal digits (after truncating the integer part)
  const availableForDecimal = Math.max(0, MAX_TOTAL_DIGITS - truncatedInteger.length);
  
  // Truncate fractional part if needed
  let truncatedDecimal = decimalPart;
  if (decimalPart.length > availableForDecimal) {
    truncatedDecimal = decimalPart.slice(0, availableForDecimal);
  }

  // Compute total digits after truncation
  const totalDigits = truncatedInteger.length + truncatedDecimal.length;

  // If total is still > 15, truncate more of the fractional part
  if (totalDigits > MAX_TOTAL_DIGITS) {
    const finalDecimalLength = Math.max(0, MAX_TOTAL_DIGITS - truncatedInteger.length);
    truncatedDecimal = truncatedDecimal.slice(0, finalDecimalLength);
  }

  // Format the result
  // If the original value had a dot or there is a fractional part, keep the dot
  const hasDecimalPoint = value.includes(".") || truncatedDecimal.length > 0;
  
  if (hasDecimalPoint) {
    return truncatedInteger ? `${truncatedInteger}.${truncatedDecimal}` : `0.${truncatedDecimal}`;
  } else {
    return truncatedInteger || "0";
  }
};

