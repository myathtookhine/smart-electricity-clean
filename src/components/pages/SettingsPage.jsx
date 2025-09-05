import {
  Settings,
  User,
  Bell,
  Shield,
  HelpCircle,
  Moon,
  Sun,
  Smartphone,
  Car,
  Info,
  Cloud,
  Battery,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { Switch } from "../ui/switch";
import { useApp } from "../../contexts/AppContext";
import { useState, useEffect } from "react";
import {
  SystemInformationPage,
  BatteryPage,
  EVControlPage,
  AccountSettingsPage,
  EditAccountPage,
  ChangePasswordPage,
  AdditionalSupportPage,
  UserGuidesPage,
  FAQsPage,
  HelpSupportPage,
} from "./SubSettings";

export function SettingsPage({ onSubPageChange, onPageChange }) {
  const { theme, setTheme } = useTheme();
  const { user, logout, batteryState } = useApp();
  const [currentView, setCurrentView] = useState("main"); // 'main', 'system-info', 'battery', 'ev-control', 'account-settings', 'edit-account', 'change-password', 'additional-support', 'user-guides', 'faqs', 'help-support'
  const [navigationStack, setNavigationStack] = useState(["main"]);

  // Notify parent about sub-page state
  useEffect(() => {
    if (onSubPageChange) {
      onSubPageChange(currentView !== "main");
    }
  }, [currentView, onSubPageChange]);

  const navigateBack = () => {
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop();
      setNavigationStack(newStack);
      setCurrentView(newStack[newStack.length - 1]);
    } else {
      setCurrentView("main");
      setNavigationStack(["main"]);
    }
  };

  const handleNavigate = (view) => {
    // Prevent navigation to battery page if not configured
    if (view === "battery" && !batteryState.isConfigured) {
      return; // Do nothing if battery is not configured
    }
    setNavigationStack([...navigationStack, view]);
    setCurrentView(view);
  };

  const handleWeatherNavigation = () => {
    if (onPageChange) {
      onPageChange('weather');
    }
  };

  const renderMainMenu = () => (
    <>
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Settings className="w-7 h-7 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl text-foreground font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">App Preferences</p>
          </div>
        </div>
      </div>
      <div className="px-6 space-y-6 pb-24">
        {/* Main Settings Menu */}
        <div className="space-y-6">
          {/* My Account Section */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-2">
              My Account
            </h2>
            <div className="space-y-3">
              {/* Account Settings */}
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
                <button
                  onClick={() => handleNavigate("account-settings")}
                  className="w-full flex items-center justify-between hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl text-card-foreground font-semibold">
                      Account Settings
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* App Section */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-2">
              Device Controls
            </h2>
            <div className="space-y-3">
              {/* EV Control */}
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
                <button
                  onClick={() => handleNavigate("ev-control")}
                  className="w-full flex items-center justify-between hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Car className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl text-card-foreground font-semibold">
                      EV Control
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Battery Configuration */}
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
                <button
                  onClick={() => handleNavigate("battery")}
                  disabled={!batteryState.isConfigured}
                  className={`w-full flex items-center justify-between rounded-2xl p-2 -m-2 transition-all duration-300 ${
                    batteryState.isConfigured
                      ? "hover:bg-muted/10 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-xl ${
                        batteryState.isConfigured
                          ? "bg-primary/10"
                          : "bg-muted/20"
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
                    <div>
                      <span
                        className={`text-xl font-semibold block text-left ${
                          batteryState.isConfigured
                            ? "text-card-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        Battery Configuration
                      </span>
                      {!batteryState.isConfigured && (
                        <span className="text-sm text-muted-foreground">
                          Not configured
                        </span>
                      )}
                    </div>
                  </div>
                  {batteryState.isConfigured && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* System Information */}
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
                <button
                  onClick={() => handleNavigate("system-info")}
                  className="w-full flex items-center justify-between hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl text-card-foreground font-semibold">
                      System Information
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Weather Section */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-2">
              Weather
            </h2>
            <div className="space-y-3">
              {/* Weather Info Details */}
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
                <button 
                  onClick={handleWeatherNavigation}
                  className="w-full flex items-center justify-between hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Cloud className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl text-card-foreground font-semibold">
                      Weather Info Details
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Support and Contact Section */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-2">
              Support and Contact
            </h2>
            <div className="space-y-3">
              {/* Additional Support */}
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
                <button
                  onClick={() => handleNavigate("additional-support")}
                  className="w-full flex items-center justify-between hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl text-card-foreground font-semibold">
                      Additional Support
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-2">
              Appearance
            </h2>
            <div className="space-y-3">
              {/* Dark Mode Toggle */}
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {theme === "dark" ? (
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <Moon className="w-5 h-5 text-primary" />
                      </div>
                    ) : (
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <Sun className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <div className="text-xl text-card-foreground font-semibold">
                        Dark Mode
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {theme === "dark" ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full bg-gradient-to-r from-red-500/20 to-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 font-semibold hover:from-red-500/30 hover:to-red-500/20 transition-all duration-300"
        >
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-full bg-background">
      {currentView === "main" && renderMainMenu()}
      {currentView === "system-info" && (
        <SystemInformationPage onBack={navigateBack} />
      )}
      {currentView === "battery" && <BatteryPage onBack={navigateBack} />}
      {currentView === "ev-control" && <EVControlPage onBack={navigateBack} />}
      {currentView === "account-settings" && (
        <AccountSettingsPage
          onBack={navigateBack}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === "edit-account" && (
        <EditAccountPage onBack={navigateBack} />
      )}
      {currentView === "change-password" && (
        <ChangePasswordPage onBack={navigateBack} />
      )}
      {currentView === "additional-support" && (
        <AdditionalSupportPage
          onBack={navigateBack}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === "user-guides" && (
        <UserGuidesPage onBack={navigateBack} />
      )}
      {currentView === "faqs" && <FAQsPage onBack={navigateBack} />}
      {currentView === "help-support" && (
        <HelpSupportPage onBack={navigateBack} />
      )}
    </div>
  );
}
