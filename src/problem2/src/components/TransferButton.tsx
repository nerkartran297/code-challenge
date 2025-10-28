interface TransferButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * TransferButton component - Button để execute transfer
 */
export const TransferButton = ({
  disabled = false,
  onClick,
}: TransferButtonProps) => {
  // Button luôn màu xanh, chỉ thay đổi opacity khi disabled
  const buttonClasses = disabled
    ? "bg-[#50DA63] text-gray-900 cursor-not-allowed opacity-50" // Disabled - màu xanh nhưng mờ
    : "bg-[#50DA63] text-gray-900 hover:bg-[#5eec72] hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(80,218,99,0.5)] cursor-pointer"; // Enabled

  return (
    <button
      onClick={onClick}
      className={`rounded-lg font-bold text-lg sm:text-xl w-full py-3 sm:py-4 transition-all ${buttonClasses}`}
    >
      Transfer
    </button>
  );
};
