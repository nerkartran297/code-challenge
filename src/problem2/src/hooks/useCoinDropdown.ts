import { useState, useEffect, useRef } from "react";
import type { Coin } from "../api/coinService";

/**
* Custom hook to manage dropdown logic
* - Open/close dropdown
* - Filter coins by search term
* - Auto-close when clicking outside
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

  // Auto-close dropdown when clicking outside
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

  // Filter coins based on search term
  const filteredCoins = coinsToUse.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Trigger animation for pay/receive section
  const triggerAnimation = (type: "pay" | "receive") => {
    if (type === "pay") {
      setAnimatePay(true);
      setTimeout(() => setAnimatePay(false), 600);
    } else {
      setAnimateReceive(true);
      setTimeout(() => setAnimateReceive(false), 600);
    }
  };

  // Close dropdown and reset search
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

