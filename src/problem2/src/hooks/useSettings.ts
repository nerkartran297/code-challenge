import { useState, useEffect } from "react";

interface Settings {
  decimalPlaces: number;
  theme: "dark" | "light";
  showUSDComparison: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  decimalPlaces: 4, // Default 4 decimal places for "You receive"
  theme: "dark",
  showUSDComparison: true, // Show USD comparison by default
};

/**
* Custom hook to manage settings
* - Persist to localStorage
* - Decimal places for the receive amount
*/
export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("swapSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Migrate old settings: remove isLocked if present
        const { isLocked, ...migratedSettings } = parsed;
        setSettings(migratedSettings);
      } catch (error) {
        console.error("Failed to parse settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage when changed
  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem("swapSettings", JSON.stringify(newSettings));
  };

  const setDecimalPlaces = (places: number) => {
    updateSettings({ ...settings, decimalPlaces: places });
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
    setTheme,
    setShowUSDComparison,
    showModal,
    setShowModal,
  };
};

