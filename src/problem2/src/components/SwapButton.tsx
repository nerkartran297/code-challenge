interface SwapButtonProps {
  onSwap: () => void;
  theme?: "dark" | "light";
}

/**
 * SwapButton component - Button to swap between pay and receive coins
 */
import React from "react";

export const SwapButton = ({ onSwap, theme = "dark" }: SwapButtonProps) => {
  const isDark = theme === "dark";
  const [cooldown, setCooldown] = React.useState(false);

  const handleClick = () => {
    if (cooldown) return;
    setCooldown(true);
    try {
      onSwap();
    } finally {
      setTimeout(() => setCooldown(false), 400);
    }
  };

  return (
    <div className="w-full flex justify-center items-center z-30 mb-3">
      <div
        className={`rounded-full p-2.5 sm:p-3 transition-all shadow-md ${
          cooldown
            ? "opacity-60 cursor-not-allowed"
            : "hover:scale-110 cursor-pointer"
        } ${
          isDark
            ? "bg-[#50DA63] hover:bg-[#5eec72] hover:shadow-[0_0_25px_rgba(80,218,99,0.7)]"
            : "bg-[#50DA63] hover:bg-[#5eec72] hover:shadow-[0_0_25px_rgba(80,218,99,0.7)]"
        }`}
        onClick={handleClick}
        aria-disabled={cooldown}
      >
        <img
          src="/sync.svg"
          alt="swap"
          width={20}
          height={20}
          className="rotate-90 w-5 h-5 sm:w-6 sm:h-6"
        />
      </div>
    </div>
  );
};
