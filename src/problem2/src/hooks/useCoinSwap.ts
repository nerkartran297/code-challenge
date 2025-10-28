import { useState, useEffect, useMemo } from "react";
import { fetchCoins } from "../api/coinService";
import type { Coin } from "../api/coinService";

/**
 * Custom hook quản lý logic swap coins
 * - Fetch coins từ API khi component mount
 * - Quản lý selected coins (pay và receive)
 * - Tính toán conversion rate
 */
export const useCoinSwap = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [allCoins, setAllCoins] = useState<Coin[]>([]); // All coins from API
  const [loading, setLoading] = useState<boolean>(true);
  const [isSwapping, setIsSwapping] = useState<boolean>(false); // Loading state cho swap
  const [payCoin, setPayCoin] = useState<Coin | null>(null);
  const [receiveCoin, setReceiveCoin] = useState<Coin | null>(null);
  const [amount, setAmount] = useState<string>("");

  // Fetch coins khi component mount
  useEffect(() => {
    const loadCoins = async () => {
      try {
        const fetchedCoins = await fetchCoins();
        setAllCoins(fetchedCoins); // Store all coins
        
        // Filter coins with balance > 0 for "You pay"
        const coinsWithBalance = fetchedCoins.filter(coin => coin.balance > 0);
        setCoins(coinsWithBalance);

        // Set default coins with balance:
        // - First coin with balance as pay coin
        // - First coin with balance (different from pay) as receive
        if (coinsWithBalance.length > 0) {
          setPayCoin(coinsWithBalance[0]);
          // Find ETH in all coins as default receive coin
          const ethCoin = fetchedCoins.find(c => c.symbol.toLowerCase() === "eth");
          setReceiveCoin(ethCoin || coinsWithBalance[coinsWithBalance.length > 1 ? 1 : 0]);
        }
      } catch (error) {
        console.error("Failed to fetch coins:", error);
      } finally {
        // Đảm bảo loading screen hiển thị ít nhất 2 giây để show animation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
      }
    };

    loadCoins();
  }, []);

  // Tính amount sẽ nhận được - Real-time calculation
  // Không cần useMemo vì phép tính này cực kỳ đơn giản (chỉ 1 phép chia)
  // Performance gain của useMemo không đáng kể so với overhead của nó
  const numAmount = parseFloat(amount) || 0;
  const receivedAmount =
    payCoin && receiveCoin && numAmount > 0
      ? (numAmount * payCoin.valueUSDT) / receiveCoin.valueUSDT
      : 0;

  // Tính conversion rate - Memoized
  const conversionRate = useMemo(() => {
    if (!payCoin || !receiveCoin) return "0.000000";
    return (payCoin.valueUSDT / receiveCoin.valueUSDT).toFixed(6);
  }, [payCoin, receiveCoin]);

  // Refresh coins/balances from API (future-proof for real balances)
  const refreshCoins = async () => {
    try {
      const fetchedCoins = await fetchCoins();
      setAllCoins(fetchedCoins);

      // Update filtered coins for pay
      const coinsWithBalance = fetchedCoins.filter((coin) => coin.balance > 0);
      setCoins(coinsWithBalance);

      // Preserve current selections by symbol if still available
      if (payCoin) {
        const nextPay = coinsWithBalance.find(
          (c) => c.symbol.toLowerCase() === payCoin.symbol.toLowerCase()
        );
        setPayCoin(nextPay || coinsWithBalance[0] || null);
      }
      if (receiveCoin) {
        const nextReceive = fetchedCoins.find(
          (c) => c.symbol.toLowerCase() === receiveCoin.symbol.toLowerCase()
        );
        // Fallback: pick first coin different from pay
        const fallback = fetchedCoins.find(
          (c) => !payCoin || c.symbol.toLowerCase() !== payCoin.symbol.toLowerCase()
        );
        setReceiveCoin(nextReceive || fallback || null);
      }
    } catch (e) {
      console.error("Failed to refresh coins:", e);
    }
  };

  // Swap coins với loading state 0.3s
  const swapCoins = async () => {
    if (!payCoin || !receiveCoin || isSwapping) return false;

    setIsSwapping(true);
    
    // Delay 0.3s để prevent spam swap
    await new Promise((resolve) => setTimeout(resolve, 300));

    const temp = payCoin;
    setPayCoin(receiveCoin);
    setReceiveCoin(temp);
    
    setIsSwapping(false);
    return true;
  };

  return {
    coins, // Only coins with balance > 0 for "You pay"
    allCoins, // All coins for "You receive" dropdown
    loading,
    isSwapping,
    payCoin,
    receiveCoin,
    amount,
    setAmount,
    setPayCoin,
    setReceiveCoin,
    receivedAmount,
    conversionRate,
    swapCoins,
    refreshCoins,
  };
};

