interface LoadingScreenProps {
  theme?: "dark" | "light";
}

/**
 * LoadingScreen component - Loading spinner đẹp hơn
 */
export const LoadingScreen = ({ theme = "dark" }: LoadingScreenProps) => {
  const isDark = theme === "dark";

  return (
    <section
      className={`flex flex-col items-center justify-center p-3 sm:p-5 rounded-xl border w-full max-w-[320px] xs:max-w-sm sm:max-w-md mx-2 sm:mx-auto relative overflow-hidden transition-all duration-500 ${
        isDark
          ? "bg-[#151723] border-gray-400/10"
          : "bg-gray-50 border-gray-200 shadow-lg"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="relative w-16 h-16">
          <div
            className={`absolute inset-0 border-4 rounded-full ${
              isDark ? "border-gray-700" : "border-gray-300"
            }`}
          ></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#50DA63] rounded-full animate-spin"></div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-[#50DA63] text-lg font-semibold">Loading...</div>
          <div
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Preparing swap interface
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2">
          <div
            className="w-2 h-2 bg-[#50DA63] rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#50DA63] rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#50DA63] rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </section>
  );
};
