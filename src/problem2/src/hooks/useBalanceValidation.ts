import type { Coin } from "../api/coinService";

interface UseBalanceValidationProps {
  payCoin: Coin | null;
  amount: string;
  isLocked: boolean;
}

/**
 * Custom hook để validate balance
 * - Check xem amount có vượt balance không
 * - Return warning state và max balance
 */
export const useBalanceValidation = ({
  payCoin,
  amount,
  isLocked,
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
    // - Unlocked (isLocked = false) VÀ exceedsBalance
    isTransferDisabled: isZeroOrNegative || (!isLocked && exceedsBalance),
  };
};

