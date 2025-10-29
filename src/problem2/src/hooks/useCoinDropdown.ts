import { useState, useEffect, useRef } from "react";
import type { Coin } from "../api/coinService";

/**
 * Custom hook quản lý dropdown logic
 * - Mở/đóng dropdown
 * - Filter coins theo search term
 * - Auto close khi click outside
 */
export const useCoinDropdown = (
  coins: Coin[],
  allCoins: Coin[] = []
) => {
  const [showList, setShowList] = useState<"pay" | "receive" | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [animatePay, setAnimatePay] = useState<boolean>(false);
  const [animateReceive, setAnimateReceive] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  
  // Determine which coins to use based on current list type
  const coinsToUse = showList === "pay" ? coins : (allCoins.length > 0 ? allCoins : coins);

  // Auto close dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowList(null);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter coins dựa trên search term
  const filteredCoins = coinsToUse.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Trigger animation cho pay/receive section
  const triggerAnimation = (type: "pay" | "receive") => {
    if (type === "pay") {
      setAnimatePay(true);
      setTimeout(() => setAnimatePay(false), 600);
    } else {
      setAnimateReceive(true);
      setTimeout(() => setAnimateReceive(false), 600);
    }
  };

  // Đóng dropdown và reset search
  const closeDropdown = () => {
    setShowList(null);
    setSearchTerm("");
  };

  return {
    showList,
    setShowList,
    searchTerm,
    setSearchTerm,
    animatePay,
    animateReceive,
    dropdownRef,
    filteredCoins,
    triggerAnimation,
    closeDropdown,
  };
};

