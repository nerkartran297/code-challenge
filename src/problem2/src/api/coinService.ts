import balancesData from "../data/balances.json";

export interface PriceData {
  currency: string;
  date: string;
  price: number;
}

export interface Coin {
  symbol: string;
  name: string;
  valueUSDT: number;
  img: string;
  balance: number;
}

/**
 * Get token icon URL from GitHub
 * Handles special casing for staked tokens (stETH, stATOM, etc.)
 * @param currency - The currency name from API (e.g., "RATOM", "STATOM")
 * @returns URL to the token icon
 */
const getTokenIconUrl = (currency: string): string => {
  // Handle special cases where GitHub repo uses different casing
  const specialCases: Record<string, string> = {
    "RATOM": "rATOM",
    "STATOM": "stATOM",
    "STDYDX": "stDYDX",
    "STDYM": "stDYM",
    "STETH": "stETH",
    "STEVMOS": "stEVMOS",
    "STOSMO": "stOSMO",
    "STLUNA": "stLUNA",
  };
  
  const fileName = specialCases[currency.toUpperCase()] || currency;
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${fileName}.svg`;
};

/**
 * Fetch prices from Switcheo API
 * @returns Promise<PriceData[]> Array of price data
 */
export const fetchPrices = async (): Promise<PriceData[]> => {
  const response = await fetch("https://interview.switcheo.com/prices.json");
  if (!response.ok) {
    throw new Error("Failed to fetch prices");
  }
  return response.json();
};

/**
 * Fetch all available coins with prices from API
 * Dynamically creates coins based on all currencies in the prices API
 * @returns Promise<Coin[]> Array of all coins
 */
export const fetchCoins = async (): Promise<Coin[]> => {
  // Fetch prices from API
  const prices = await fetchPrices();
  
  // Group by currency and get the latest price for each (handle duplicates)
  const priceMap = new Map<string, PriceData>();
  prices.forEach((price) => {
    const existing = priceMap.get(price.currency);
    // Keep the latest price (newer date) for each currency
    if (!existing || new Date(price.date).getTime() > new Date(existing.date).getTime()) {
      priceMap.set(price.currency, price);
    }
  });
  
  // Build coins array from all unique currencies
  const coins: Coin[] = Array.from(priceMap.entries()).map(([currency, priceData]) => {
    const symbolForDisplay = currency.toUpperCase();
    const balanceKey = symbolForDisplay as keyof typeof balancesData.balances;
    const balance = balancesData.balances[balanceKey] || 0;
    
    return {
      symbol: symbolForDisplay.toLowerCase(),
      name: symbolForDisplay,
      valueUSDT: priceData.price,
      img: getTokenIconUrl(currency), // Keep original currency name for SVG fetch
      balance,
    };
  });
  
  // Sort by symbol for consistency
  coins.sort((a, b) => a.symbol.localeCompare(b.symbol));
  
  return coins;
};

/**
 * Fetch a specific coin by symbol
 * @param symbol - The symbol of the coin to fetch
 * @returns Promise<Coin | undefined> The coin if found, undefined otherwise
 */
export const fetchCoinBySymbol = async (
  symbol: string
): Promise<Coin | undefined> => {
  const coins = await fetchCoins();
  return coins.find((coin) => coin.symbol.toLowerCase() === symbol.toLowerCase());
};

/**
 * Fetch coins that match the search term
 * @param searchTerm - The term to search for in coin name or symbol
 * @returns Promise<Coin[]> Array of matching coins
 */
export const searchCoins = async (searchTerm: string): Promise<Coin[]> => {
  const coins = await fetchCoins();
  const term = searchTerm.toLowerCase();
  return coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(term) ||
      coin.symbol.toLowerCase().includes(term)
  );
};

/**
 * Refresh prices for all coins
 * @returns Promise<void>
 */
export const refreshPrices = async (): Promise<PriceData[]> => {
  return fetchPrices();
};

