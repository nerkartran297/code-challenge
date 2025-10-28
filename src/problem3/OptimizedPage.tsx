//Adding declarations for the hooks and components for the error to not popping up

import React, { useMemo } from "react";
declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): PricesMap;
type BoxProps = React.HTMLAttributes<HTMLDivElement>;

//--------------------------------

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface PricesMap {
  [currency: string]: number | undefined;
}

declare const WalletRow: React.FC<{
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}>;

declare const classes: { row?: string };

interface Props extends BoxProps {}

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const numberFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
});

export const OptimizedWalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedAndFilteredBalances = useMemo(() => {
    if (!Array.isArray(balances) || balances.length === 0) return [];

    const withPriority = balances
      .filter((balance) => balance.amount > 0)
      .map((balance) => ({
        balance,
        priority: getPriority(balance.blockchain),
      }))
      .filter((item) => item.priority > -99);

    withPriority.sort((lhs, rhs) => {
      if (lhs.priority !== rhs.priority) {
        return rhs.priority - lhs.priority;
      }
      return lhs.balance.currency.localeCompare(rhs.balance.currency);
    });

    return withPriority.map((item) => item.balance);
  }, [balances]);

  const rows = useMemo(() => {
    return sortedAndFilteredBalances.map((balance) => {
      const price = prices[balance.currency] ?? 0;
      const usdValue = balance.amount * price;

      return (
        <WalletRow
          key={balance.currency}
          className={classes.row}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={numberFormatter.format(balance.amount)}
        />
      );
    });
  }, [sortedAndFilteredBalances, prices]);

  return <div {...rest}>{rows}</div>;
};

export default OptimizedWalletPage;
