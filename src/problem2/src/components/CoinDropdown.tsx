import type { Coin } from "../api/coinService";

interface CoinDropdownProps {
  showList: "pay" | "receive" | null;
  payCoin: Coin;
  receiveCoin: Coin;
  searchTerm: string;
  filteredCoins: Coin[];
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onSearchChange: (value: string) => void;
  onClose: () => void;
  onSelectCoin: (coin: Coin) => void;
  theme?: "dark" | "light";
}

/**
 * CoinDropdown component - Modal to select coin
 */
export const CoinDropdown = ({
  showList,
  payCoin,
  receiveCoin,
  searchTerm,
  filteredCoins,
  dropdownRef,
  onSearchChange,
  onClose,
  onSelectCoin,
  theme = "dark",
}: CoinDropdownProps) => {
  if (!showList) return null;

  const currentCoin = showList === "pay" ? payCoin : receiveCoin;
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        ref={dropdownRef}
        className={`border rounded-xl p-5 shadow-2xl w-[95%] sm:w-[420px] md:w-[450px] h-[580px] flex flex-col transition-colors ${
          isDark ? "bg-[#1C1E2B] border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {/* Header with Current Coin */}
        <div
          className={`flex justify-between items-center mb-4 pb-3 border-b ${
            isDark ? "border-gray-700/50" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={currentCoin.img}
              alt={currentCoin.name}
              className="w-10 h-10 object-contain"
            />
            <div>
              <h3
                className={`font-bold text-xl uppercase ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {currentCoin.symbol}
              </h3>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {showList === "pay" ? "You're paying with" : "You're receiving"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`text-2xl hover:scale-110 transition-all cursor-pointer ${
              isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            ×
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search name or symbol"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg mb-4 border focus:border-[#50DA63] focus:outline-none placeholder-gray-500 cursor-text transition-all ${
            isDark
              ? "bg-[#252a42] text-white border-gray-600/30"
              : "bg-gray-50 text-gray-900 border-gray-300"
          }`}
        />

        {/* Coin List */}
        <div className="overflow-y-auto flex-1 space-y-1 scrollbar-custom">
          {filteredCoins.map((coin) => {
            // Check if coin is already selected in the other side
            const otherCoin = showList === "pay" ? receiveCoin : payCoin;
            const isDisabled = coin.symbol === otherCoin.symbol;

            return (
              <div
                key={coin.symbol}
                onClick={() => {
                  if (isDisabled) return;
                  onSelectCoin(coin);
                }}
                className={`flex items-center justify-between p-3 rounded-lg transition-all group ${
                  isDisabled
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer hover:bg-[#252a42]"
                } ${
                  isDark && !isDisabled
                    ? "hover:bg-[#252a42]"
                    : !isDark && !isDisabled
                    ? "hover:bg-gray-50"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={coin.img}
                    alt={coin.name}
                    className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
                  />
                  <div>
                    <div
                      className={`font-semibold uppercase text-sm ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {coin.symbol}
                    </div>
                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {coin.name}
                    </div>
                  </div>
                </div>

                {isDisabled && (
                  <div className="text-right">
                    <div
                      className={`text-xs font-medium ${
                        isDark ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      Already selected
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredCoins.length === 0 && (
            <div
              className={`text-center py-8 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No tokens found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
