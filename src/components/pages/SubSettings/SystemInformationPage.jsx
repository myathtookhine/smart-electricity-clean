import { Info, ChevronLeft, Battery, Zap, Copy, Settings } from "lucide-react";
import { BackToHomeButton } from "../../ui/BackToHomeButton";
import { useState } from "react";

export function SystemInformationPage({ onBack, onGoHome }) {
  const [copyStatus, setCopyStatus] = useState({});
  const [debugMode, setDebugMode] = useState(false);
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(true);

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development";

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ ...copyStatus, [key]: true });
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [key]: false });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

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
            <Info className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl text-foreground font-semibold">
              System Information
            </h1>
            <p className="text-sm text-muted-foreground">Device Details</p>
          </div>
        </div>
      </div>

      {/* Debug Controls - Only visible in development */}
      {isDevelopment && (
        <div className="px-6 mb-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Debug Controls (Development Only)
                </span>
              </div>
              <button
                onClick={() => setDebugMode(!debugMode)}
                className="text-xs px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-lg hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-all duration-200"
              >
                {debugMode ? "Hide" : "Show"}
              </button>
            </div>

            {debugMode && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    Device Registration Status:
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsDeviceRegistered(true)}
                      className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                        isDeviceRegistered
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      Registered
                    </button>
                    <button
                      onClick={() => setIsDeviceRegistered(false)}
                      className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                        !isDeviceRegistered
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      Not Registered
                    </button>
                  </div>
                </div>

                <div className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                  <strong>Usage:</strong> Toggle between registered and
                  unregistered states to test different UI scenarios. This panel
                  is only visible in development mode.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-24">
        {!isDeviceRegistered ? (
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 shadow border border-border/50 text-center">
            <div className="text-muted-foreground text-lg font-medium mb-4">
              Device not registered!
            </div>
            {isDevelopment && (
              <div className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-xl">
                <p className="mb-2">
                  <strong>Debug Info:</strong> This state simulates when a
                  device hasn't been registered yet.
                </p>
                <p className="text-xs">
                  In production, this would typically show instructions for
                  device registration or contact information for support.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Battery Details Card */}
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Battery className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl text-card-foreground font-semibold">
                  Battery Details
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Serial Number:
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-card-foreground font-mono text-xl">
                      BAT123456
                    </span>
                    <button
                      onClick={() => copyToClipboard("BAT123456", "battery")}
                      className="p-2 hover:bg-muted/30 rounded-lg transition-all duration-200"
                      title="Copy serial number"
                    >
                      <Copy
                        className={`w-4 h-4 ${
                          copyStatus.battery
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Model:
                  </label>
                  <div className="">
                    <span className="text-card-foreground text-xl">Dura5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Diverter Details Card */}
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl text-card-foreground font-semibold">
                  Diverter Details
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Serial Number:
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-card-foreground font-mono text-xl">
                      DIV789123
                    </span>
                    <button
                      onClick={() => copyToClipboard("DIV789123", "diverter")}
                      className="p-2 hover:bg-muted/30 rounded-lg transition-all duration-200"
                      title="Copy serial number"
                    >
                      <Copy
                        className={`w-4 h-4 ${
                          copyStatus.diverter
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Model:
                  </label>
                  <div className="">
                    <span className="text-card-foreground text-xl">
                      DuraDiverter
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Information Card */}
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl text-card-foreground font-semibold">
                  Service Information
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Installer Name:
                  </label>
                  <div className="">
                    <span className="text-card-foreground">John Smith</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Installation Date:
                  </label>
                  <div className="">
                    <span className="text-card-foreground">March 15, 2024</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Contact Number:
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-card-foreground font-mono">
                      +1 (555) 123-4567
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard("+1 (555) 123-4567", "contact")
                      }
                      className="p-2 hover:bg-muted/30 rounded-lg transition-all duration-200"
                      title="Copy contact number"
                    >
                      <Copy
                        className={`w-4 h-4 ${
                          copyStatus.contact
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

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
