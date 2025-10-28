import React from "react";

interface LockButtonProps {
  isLocked: boolean;
  onToggle: () => void;
  isWarning?: boolean;
  theme?: "dark" | "light";
}

/**
 * LockButton component - Lock/Unlock button để control balance enforcement
 */
export const LockButton = ({
  isLocked,
  onToggle,
  isWarning = false,
  theme = "dark",
}: LockButtonProps) => {
  const isDark = theme === "dark";
  const [cooldown, setCooldown] = React.useState(false);

  const handleClick = () => {
    if (cooldown) return;
    setCooldown(true);
    try {
      onToggle();
    } finally {
      setTimeout(() => setCooldown(false), 400);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all relative group ${
        cooldown
          ? "opacity-60 cursor-not-allowed"
          : "hover:scale-110 cursor-pointer"
      } ${
        isWarning
          ? "bg-red-600"
          : isDark
          ? "bg-[#252a42] hover:bg-[#2e3450]"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
      aria-disabled={cooldown}
      title={
        isLocked
          ? "Unlock: Allow amounts over balance"
          : "Lock: Enforce max balance"
      }
    >
      {/* Lock/Unlock Icon */}
      <img
        src={isLocked ? "/locked.svg" : "/unlocked.svg"}
        alt={isLocked ? "locked" : "unlocked"}
        width={18}
        height={18}
        className={`opacity-80 sm:w-5 sm:h-5 ${isDark ? "invert" : ""}`}
      />

      {/* Tooltip */}
      <div
        className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs px-2 py-1 rounded whitespace-nowrap ${
          isDark ? "bg-gray-800 text-white" : "bg-gray-900 text-white"
        }`}
      >
        {isLocked
          ? isWarning
            ? "Warning: Amount exceeds balance"
            : "Locked: Max balance enforced"
          : "Unlocked: Overdraft allowed"}
      </div>
    </button>
  );
};
