import {
  Battery,
  Shield,
  Cloud,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../../../contexts/AppContext";
import { BackToHomeButton } from "../../ui/BackToHomeButton";
import {
  ScheduledChargePage,
  ReserveBatteryPowerPage,
  StormReadyModePage,
} from "./BatteryControl";

export function BatteryPage({ onBack, onGoHome }) {
  const { batteryState, setBatteryState } = useApp();
  const [currentPage, setCurrentPage] = useState("main");

  // Handle navigation to sub-pages
  const handleNavigation = (page) => {
    if (!batteryState.isConfigured) return; // Prevent navigation if battery not configured
    setCurrentPage(page);
  };

  // Handle back navigation
  const handleBackFromSubPage = () => {
    setCurrentPage("main");
  };

  // Render sub-pages
  if (currentPage === "scheduled-charge") {
    return (
      <ScheduledChargePage onBack={handleBackFromSubPage} onGoHome={onGoHome} />
    );
  }

  if (currentPage === "reserve-battery") {
    return (
      <ReserveBatteryPowerPage
        onBack={handleBackFromSubPage}
        onGoHome={onGoHome}
      />
    );
  }

  if (currentPage === "storm-ready") {
    return (
      <StormReadyModePage onBack={handleBackFromSubPage} onGoHome={onGoHome} />
    );
  }

  // Main Battery Page
  return (
    <div className="min-h-full bg-background">
      {/* Header with Back Button */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center space-x-3 mb-2">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-muted/20 rounded-xl flex items-center justify-center hover:bg-muted/30 transition-all duration-300 mr-2"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Battery className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl text-foreground font-semibold">
              Battery configuration
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure battery usage
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-24">
        {/* Battery Status Display */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <h3 className="text-lg text-card-foreground font-semibold mb-4">
            System Status
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  batteryState.isConfigured
                    ? batteryState.isOnline
                      ? "bg-green-500"
                      : "bg-orange-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="text-card-foreground font-medium">
                {batteryState.isConfigured
                  ? batteryState.isOnline
                    ? "Online & Ready"
                    : "Configured but Offline"
                  : "Not Configured"}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {batteryState.isConfigured
              ? batteryState.isOnline
                ? "All battery features are available"
                : "Battery features are view-only while system is offline"
              : "Battery system needs to be configured before use"}
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <h3 className="text-xl text-card-foreground font-semibold mb-4">
            Battery Controls
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => handleNavigation("scheduled-charge")}
              disabled={!batteryState.isConfigured}
              className={`w-full flex items-center justify-between py-4 bg-muted/20 rounded-2xl transition-all duration-300 ${
                batteryState.isConfigured
                  ? "hover:bg-muted/30 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-xl ${
                    batteryState.isConfigured ? "bg-primary/10" : "bg-muted/20"
                  }`}
                >
                  <Battery
                    className={`w-5 h-5 ${
                      batteryState.isConfigured
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    batteryState.isConfigured
                      ? "text-card-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Scheduled Charge
                </span>
              </div>
              {batteryState.isConfigured && (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => handleNavigation("reserve-battery")}
              disabled={!batteryState.isConfigured}
              className={`w-full flex items-center justify-between py-4 bg-muted/20 rounded-2xl transition-all duration-300 ${
                batteryState.isConfigured
                  ? "hover:bg-muted/30 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-xl ${
                    batteryState.isConfigured ? "bg-primary/10" : "bg-muted/20"
                  }`}
                >
                  <Shield
                    className={`w-5 h-5 ${
                      batteryState.isConfigured
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    batteryState.isConfigured
                      ? "text-card-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Reserve Battery Power
                </span>
              </div>
              {batteryState.isConfigured && (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => handleNavigation("storm-ready")}
              disabled={!batteryState.isConfigured}
              className={`w-full flex items-center justify-between py-4 bg-muted/20 rounded-2xl transition-all duration-300 ${
                batteryState.isConfigured
                  ? "hover:bg-muted/30 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-xl ${
                    batteryState.isConfigured ? "bg-primary/10" : "bg-muted/20"
                  }`}
                >
                  <Cloud
                    className={`w-5 h-5 ${
                      batteryState.isConfigured
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    batteryState.isConfigured
                      ? "text-card-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  StormReady Mode
                </span>
              </div>
              {batteryState.isConfigured && (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Debug Controls (for testing different scenarios) */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <h3 className="text-lg text-card-foreground font-semibold mb-4">
            Debug Controls (Development)
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() =>
                setBatteryState({ isConfigured: true, isOnline: true })
              }
              className="py-2 px-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl hover:bg-green-500/20 transition-colors text-sm"
            >
              Set: Online & Configured
            </button>
            <button
              onClick={() =>
                setBatteryState({ isConfigured: true, isOnline: false })
              }
              className="py-2 px-4 bg-orange-500/10 border border-orange-500/20 text-orange-600 rounded-xl hover:bg-orange-500/20 transition-colors text-sm"
            >
              Set: Configured but Offline
            </button>
            <button
              onClick={() =>
                setBatteryState({ isConfigured: false, isOnline: false })
              }
              className="py-2 px-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl hover:bg-red-500/20 transition-colors text-sm"
            >
              Set: Not Configured
            </button>
          </div>
        </div>

        {/* Back to Home Button */}
        {onGoHome && (
          <div className="mt-8">
            <BackToHomeButton onGoHome={onGoHome} />
          </div>
        )}
      </div>
    </div>
  );
}
