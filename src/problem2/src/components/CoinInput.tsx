import type { Coin } from "../api/coinService";
import { validateAmount } from "../utils/formatting";

interface CoinInputProps {
  label: string;
  amount?: string;
  coin: Coin | null;
  receivedAmount?: number;
  showBalance?: boolean;
  showUSDComparison?: boolean;
  conversionRate?: string;
  receiveCoin?: Coin;
  readOnly?: boolean;
  animate: boolean;
  theme?: "dark" | "light";
  onAmountChange?: (value: string) => void;
  onCoinClick: () => void;
}

/**
 * CoinInput component - Input field cho pay/receive section
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
}: CoinInputProps) => {
  const isDark = theme === "dark";

  // Coin có thể null khi đang swap

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = validateAmount(e.target.value);
    if (validated !== null && onAmountChange) {
      onAmountChange(validated);
    }
  };

  // Check xem text có quá dài không (để ẩn text ở coin button)
  const displayText = readOnly
    ? receivedAmount?.toString() || "0.00"
    : amount || "0.00";
  const isTextLong = displayText.length > 12;
  const shouldShowText = !isTextLong; // Nếu text dài -> chỉ show icon

  // Tính USD value cho "You pay"
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
            className={`text-2xl sm:text-3xl font-semibold flex-1 min-w-0 word-break-word ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {displayText}
          </div>
        ) : (
          <input
            placeholder="0.00"
            type="text"
            value={amount || ""}
            onChange={handleChange}
            className={`text-2xl sm:text-3xl font-semibold bg-transparent border-none focus:outline-none flex-1 min-w-0 cursor-text ${
              isDark
                ? "text-white placeholder-white"
                : "text-gray-900 placeholder-gray-400"
            }`}
          />
        )}

        {/* Coin selector button - Responsive khi text dài */}
        <div className="relative shrink-0">
          {coin ? (
            <button
              onClick={onCoinClick}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 h-10 sm:h-11 rounded-full hover:scale-105 transition-all cursor-pointer ${
                isTextLong
                  ? "min-w-[50px] sm:min-w-[56px]"
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
      <div className="flex items-center -mt-2 min-h-[20px]">
        {readOnly && conversionRate && receiveCoin && coin && (
          <span
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            1 {coin.symbol.toUpperCase()} = {conversionRate}{" "}
            {receiveCoin.symbol.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};
