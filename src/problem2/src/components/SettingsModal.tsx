interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  decimalPlaces: number;
  theme: "dark" | "light";
  showUSDComparison: boolean;
  onDecimalPlacesChange: (places: number) => void;
  onThemeChange: (theme: "dark" | "light") => void;
  onToggleUSDComparison: (show: boolean) => void;
}

/**
 * SettingsModal component - Modal để chỉnh settings
 */
export const SettingsModal = ({
  isOpen,
  onClose,
  decimalPlaces,
  theme,
  showUSDComparison,
  onDecimalPlacesChange,
  onThemeChange,
  onToggleUSDComparison,
}: SettingsModalProps) => {
  if (!isOpen) return null;

  const isDark = theme === "dark";
  const decimalOptions = [2, 4, 6, 8, 10];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`border rounded-xl p-6 shadow-2xl w-full max-w-[400px] transition-colors ${
          isDark ? "bg-[#1C1E2B] border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#50DA63] rounded-full flex items-center justify-center">
              <img
                src="/setting.svg"
                alt="setting"
                width={20}
                height={20}
                className={`${
                  isDark ? "invert opacity-100" : "opacity-70"
                }  sm:w-5 sm:h-5`}
              />
            </div>
            <h2
              className={`font-bold text-lg ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Settings
            </h2>
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

        {/* Decimal Places Setting */}
        <div className="space-y-3 mb-6">
          <label
            className={`block font-medium text-sm mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Decimal Places
          </label>
          <div className="flex flex-wrap gap-2">
            {decimalOptions.map((places) => (
              <button
                key={places}
                onClick={() => onDecimalPlacesChange(places)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  decimalPlaces === places
                    ? "bg-[#50DA63] text-gray-900"
                    : isDark
                    ? "bg-[#252a42] text-gray-300 hover:bg-[#2e3450]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {places}
              </button>
            ))}
          </div>
          <p
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Number of decimal places for the receive amount display
          </p>
        </div>

        {/* Theme Setting */}
        <div className="space-y-3">
          <label
            className={`block font-medium text-sm mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Theme
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => onThemeChange("dark")}
              className={`flex-1 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                theme === "dark"
                  ? "border-[#50DA63] bg-[#50DA63]/10"
                  : isDark
                  ? "border-gray-600 hover:border-gray-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-800 rounded-lg border-2 border-gray-600"></div>
                <span
                  className={`font-semibold text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Dark
                </span>
              </div>
            </button>
            <button
              onClick={() => onThemeChange("light")}
              className={`flex-1 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                theme === "light"
                  ? "border-[#50DA63] bg-[#50DA63]/10"
                  : isDark
                  ? "border-gray-600 hover:border-gray-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white rounded-lg border-2 border-gray-400 shadow-lg"></div>
                <span
                  className={`font-semibold text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Light
                </span>
              </div>
            </button>
          </div>
          <p
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Choose your preferred color theme
          </p>
        </div>

        {/* USD Comparison Toggle */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <label
                className={`block font-medium text-sm mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Show USD Value
              </label>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Display USD equivalent for the amount you're paying
              </p>
            </div>
            <button
              onClick={() => onToggleUSDComparison(!showUSDComparison)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                showUSDComparison
                  ? "bg-[#50DA63]"
                  : isDark
                  ? "bg-gray-600"
                  : "bg-gray-400"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  showUSDComparison ? "translate-x-7" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-[#50DA63] text-gray-900 rounded-lg py-3 font-bold hover:bg-[#5eec72] transition-all cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
