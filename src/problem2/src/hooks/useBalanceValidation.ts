import type { Coin } from "../api/coinService";

interface UseBalanceValidationProps {
  payCoin: Coin | null;
  amount: string;
}

/**
 * Custom hook để validate balance
 * - Check xem amount có vượt balance không
 * - Return validation state
 */
export const useBalanceValidation = ({
  payCoin,
  amount,
}: UseBalanceValidationProps) => {
  const numAmount = parseFloat(amount) || 0;
  const balance = payCoin?.balance || 0;
  
  // Check nếu amount vượt balance
  const exceedsBalance = numAmount > balance;
  
  // Check nếu amount = 0 hoặc <= 0
  const isZeroOrNegative = numAmount <= 0;
  
  return {
    isZeroOrNegative,
    // Transfer button sẽ disable khi:
    // - Amount = 0 hoặc < 0
    // - Amount vượt balance
    isTransferDisabled: isZeroOrNegative || exceedsBalance,
  };
};

