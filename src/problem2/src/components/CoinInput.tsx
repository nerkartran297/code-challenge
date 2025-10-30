import type { Coin } from "../api/coinService";
import { validateAmount } from "../utils/formatting";

interface CoinInputProps {
  label: string;
  amount?: string;
  coin: Coin | null;
  receivedAmount?: number | string; // Can be a number (from hook) or string (already formatted)
  showBalance?: boolean;
  showUSDComparison?: boolean;
  conversionRate?: string;
  receiveCoin?: Coin;
  readOnly?: boolean;
  animate: boolean;
  theme?: "dark" | "light";
  onAmountChange?: (value: string) => void;
  onCoinClick: () => void;
  onValidationError?: (message: string) => void; // Callback when validation error
}

/**
 * CoinInput component - Input field for pay/receive section
 */
export const CoinInput = ({
  label,
  amount,
  coin,
  receivedAmount,
  showBalance = true,
  showUSDComparison = false,
  conversionRate,
  receiveCoin,
  readOnly = false,
  animate,
  theme = "dark",
  onAmountChange,
  onCoinClick,
  onValidationError,
}: CoinInputProps) => {
  const isDark = theme === "dark";

  // Coin can be null while swapping
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty value and a single dot
    if (value === "" || value === ".") {
      if (onAmountChange) {
        onAmountChange(value);
      }
      return;
    }

    // Check valid format first
    let processedValue = value;
    if (value.length > 1 && value.startsWith("0") && value[1] !== ".") {
      processedValue = value.replace(/^0+/, "");
    }

    // Check format
    if (!/^\d*\.?\d*$/.test(processedValue)) {
      return; // Invalid format
    }

    // Check limits BEFORE validating
    const parts = processedValue.split(".");
    const integerPart = parts[0] || "";

    // Only check integer part limit (10 digits)
    if (integerPart.length > 10) {
      if (onValidationError) {
        onValidationError("Integer part - max 10 digits");
      }
      // Still validate to truncate, but toast has been shown
    }

    // Validate and update (may truncate)
    const validated = validateAmount(value);
    if (validated !== null && onAmountChange) {
      onAmountChange(validated);
    }
  };

  // Check if text is too long (to hide text on coin button)
  // receivedAmount can be a number or a fully formatted string
  const displayText = readOnly
    ? (typeof receivedAmount === "string"
        ? receivedAmount
        : receivedAmount?.toString()) || "0.00"
    : amount || "0.00";
  const isTextLong = displayText.length > 12;
  const shouldShowText = !isTextLong; // If text is long -> show icon only

  // Calculate dynamic font size for "You receive" when text is long
  const calculateFontSize = () => {
    if (!readOnly) return undefined; // Not applied to input
    const baseFontSize = 24; // text-2xl = 24px
    const length = displayText.length;

    // Use default size if text is short
    if (length <= 10) return undefined;

    // Scale down font size when text is long
    // Reduce by 3% per character after 10
    // length = 11 → scale = 0.97, length = 20 → scale = 0.7, length = 30 → scale = 0.4
    const excessLength = length - 15; // Number of characters beyond 10
    const maxScale = Math.max(0.5, 1 - excessLength * 0.03);
    const fontSize = Math.max(14, baseFontSize * maxScale); // Min 14px to remain readable

    return `${fontSize}px`;
  };

  const dynamicFontSize = calculateFontSize();

  // Calculate USD value for "You pay"
  const usdValue =
    !readOnly && amount && coin
      ? (parseFloat(amount) * coin.valueUSDT).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";

  return (
    <div
      className={`flex flex-col gap-3 p-4 w-full rounded-lg border mb-3 transition-all ${
        animate ? "shine-effect" : ""
      } ${
        isDark
          ? "bg-[#1C1E2B] border-gray-500/10 hover:border-gray-500/20"
          : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-center">
        <span
          className={`font-medium text-sm ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {label}
        </span>
        {showBalance && coin && (
          <span
            className={`text-sm ${isDark ? "text-gray-100" : "text-gray-700"}`}
          >
            Balance:{" "}
            <span
              className={`font-bold ${
                isDark ? "text-gray-200" : "text-gray-900"
              }`}
            >
              {coin.balance.toLocaleString()}
            </span>
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        {readOnly ? (
          <div
            className={`font-semibold flex-1 min-w-0 overflow-x-auto overflow-y-hidden ${
              dynamicFontSize ? "" : "text-2xl sm:text-3xl"
            } ${isDark ? "text-white" : "text-gray-900"}`}
            style={{
              ...(dynamicFontSize ? { fontSize: dynamicFontSize } : {}),
              whiteSpace: "nowrap",
              transition: "font-size 0.2s ease",
              WebkitOverflowScrolling: "touch", // Smooth scroll on iOS
            }}
            title={displayText} // Show full value on hover
          >
            {displayText}
          </div>
        ) : (
          <input
            placeholder="0.00"
            type="text"
            value={amount || ""}
            onChange={handleChange}
            maxLength={16} // 15 digits + 1 dot = 16 (max 15 digits; dot not counted)
            className={`text-2xl sm:text-3xl font-semibold bg-transparent border-none focus:outline-none flex-1 min-w-0 cursor-text overflow-hidden ${
              isDark
                ? "text-white placeholder-white"
                : "text-gray-900 placeholder-gray-400"
            }`}
            style={{
              textOverflow: "ellipsis",
            }}
          />
        )}

        {/* Coin selector button - Responsive when text is long */}
        <div className="relative shrink-0">
          {coin ? (
            <button
              onClick={onCoinClick}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 h-10 sm:h-11 rounded-full hover:scale-105 transition-all cursor-pointer ${
                isTextLong
                  ? "min-w-[50px] sm:min-w-[56px] justify-center" // Center icon when text is hidden
                  : "min-w-[80px] sm:min-w-[90px]"
              } ${
                isDark
                  ? "bg-[#252a42] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <img
                src={coin.img}
                alt={coin.name}
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              />
              {shouldShowText && (
                <span
                  className={`font-semibold uppercase truncate text-sm sm:text-base max-w-[40px] sm:max-w-[60px] ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {coin.symbol}
                </span>
              )}
            </button>
          ) : (
            <div
              className={`flex items-center justify-center min-w-[80px] sm:min-w-[90px] px-2 sm:px-3 h-10 sm:h-11 rounded-full ${
                isDark ? "bg-[#252a42]" : "bg-gray-200"
              }`}
            >
              <div className="w-6 h-6 border-4 border-gray-500 border-t-[#50DA63] rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* USD Value Subtitle - Only for "You pay" */}
      {!readOnly && showUSDComparison && (
        <div className="flex items-center -mt-2">
          <span
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            ≈ {usdValue} USD
          </span>
        </div>
      )}

      {/* Conversion Rate - Only for "You receive" */}
      {label === "You receive" && (
        <div className="flex items-center -mt-2 min-h-[20px]">
          {readOnly && conversionRate && receiveCoin && coin && (
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              1 {receiveCoin.symbol.toUpperCase()} = {conversionRate}{" "}
              {coin.symbol.toUpperCase()}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
