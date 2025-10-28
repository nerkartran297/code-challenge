import { useState, useEffect } from "react";

interface Settings {
  decimalPlaces: number;
  isLocked: boolean;
  theme: "dark" | "light";
  showUSDComparison: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  decimalPlaces: 6,
  isLocked: true, // Default locked để enforce balance
  theme: "dark",
  showUSDComparison: true, // Show USD comparison by default
};

/**
 * Custom hook để quản lý settings
 * - Lưu vào localStorage để persist
 * - Decimal places cho receive amount
 * - Lock state để control balance enforcement
 */
export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Load settings từ localStorage khi mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("swapSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage khi thay đổi
  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem("swapSettings", JSON.stringify(newSettings));
  };

  const setDecimalPlaces = (places: number) => {
    updateSettings({ ...settings, decimalPlaces: places });
  };

  const toggleLock = () => {
    updateSettings({ ...settings, isLocked: !settings.isLocked });
  };

  const setTheme = (theme: "dark" | "light") => {
    updateSettings({ ...settings, theme });
  };

  const setShowUSDComparison = (show: boolean) => {
    updateSettings({ ...settings, showUSDComparison: show });
  };

  return {
    settings,
    setDecimalPlaces,
    toggleLock,
    setTheme,
    setShowUSDComparison,
    showModal,
    setShowModal,
  };
};

