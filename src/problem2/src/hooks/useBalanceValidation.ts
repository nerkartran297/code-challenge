import type { Coin } from "../api/coinService";

interface UseBalanceValidationProps {
  payCoin: Coin | null;
  amount: string;
}

/**
* Custom hook to validate balance
* - Check whether the amount exceeds the balance
* - Return validation state
*/
export const useBalanceValidation = ({
  payCoin,
  amount,
}: UseBalanceValidationProps) => {
  const numAmount = parseFloat(amount) || 0;
  const balance = payCoin?.balance || 0;
  
  // Check if amount exceeds balance
  const exceedsBalance = numAmount > balance;
  
  // Check if amount = 0 or <= 0
  const isZeroOrNegative = numAmount <= 0;
  
  return {
    isZeroOrNegative,
    // Transfer button will be disabled when:
    // - Amount = 0 or < 0
    // - Amount exceeds balance
    isTransferDisabled: isZeroOrNegative || exceedsBalance,
  };
};

