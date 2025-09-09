import { 
  ChevronLeft, 
  Cloud, 
  Zap,
  Shield,
  Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Switch } from '../../../ui/switch';
import { Button } from '../../../ui/button';
import { BackToHomeButton } from "../../../ui/BackToHomeButton";
import { Popup } from "../../../ui/popup";
import { useApp } from "../../../../contexts/AppContext";

export function StormReadyModePage({ onBack, onGoHome }) {
  const { batteryState } = useApp();
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [hasShownOfflineModal, setHasShownOfflineModal] = useState(false);

  // Form state
  const [settings, setSettings] = useState({
    enabled: false,
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

  const isDisabled = batteryState.isConfigured && !batteryState.isOnline;

  const handleSave = () => {
    if (isDisabled) return;

    const stormReadyData = {
      enabled: settings.enabled,
    };
    console.log("StormReady Mode saved:", stormReadyData);
    // Here you would typically save to your backend/state management
    onBack();
  };

  return (
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
            <Cloud className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-foreground font-semibold">
              StormReady Mode
            </h1>
            <p className="text-sm text-muted-foreground">
              Prepare for severe weather events
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
                Enable StormReady Mode
              </h3>
              <p className="text-sm text-muted-foreground">
                Automatically prepare battery for storms
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

        {/* Status Display */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <h3 className="text-lg text-card-foreground font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 text-amber-500 mr-2" />
            Current Status
          </h3>
          <div
            className={`p-4 rounded-2xl ${
              settings.enabled
                ? "bg-amber-500/10 border border-amber-500/20"
                : "bg-muted/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    settings.enabled ? "bg-amber-500" : "bg-muted-foreground"
                  }`}
                ></div>
                <span
                  className={`font-medium ${
                    settings.enabled
                      ? "text-amber-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {settings.enabled
                    ? "StormReady Active"
                    : "StormReady Inactive"}
                </span>
              </div>
              {settings.enabled && <Zap className="w-5 h-5 text-amber-500" />}
            </div>
            <p
              className={`text-sm mt-2 ${
                settings.enabled ? "text-amber-600/80" : "text-muted-foreground"
              }`}
            >
              {settings.enabled
                ? "Your battery is prepared for severe weather conditions"
                : "StormReady mode is currently disabled"}
            </p>
          </div>
        </div>

        {/* What StormReady Does */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <h3 className="text-lg text-card-foreground font-semibold mb-4 flex items-center">
            <Info className="w-5 h-5 text-amber-500 mr-2" />
            What StormReady Mode Does
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Full Battery Charge
                </h4>
                <p className="text-sm text-muted-foreground">
                  Automatically charges your battery to 100% when severe weather
                  is forecasted
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Power Outage Protection
                </h4>
                <p className="text-sm text-muted-foreground">
                  Ensures maximum backup power availability during grid outages
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <Cloud className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Weather Monitoring
                </h4>
                <p className="text-sm text-muted-foreground">
                  Monitors weather forecasts and activates automatically when
                  storms approach
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        {/* <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <h3 className="text-lg text-card-foreground font-semibold mb-4">
            How It Works
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <p>
                <strong className="text-foreground">Weather Detection:</strong>{" "}
                The system monitors local weather forecasts for severe weather
                alerts
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <p>
                <strong className="text-foreground">Automatic Charging:</strong>{" "}
                When a storm is detected, the battery begins charging to full
                capacity
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <p>
                <strong className="text-foreground">Ready for Outages:</strong>{" "}
                Your home has maximum backup power available during the storm
              </p>
            </div>
          </div>
        </div> */}

        {/* Important Notes */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-2">
                Important Notes
              </h4>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>
                  • StormReady mode may override other charging schedules during
                  severe weather
                </li>
                <li>
                  • The system will return to normal operation after the weather
                  alert expires
                </li>
                <li>
                  • Ensure your battery system is properly maintained for
                  optimal performance
                </li>
              </ul>
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
