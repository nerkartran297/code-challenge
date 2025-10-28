# Code Challenge Solutions

This repository contains solutions to three coding challenges.

---

## Problem 1: Sum to N

**Challenge:** Implement 3 different ways to calculate the sum from 1 to n.

### Solutions:

**Method A: Iterative Loop**

- Time Complexity: O(n)
- Space Complexity: O(1)
- Uses a simple for loop to iterate and accumulate the sum

```javascript
var sum_to_n_a = function (n) {
  var sum = 0;
  for (let i = 0; i <= n; i++) {
    sum += i;
  }
  return sum;
};
```

**Method B: Mathematical Formula**

- Time Complexity: O(1)
- Space Complexity: O(1)
- Uses the arithmetic series formula: n(n+1)/2
- **Most efficient solution**

```javascript
var sum_to_n_b = function (n) {
  return (n * (n + 1)) / 2;
};
```

**Method C: Recursive**

- Time Complexity: O(n)
- Space Complexity: O(n) (due to call stack)
- Uses recursion to calculate the sum

```javascript
var sum_to_n_c = function (n) {
  return n === 0 ? 0 : n + sum_to_n_c(n - 1);
};
```

---

## Problem 2: Coin Swap Interface

**Live Demo:** https://code-challenge-lovat.vercel.app

### Current Features:

✅ **Real-time Calculation**

- Real-time calculation of received amount based on conversion rate
- Conversion rate displayed with `useMemo` optimization
- Automatic calculation whenever input changes

✅ **Coin Selection & Swapping**

- Click on coin icon to open dropdown with 20+ cryptocurrencies
- Search functionality for quick coin selection
- Swap button to reverse pay/receive coins
- Loading state (0.3s) during swap operation with spinner animation

✅ **Balance Management**

- Lock/Unlock mode for balance enforcement
- Shows balance for each coin in dropdown
- Balance validation prevents overspending
- Refresh balances after successful transfer

✅ **User Interface**

- Dark/Light theme switching
- Settings modal with customizable decimal places
- Currently selected coin shows at the top of the dropdown list
- Fixed height UI components to prevent layout shifts
- Responsive design for mobile and desktop

✅ **Transfer Flow**

- Input validation (must be positive amount)
- OTP confirmation modal (enter "123456")
- Toast notifications for success/error
- Multi-click prevention (400ms cooldown) on all buttons

✅ **UX Enhancements**

- Toast notifications with custom icons (error.svg, success.svg, info.svg)
- No text truncation for large received amounts
- Balance displayed with 4 decimal places in dropdown
- Fixed height sections to prevent layout shifts when toggling USD comparison
- Proper text color handling in light/dark themes for OTP error states

✅ **Performance**

- Selective `useMemo` optimization for conversion rate
- Efficient API integration with Switcheo prices
- Settings persisted in localStorage
- Optimized re-renders with React Hooks

✅ **Architecture**

- Custom Hooks pattern (`useCoinSwap`, `useCoinDropdown`, `useSettings`, `useBalanceValidation`)
- Reusable components (`CoinInput`, `CoinDropdown`, `TransferButton`, etc.)
- Centralized API service (`coinService.ts`)
- Utility functions for formatting and toast notifications

---

## Problem 3: Wallet Balance Optimization

**Challenge:** Optimize a React component that displays and sorts cryptocurrency wallet balances.

### Performance Impact

**Before:**

- Filter and sort: O(n log n) on EVERY render
- getPriority called: 2n times (filter + sort comparisons)
- Rows recreated on every parent re-render
- Unnecessary recalculation when prices change

**After:**

- Filter and sort: O(n log n) only when balances change
- getPriority called: 1n times (compute once, reuse)
- Rows memoized - only recreate when balances or prices change
- Prices changes don't trigger unnecessary filtering/sorting

### Optimizations Applied:

1. ✅ Moved `getPriority` function outside component (prevent recreation on every render)
2. ✅ Fixed inverted filter logic (now correctly keeps positive amounts only)
3. ✅ Corrected `useMemo` dependencies (removed unnecessary `prices`)
4. ✅ Replaced index-based keys with unique currency keys
5. ✅ Memoized rows generation to prevent unnecessary JSX creation
6. ✅ Added tie-breaker in sort for stable ordering
7. ✅ Handled undefined prices to prevent NaN
8. ✅ Fixed type mismatches and improved type safety

**Result:** Significantly reduced unnecessary re-renders and recalculations, improving performance especially when parent components update frequently (e.g., settings changes, dropdown interactions).

---

## Technologies Used

- **React** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Custom React Hooks** for state management
- **localStorage** for persistent settings

---

## Quick Start

### Problem 1

```bash
cd problem1
node problem-1.js
```

### Problem 2

```bash
cd problem2
npm install
npm run dev
```

### Problem 3

```bash
cd problem3
# View OptimizedPage.tsx for the optimized solution
```

---

## Project Structure

```
src/
├── problem1/           # Sum to n solutions
├── problem2/           # Coin swap interface
│   ├── src/
│       ├── api/        # API services
│       ├── components/ # React components
│       ├── hooks/      # Custom hooks
│       └── utils/      # Utility functions
│   
└── problem3/           # Wallet balance optimization
    ├── OptimizedPage.tsx

```

---

**Author:** [Your Name]  
**Date:** 2024
