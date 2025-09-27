import React, { useState } from "react";
import { QrCode, Package, ArrowLeft, ArrowRight, Scan, LogOut, CheckCircle } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { Popup } from "./ui/popup";

export const SystemBinding = () => {
  const { nextOnboardingStep, logout, completeOnboarding } = useApp();
  const [selectedDevice, setSelectedDevice] = useState("");
  const [serialNumbers, setSerialNumbers] = useState(["", "", "", ""]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleLogout = () => {
    logout();
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
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
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
    const isSerialComplete = serialNumbers.every(num => num.length === 4);
    
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

  const isFormValid = selectedDevice !== "" && serialNumbers.every(num => num.length === 4);

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
      <div className="flex-1 px-6 space-y-6">
        {/* Device Selection */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-medium text-foreground">
            <Package className="w-4 h-4" />
            <span>Select Product Device</span>
          </label>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {deviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* QR Code Scan */}
        <div className="space-y-3">
          <button
            onClick={handleQRScan}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 transition-colors group"
          >
            <div className="bg-primary/20 p-2 rounded-full">
              <Scan className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Scan QR Code</div>
            </div>
          </button>
        </div>

        {/* Serial Number Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Device Serial Number
          </label>
          <div className="grid grid-cols-4 gap-3">
            {serialNumbers.map((value, index) => (
              <div key={index} className="relative">
                <input
                  id={`serial-${index}`}
                  type="text"
                  value={value}
                  onChange={(e) => handleSerialChange(index, e.target.value)}
                  className="w-full px-3 py-3 text-center text-lg font-mono rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxLength={4}
                  placeholder="0000"
                />
                {/* <div className="absolute -bottom-6 left-0 right-0 text-center">
                  <span className="text-xs text-muted-foreground">
                    {index === 0 ? "Batch" : index === 1 ? "Model" : index === 2 ? "Year" : "Unit"}
                  </span>
                </div> */}
              </div>
            ))}
          </div>
        </div>

        {/* Device Info */}
        {selectedDevice && (
          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="font-medium text-foreground mb-2">
              Device Information
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Model: {selectedDevice}</p>
              <p>Type: Energy Monitoring Device</p>
              <p>Status: Ready for binding</p>
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="px-6 py-6 border-t border-border">
        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isFormValid
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {!isFormValid && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Please select a device and enter complete serial number
          </p>
        )}
      </div>

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
          variant: "primary"
        }}
        secondaryButton={{
          text: "Close",
          onClick: handleCloseModal,
          variant: "secondary"
        }}
      >
        {/* System Information Details */}
        <div className="bg-card rounded-lg p-4 border border-border space-y-3 text-left">
          <h4 className="font-medium text-foreground text-sm">System Information</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Device Model:</span>
              <span className="text-foreground">{selectedDevice}</span>
            </div>
            <div className="flex justify-between">
              <span>Serial Number:</span>
              <span className="text-foreground font-mono">{serialNumbers.join("-")}</span>
            </div>
            <div className="flex justify-between">
              <span>Device Type:</span>
              <span className="text-foreground">Energy Monitor</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-600 dark:text-green-400">Connected</span>
            </div>
            <div className="flex justify-between">
              <span>Binding Date:</span>
              <span className="text-foreground">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};