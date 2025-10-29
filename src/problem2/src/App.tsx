import { useState, useEffect } from "react";
import type { Coin } from "./api/coinService";
import { useCoinSwap } from "./hooks/useCoinSwap";
import { useCoinDropdown } from "./hooks/useCoinDropdown";
import { useSettings } from "./hooks/useSettings";
import { useBalanceValidation } from "./hooks/useBalanceValidation";
import { formatReceivedAmount } from "./utils/formatting";
import { Header } from "./components/Header";
import { CoinInput } from "./components/CoinInput";
import { SwapButton } from "./components/SwapButton";
import { TransferButton } from "./components/TransferButton";
import { CoinDropdown } from "./components/CoinDropdown";
import { GlobalStyles } from "./components/GlobalStyles";
import { LoadingScreen } from "./components/LoadingScreen";
import { SettingsModal } from "./components/SettingsModal";
import { TransferModal } from "./components/TransferModal";
import { ToastStack } from "./components/ToastStack";
import { showToast } from "./utils/toast";

/**
 * App Component - Main component cho swap interface
 *
 * Architecture:
 * - Custom Hooks: useCoinSwap, useCoinDropdown, useSettings, useBalanceValidation
 * - Components: Header, CoinInput, SwapButton, etc. (UI)
 * - Utils: formatting functions (business logic)
 */
function App() {
  // Fetch coins và quản lý swap logic
  const {
    coins,
    allCoins,
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
  } = useCoinSwap();

  // Quản lý dropdown
  // Use allCoins for filtering (will be filtered based on showList later)
  const {
    showList,
    setShowList,
    searchTerm,
    setSearchTerm,
    dropdownRef,
    filteredCoins,
    closeDropdown,
  } = useCoinDropdown(
    coins,
    allCoins,
    payCoin || undefined,
    receiveCoin || undefined
  );

  // Quản lý settings
  const {
    settings,
    setDecimalPlaces,
    setTheme,
    setShowUSDComparison,
    showModal,
    setShowModal,
  } = useSettings();

  // Validate balance
  const { isTransferDisabled, isZeroOrNegative } = useBalanceValidation({
    payCoin,
    amount,
  });

  // State để control TransferModal
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Update body background based on theme
  useEffect(() => {
    const themeClass = settings.theme === "dark" ? "dark" : "light";
    const bgClass = settings.theme === "dark" ? "bg-gray-950" : "bg-gray-100";
    document.body.className = `${themeClass} ${bgClass}`;
  }, [settings.theme]);

  // Xử lý khi chọn coin từ dropdown
  const handleSelectCoin = (coin: Coin) => {
    if (!payCoin || !receiveCoin) return;

    if (showList === "pay") {
      setPayCoin(coin);
    } else if (showList === "receive") {
      setReceiveCoin(coin);
    }

    closeDropdown();
  };

  // Xử lý swap coins
  const handleSwap = async () => {
    await swapCoins();
  };

  // Xử lý mở transfer modal
  const handleTransferClick = () => {
    if (isZeroOrNegative) {
      // Nếu amount = 0 -> show toast warning màu xanh
      showToast("Amount must be positive", "info");
      return;
    }

    if (isTransferDisabled) {
      // Nếu vượt balance -> show toast error
      showToast("Insufficient Balance", "error");
      return;
    }

    setShowTransferModal(true);
  };

  // Xử lý confirm transfer
  const handleConfirmTransfer = async () => {
    // Here you would normally call your transfer API
    console.log("Transfer confirmed!");
    // Show success message
    showToast("Transfer successful!", "success");
    // Refresh balances/coins from API (future-proof)
    await refreshCoins();
  };

  // Format received amount với decimal places từ settings
  const formattedReceivedAmount = formatReceivedAmount(
    receivedAmount,
    settings.decimalPlaces
  );

  // Loading state với loading screen đẹp hơn
  if (loading || !payCoin || !receiveCoin) {
    return <LoadingScreen theme={settings.theme} />;
  }

  return (
    <>
      <GlobalStyles />
      <section
        className={`flex flex-col items-center justify-center p-3 sm:p-5 rounded-xl border w-full max-w-[320px] xs:max-w-sm sm:max-w-md mx-2 sm:mx-auto relative overflow-hidden transition-all duration-500 ${
          settings.theme === "dark"
            ? "bg-[#151723] border-gray-400/10"
            : "bg-gray-50 border-gray-200 shadow-lg"
        }`}
      >
        {/* Header */}
        <Header
          onSettingsClick={() => setShowModal(true)}
          theme={settings.theme}
        />

        {/* You Pay Section */}
        <CoinInput
          label="You pay"
          amount={amount}
          coin={isSwapping ? null : payCoin}
          showBalance={true}
          showUSDComparison={settings.showUSDComparison}
          animate={false}
          onAmountChange={setAmount}
          onValidationError={(message) => showToast(message, "info")}
          theme={settings.theme}
          onCoinClick={() => setShowList(showList === "pay" ? null : "pay")}
        />

        {/* Swap Button */}
        <SwapButton onSwap={handleSwap} theme={settings.theme} />

        {/* You Receive Section */}
        <CoinInput
          label="You receive"
          amount=""
          coin={isSwapping ? null : receiveCoin}
          receivedAmount={formattedReceivedAmount}
          conversionRate={conversionRate}
          receiveCoin={payCoin}
          showBalance={true}
          readOnly={true}
          animate={false}
          theme={settings.theme}
          onCoinClick={() =>
            setShowList(showList === "receive" ? null : "receive")
          }
        />

        {/* Transfer Button - Disable khi overdraft trong unlock mode */}
        <TransferButton
          disabled={isTransferDisabled}
          onClick={handleTransferClick}
        />

        {/* Coin Selection Dropdown */}
        <CoinDropdown
          showList={showList}
          payCoin={payCoin}
          receiveCoin={receiveCoin}
          searchTerm={searchTerm}
          filteredCoins={filteredCoins}
          dropdownRef={dropdownRef}
          onSearchChange={setSearchTerm}
          onClose={closeDropdown}
          onSelectCoin={handleSelectCoin}
          theme={settings.theme}
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          decimalPlaces={settings.decimalPlaces}
          theme={settings.theme}
          showUSDComparison={settings.showUSDComparison}
          onDecimalPlacesChange={setDecimalPlaces}
          onThemeChange={setTheme}
          onToggleUSDComparison={setShowUSDComparison}
        />

        {/* Transfer Modal */}
        <TransferModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          onConfirm={handleConfirmTransfer}
          theme={settings.theme}
        />

        {/* Toast Stack */}
        <ToastStack />
      </section>
    </>
  );
}

export default App;
