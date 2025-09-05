import { 
  ChevronLeft, 
  Shield, 
  Clock,
  Gauge,
  Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Switch } from '../../../ui/switch';
import { Button } from '../../../ui/button';
import { BackToHomeButton } from "../../../ui/BackToHomeButton";
import { Popup } from "../../../ui/popup";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material/styles";
import { createCustomTheme } from "../../../../theme/muiTheme";
import { useApp } from "../../../../contexts/AppContext";
import dayjs from "dayjs";

export function ReserveBatteryPowerPage({ onBack, onGoHome }) {
  const { batteryState } = useApp();
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [hasShownOfflineModal, setHasShownOfflineModal] = useState(false);

  // Form state
  const [settings, setSettings] = useState({
    enabled: false,
    startTime: dayjs().hour(16).minute(0), // 4:00 PM
    endTime: dayjs().hour(19).minute(0), // 7:00 PM
    socReservePercent: 20, // State of Charge Reserve Percentage
  });

  // Show offline modal when battery is offline
  useEffect(() => {
    if (
      batteryState.isConfigured &&
      !batteryState.isOnline &&
      !hasShownOfflineModal
    ) {
      setShowOfflineModal(true);
    }
  }, [batteryState.isConfigured, batteryState.isOnline, hasShownOfflineModal]);

  const handleCloseOfflineModal = () => {
    setShowOfflineModal(false);
    setHasShownOfflineModal(true);
  };

  const formatTime = (time) => {
    return time.format("HH:mm");
  };

  const isDisabled = batteryState.isConfigured && !batteryState.isOnline;

  const handleSave = () => {
    if (isDisabled) return;

    const reserveData = {
      enabled: settings.enabled,
      startTime: settings.startTime.format("HH:mm"),
      endTime: settings.endTime.format("HH:mm"),
      socReservePercent: settings.socReservePercent,
    };
    console.log("Reserve Battery Power saved:", reserveData);
    // Here you would typically save to your backend/state management
    onBack();
  };

  const handleSliderChange = (value) => {
    if (!isDisabled) {
      setSettings({ ...settings, socReservePercent: value });
    }
  };

  return (
    <ThemeProvider theme={createCustomTheme("light")}>
      <div className="min-h-full bg-background">
        {/* Offline Modal */}
        <Popup
          isOpen={showOfflineModal}
          onClose={handleCloseOfflineModal}
          type="warning"
          icon={Info}
          title="System Offline"
          description="The system is currently offline. You can view the settings, but changes cannot be made until the system is back online."
          primaryButton={{
            text: "Understood",
            onClick: handleCloseOfflineModal,
          }}
        />

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
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-foreground font-semibold">
                Reserve Battery Power
              </h1>
              <p className="text-sm text-muted-foreground">
                Keep battery power in reserve
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 space-y-6 pb-24">
          {/* Main Toggle */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg text-card-foreground font-semibold">
                  Enable Battery Reserve Discharge
                </h3>
                <p className="text-sm text-muted-foreground">
                  Prevent battery from discharging below set level
                </p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) =>
                  !isDisabled && setSettings({ ...settings, enabled: checked })
                }
                disabled={isDisabled}
                className={isDisabled ? "opacity-50" : ""}
              />
            </div>
          </div>

          {/* Time Configuration */}
          {settings.enabled && (
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
              <h3 className="text-lg text-card-foreground font-semibold mb-4">
                Active Time Period
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Set when reserve protection is active
              </p>

              {/* Time Range Display */}
              <div className="text-center mb-8">
                <div className="text-2xl font-bold text-foreground">
                  {formatTime(settings.startTime)} -{" "}
                  {formatTime(settings.endTime)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Reserve protection period
                </p>
              </div>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="space-y-6">
                  {/* Start Time */}
                  <div
                    className={`bg-muted/10 rounded-2xl p-6 ${
                      isDisabled ? "opacity-50" : ""
                    }`}
                  >
                    <h4 className="text-md font-medium text-foreground mb-4 text-center">
                      Start Time
                    </h4>
                    <div className="flex justify-center">
                      <TimePicker
                        value={settings.startTime}
                        onChange={(newValue) =>
                          !isDisabled &&
                          setSettings({
                            ...settings,
                            startTime: newValue,
                          })
                        }
                        disabled={isDisabled}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      When reserve protection begins
                    </p>
                  </div>

                  {/* End Time */}
                  <div
                    className={`bg-muted/10 rounded-2xl p-6 ${
                      isDisabled ? "opacity-50" : ""
                    }`}
                  >
                    <h4 className="text-md font-medium text-foreground mb-4 text-center">
                      End Time
                    </h4>
                    <div className="flex justify-center">
                      <TimePicker
                        value={settings.endTime}
                        onChange={(newValue) =>
                          !isDisabled &&
                          setSettings({
                            ...settings,
                            endTime: newValue,
                          })
                        }
                        disabled={isDisabled}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      When reserve protection ends
                    </p>
                  </div>
                </div>
              </LocalizationProvider>
            </div>
          )}

          {/* SOC Reserve Percentage */}
          {settings.enabled && (
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
              <h3 className="text-lg text-card-foreground font-semibold mb-4 flex items-center">
                <Gauge className="w-5 h-5 text-green-500 mr-2" />
                SOC Reserve Percentage
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Set the minimum battery level to maintain
              </p>

              {/* Current Value Display */}
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-foreground">
                  {settings.socReservePercent}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Minimum battery level
                </p>
              </div>

              {/* Slider */}
              <div className={`space-y-4 ${isDisabled ? "opacity-50" : ""}`}>
                <div className="relative">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={settings.socReservePercent}
                    onChange={(e) =>
                      handleSliderChange(parseInt(e.target.value))
                    }
                    disabled={isDisabled}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                        ((settings.socReservePercent - 5) / 45) * 100
                      }%, #e2e8f0 ${
                        ((settings.socReservePercent - 5) / 45) * 100
                      }%, #e2e8f0 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>5%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Quick Select Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  {[10, 20, 30].map((percentage) => (
                    <button
                      key={percentage}
                      disabled={isDisabled}
                      onClick={() => handleSliderChange(percentage)}
                      className={`py-2 px-4 rounded-xl border transition-all duration-300 ${
                        settings.socReservePercent === percentage
                          ? "bg-green-500/10 border-green-500/20 text-green-500"
                          : "bg-muted/20 border-border text-foreground hover:bg-muted/30"
                      } ${isDisabled ? "cursor-not-allowed" : ""}`}
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Information Section */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
            <h3 className="text-lg text-card-foreground font-semibold mb-4 flex items-center">
              <Info className="w-5 h-5 text-green-500 mr-2" />
              How Reserve Battery Works
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong className="text-foreground">
                    Protection Period:
                  </strong>{" "}
                  Battery discharge is limited during the specified time period
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong className="text-foreground">SOC Reserve:</strong>{" "}
                  Battery will not discharge below the set percentage level
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong className="text-foreground">Emergency Power:</strong>{" "}
                  Ensures backup power is always available when needed
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              width="full"
              onClick={handleSave}
              disabled={isDisabled}
              className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
            >
              Save Settings
            </Button>

            <Button variant="secondary" size="lg" width="full" onClick={onBack}>
              Cancel
            </Button>
          </div>
        </div>

        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #10b981;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #10b981;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}</style>

        {/* Back to Home Button */}
        {onGoHome && (
          <div className="mt-8">
            <BackToHomeButton onGoHome={onGoHome} />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
