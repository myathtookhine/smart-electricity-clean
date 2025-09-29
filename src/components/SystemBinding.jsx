import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  Package,
  ArrowLeft,
  ArrowRight,
  Scan,
  LogOut,
  CheckCircle,
  Home,
  Zap,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "./ThemeProvider";
import { Popup } from "./ui/popup";
import HomeGraphicDark from "../assets/home-dark-mode.svg";
import HomeGraphicLight from "../assets/home-light-mode.svg";

export const SystemBinding = () => {
  const { nextOnboardingStep, logout, completeOnboarding } = useApp();
  const { theme } = useTheme();
  const [selectedDevice, setSelectedDevice] = useState("");
  const [serialNumbers, setSerialNumbers] = useState(["", "", "", ""]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  const handleLogout = () => {
    logout();
  };

  const handleStartSetup = () => {
    setShowWelcomeScreen(false);
  };

  const deviceOptions = [
    { value: "", label: "Select a device model" },
    { value: "P100", label: "P100 - Standard Energy Monitor" },
    { value: "P120", label: "P120 - Advanced Energy Monitor" },
    { value: "P150", label: "P150 - Premium Energy Monitor" },
    { value: "P200", label: "P200 - Commercial Energy Monitor" },
  ];

  const handleSerialChange = (index, value) => {
    // Only allow numeric input and max 4 characters
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    const newSerialNumbers = [...serialNumbers];
    newSerialNumbers[index] = numericValue;
    setSerialNumbers(newSerialNumbers);

    // Auto-focus next input when current is filled
    if (numericValue.length === 4 && index < 3) {
      const nextInput = document.getElementById(`serial-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleQRScan = () => {
    // Mock QR scan functionality - in real app, this would open camera
    // For demo, we'll populate with sample data
    setSerialNumbers(["1234", "5678", "9012", "3456"]);
  };

  const handleContinue = () => {
    const isDeviceSelected = selectedDevice !== "";
    const isSerialComplete = serialNumbers.every((num) => num.length === 4);

    if (isDeviceSelected && isSerialComplete) {
      setShowSuccessModal(true);
    }
  };

  const handleContinueToApp = () => {
    setShowSuccessModal(false);
    completeOnboarding();
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const isFormValid =
    selectedDevice !== "" && serialNumbers.every((num) => num.length === 4);

  // Welcome Screen Component
  if (showWelcomeScreen) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header with Logout */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* Welcome Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-8">
          {/* Welcome Icon */}
          <motion.div
            className="bg-primary/10 p-6 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img
              src={theme === "dark" ? HomeGraphicDark : HomeGraphicLight}
              alt="Home Graphic"
              className="w-full h-auto max-w-xs"
            />
          </motion.div>

          {/* Welcome Title */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-bold text-foreground">
              Welcome to Duracell
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Your smart energy monitoring system is not set up yet.
            </p>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            className="bg-card rounded-lg p-6 border border-border max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-medium text-foreground">
                System Setup Required
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              To start monitoring your energy usage, you need to bind your
              device to the system first. This process will connect your energy
              monitoring device and configure it for optimal performance.
            </p>
          </motion.div>

          {/* Start Setup Button */}
          <motion.button
            onClick={handleStartSetup}
            className="w-full max-w-md flex items-center justify-center space-x-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Start Setup Now</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">System Binding</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Connect your device to start monitoring your energy usage
        </p>
      </div>

      {/* Content */}
      <motion.div
        className="flex-1 px-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Device Selection */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <label className="flex items-center space-x-2 text-sm font-medium text-foreground">
            <Package className="w-4 h-4" />
            <span>Select Product Device</span>
          </label>
          <motion.select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {deviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </motion.select>
        </motion.div>

        {/* QR Code Scan */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <motion.button
            onClick={handleQRScan}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 transition-colors group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-primary/20 p-2 rounded-full">
              <Scan className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Scan QR Code</div>
            </div>
          </motion.button>
        </motion.div>

        {/* Serial Number Input */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <label className="text-sm font-medium text-foreground">
            Device Serial Number
          </label>
          <div className="grid grid-cols-4 gap-3">
            {serialNumbers.map((value, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.4 + index * 0.1,
                  ease: "easeOut",
                }}
              >
                <motion.input
                  id={`serial-${index}`}
                  type="text"
                  value={value}
                  onChange={(e) => handleSerialChange(index, e.target.value)}
                  className="w-full px-3 py-3 text-center text-lg font-mono rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxLength={4}
                  placeholder="0000"
                  whileFocus={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Device Info */}
        {selectedDevice && (
          <motion.div
            className="bg-card rounded-lg p-4 border border-border"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h3 className="font-medium text-foreground mb-2">
              Device Information
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Model: {selectedDevice}</p>
              <p>Type: Energy Monitoring Device</p>
              <p>Status: Ready for binding</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Continue Button */}
      <motion.div
        className="px-6 py-6 border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      >
        <motion.button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isFormValid
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
          whileHover={isFormValid ? { scale: 1.02 } : {}}
          whileTap={isFormValid ? { scale: 0.98 } : {}}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        {!isFormValid && (
          <motion.p
            className="text-xs text-muted-foreground text-center mt-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            Please select a device and enter complete serial number
          </motion.p>
        )}
      </motion.div>

      {/* Success Modal */}
      <Popup
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        type="success"
        icon={CheckCircle}
        title="System Binding Successful!"
        description="Your device has been successfully connected and configured."
        primaryButton={{
          text: "Continue",
          onClick: handleContinueToApp,
          variant: "primary",
        }}
        secondaryButton={{
          text: "Close",
          onClick: handleCloseModal,
          variant: "secondary",
        }}
      >
        {/* System Information Details */}
        <div className="bg-card rounded-lg p-4 border border-border space-y-3 text-left">
          <h4 className="font-medium text-foreground text-sm">
            System Information
          </h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Device Model:</span>
              <span className="text-foreground">{selectedDevice}</span>
            </div>
            <div className="flex justify-between">
              <span>Serial Number:</span>
              <span className="text-foreground font-mono">
                {serialNumbers.join("-")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Device Type:</span>
              <span className="text-foreground">Energy Monitor</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-600 dark:text-green-400">
                Connected
              </span>
            </div>
            <div className="flex justify-between">
              <span>Binding Date:</span>
              <span className="text-foreground">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};