interface HeaderProps {
  onSettingsClick: () => void;
  theme?: "dark" | "light";
}

/**
 * Header component - Displays title and action buttons
 */
export const Header = ({ onSettingsClick, theme = "dark" }: HeaderProps) => {
  const isDark = theme === "dark";

  return (
    <div className="flex flex-row justify-between items-center w-full mb-4 sm:mb-5">
      <h1
        className={`font-bold text-xl sm:text-2xl ${
          isDark ? "text-gray-100" : "text-gray-900"
        }`}
      >
        Fancy Swap
      </h1>
      <div className="flex flex-row items-center gap-2 sm:gap-4">
        <button
          onClick={onSettingsClick}
          className={`p-2 rounded-full hover:scale-110 transition-all cursor-pointer ${
            isDark
              ? "bg-[#252a42] hover:bg-[#2e3450]"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <img
            src="/setting.svg"
            alt="setting"
            width={18}
            height={18}
            className={`${isDark ? "invert" : ""} opacity-70 sm:w-5 sm:h-5`}
          />
        </button>
        {/* <button
          className={`p-2 rounded-full hover:scale-110 transition-all cursor-pointer ${
            isDark
              ? "bg-[#252a42] hover:bg-[#2e3450]"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <img
            src="/more.svg"
            alt="more"
            width={18}
            height={18}
            className={`${isDark ? "invert" : ""} opacity-70 sm:w-5 sm:h-5`}
          />
        </button> */}
      </div>
    </div>
  );
};
