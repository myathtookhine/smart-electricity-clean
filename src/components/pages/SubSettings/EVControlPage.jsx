import {
  Car,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sun,
  Clock,
  HelpCircle,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { BackToHomeButton } from "../../ui/BackToHomeButton";
import { SelectChargeModeModal } from "./EVControl/SelectChargeModeModal";
import { ChargingSchedulePage } from "./EVControl/ChargingSchedulePage";
import { TariffSettingPage } from "./EVControl/TariffSettingPage";

export function EVControlPage({ onBack, onGoHome }) {
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [showTariffSettings, setShowTariffSettings] = useState(false);
  const [currentScheduleMode, setCurrentScheduleMode] = useState(null);
  const [selectedMode, setSelectedMode] = useState("charge-now"); // Default mode
  const [tariffConfigured, setTariffConfigured] = useState(false);
  const [currentTariff, setCurrentTariff] = useState(null);
  const [chargingSchedule, setChargingSchedule] = useState(null);
  const [isCharging, setIsCharging] = useState(true);

  const chargingModes = {
    "charge-now": {
      name: "Charge Now",
      icon: Zap,
      color: "blue",
      hasScheduling: true,
    },
    "pure-green": {
      name: "Solar Charge",
      icon: Sun,
      color: "green",
      hasScheduling: false,
    },
    "tariff-intelligence": {
      name: "Tariff Intelligence",
      icon: Clock,
      color: "green",
      hasScheduling: true,
    },
  };

  const handleModeSelect = (mode) => {
    if (mode === "tariff-intelligence" && !tariffConfigured) {
      // Don't set the mode yet, wait for setup completion
      return;
    }
    setSelectedMode(mode);
    setShowModeSelection(false);
  };

  const handleSetupTariff = () => {
    setShowModeSelection(false);
    setShowTariffSettings(true);
  };

  const handleTariffComplete = (tariffData) => {
    setTariffConfigured(true);
    setCurrentTariff(tariffData);
    setSelectedMode("tariff-intelligence");
    setShowTariffSettings(false);
  };

  const handleScheduleComplete = (scheduleData) => {
    setChargingSchedule(scheduleData);
    setShowScheduling(false);
  };

  const handleScheduleClick = (mode) => {
    setCurrentScheduleMode(mode);
    if (mode === "tariff-intelligence") {
      setShowTariffSettings(true);
    } else {
      setShowScheduling(true);
    }
  };

  const selectedModeData = chargingModes[selectedMode];
  const IconComponent = selectedModeData.icon;

  // Helper function to get color classes
  const getColorClasses = (mode) => {
    switch (mode) {
      case "charge-now":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          text: "text-blue-500",
          bgSolid: "bg-blue-500",
          bgHover: "hover:bg-blue-600",
        };
      case "pure-green":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          text: "text-green-500",
          bgSolid: "bg-green-500",
          bgHover: "hover:bg-green-600",
        };
      case "tariff-intelligence":
        return {
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
          text: "text-purple-500",
          bgSolid: "bg-purple-500",
          bgHover: "hover:bg-purple-600",
        };
      default:
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          text: "text-blue-500",
          bgSolid: "bg-blue-500",
          bgHover: "hover:bg-blue-600",
        };
    }
  };

  const currentColors = getColorClasses(selectedMode);

  if (showModeSelection) {
    return (
      <SelectChargeModeModal
        isOpen={showModeSelection}
        onClose={() => setShowModeSelection(false)}
        onModeSelect={handleModeSelect}
        chargingModes={chargingModes}
        selectedMode={selectedMode}
        tariffConfigured={tariffConfigured}
        onSetupTariff={handleSetupTariff}
      />
    );
  }

  if (showScheduling) {
    return (
      <ChargingSchedulePage
        mode={currentScheduleMode}
        modeData={chargingModes[currentScheduleMode]}
        onBack={() => setShowScheduling(false)}
        onComplete={handleScheduleComplete}
        onGoHome={onGoHome}
        tariffName={currentTariff?.name}
      />
    );
  }

  if (showTariffSettings) {
    return (
      <TariffSettingPage
        onBack={() => setShowTariffSettings(false)}
        onComplete={handleTariffComplete}
        onGoHome={onGoHome}
      />
    );
  }

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
            <Car className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-foreground font-semibold">
              EV Control
            </h1>
            <p className="text-sm text-muted-foreground">
              Electric Vehicle Charging
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-32">
        {/* Current Charging Mode */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-card-foreground font-semibold">
              Current Charging Mode
            </h3>
          </div>

          <div
            className={`${currentColors.bg} ${currentColors.border} rounded-2xl p-6`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 ${currentColors.bg} rounded-xl`}>
                <IconComponent className={`w-5 h-5 ${currentColors.text}`} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-card-foreground">
                  {selectedModeData.name}
                </h4>
              </div>
              <div
                className={`w-8 h-8 ${currentColors.bgSolid} rounded-full flex items-center justify-center`}
              >
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Show tariff name and schedule times if Tariff Intelligence is selected */}
            {selectedMode === "tariff-intelligence" && currentTariff && (
              <div className="mt-3 pt-3 border-t border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Active Tariff:
                  </span>
                  <span className="text-sm font-medium text-purple-600 bg-purple-500/10 px-2 py-1 rounded-lg">
                    Low-Cost Period
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Schedule:</span>
                  <span className="font-medium text-foreground">
                    {currentTariff.lowCostStartTime} -{" "}
                    {currentTariff.lowCostEndTime}
                  </span>
                </div>
              </div>
            )}

            {/* Show charging schedule if Charge Now mode and schedule is set */}
            {selectedMode === "charge-now" && chargingSchedule && (
              <div className="mt-3 pt-3 border-t border-blue-500/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Schedule:</span>
                  <span className="font-medium text-foreground">
                    {chargingSchedule.startTime} - {chargingSchedule.endTime}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline-primary"
            width="full"
            onClick={() => setShowModeSelection(true)}
            className="flex items-center gap-2 mt-4"
          >
            <span>Change Mode</span>
            {/* <ChevronRight className="w-4 h-4" /> */}
          </Button>
        </div>

        {/* Live Charging View */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <h3 className="text-xl text-card-foreground font-semibold mb-4">
            Mode Info
          </h3>

          <div className="space-y-4">
            {/* Charge Now mode  */}
            {selectedMode === "charge-now" && (
              <div className="pt-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-2">
                      Immediate Charging
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      This mode begins charging immediately. You can set up
                      schedules with scroll wheel time selection, charge rate
                      slider (1.4-7.2 kW), and frequency options that mirror the
                      battery scheduling interface.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pure Green mode  */}
            {selectedMode === "pure-green" && (
              <div className="pt-4">
                <div className="flex items-start space-x-3">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Solar-Only Charging
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      This mode only charges when solar generation exceeds
                      1.4kW. No grid power will be used, ensuring completely
                      green charging.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedMode === "tariff-intelligence" && !tariffConfigured && (
              <div className="pt-4">
                <div className="flex items-start space-x-3">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Setup Required
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      To use Tariff Intelligence, please configure your
                      electricity tariff settings.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setShowTariffSettings(true)}
                    >
                      Configure Tariff
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {selectedMode === "tariff-intelligence" && tariffConfigured && (
              <div className="pt-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-2">
                      Smart Tariff Charging
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      This mode charges during the cheapest electricity rates
                      based on your tariff settings. Set up schedules using the
                      same intuitive interface as battery scheduling.
                    </p>

                    {/* Tariff Settings Button */}
                    <Button
                      width="full"
                      variant="outline-primary"
                      onClick={() => handleScheduleClick(selectedMode)}
                      className={`flex items-center gap-2 ${currentColors.text} hover:${currentColors.text} ${currentColors.border} hover:${currentColors.bg}`}
                    >
                      <Clock className="w-4 h-4" />
                      Tariff Settings
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Charging Controls at Bottom */}
        <div className="bg-background/80 backdrop-blur-xl">
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-5 shadow-2xl border border-border/50 max-w-2xl mx-auto">
            {!isCharging ? (
              <Button
                variant="primary"
                width="full"
                onClick={() => setIsCharging(true)}
                className="flex items-center justify-center gap-2 text-base py-6"
              >
                <Zap className="w-5 h-5" />
                <span>Start Charging Now</span>
              </Button>
            ) : (
              <div>
                <div className="flex items-center mb-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 w-12 h-12 bg-blue-500/40 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-12 h-12 bg-blue-500/60 rounded-full animate-pulse"></div>
                    <Zap className="absolute inset-0 w-6 h-6 text-blue-500 m-auto animate-pulse" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-base font-semibold text-foreground">
                      Charging in Progress
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Your EV is currently charging...
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  width="full"
                  onClick={() => setIsCharging(false)}
                  className="flex items-center justify-center gap-2"
                >
                  <span>Stop Charging</span>
                </Button>
              </div>
            )}
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
