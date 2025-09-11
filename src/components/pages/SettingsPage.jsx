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
  DollarSign,
} from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { useApp } from "../../contexts/AppContext";
import { useState, useEffect } from "react";
import logo from "../../assets/duracell-logo.png";
import {
  SystemInformationPage,
  BatteryPage,
  EVControlPage,
  AccountSettingsPage,
  EditAccountPage,
  ChangePasswordPage,
  CostSummaryPage,
  AdditionalSupportPage,
  UserGuidesPage,
  FAQsPage,
  HelpSupportPage,
} from "./SubSettings";

export function SettingsPage({ onSubPageChange, onPageChange }) {
  const { theme, setTheme } = useTheme();
  const { user, logout, batteryState } = useApp();
  const notificationCount = 3; // Example notification count
  const [currentView, setCurrentView] = useState("main"); // 'main', 'system-info', 'battery', 'ev-control', 'account-settings', 'edit-account', 'change-password', 'cost-summary', 'additional-support', 'user-guides', 'faqs', 'help-support'
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
      onPageChange("weather");
    }
  };

  const handleGoHome = () => {
    if (onPageChange) {
      onPageChange("home");
    }
  };

  const renderMainMenu = () => (
    <>
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-2">
          {/* Left: Light/Dark Mode Toggle */}
          <div>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-xl bg-muted hover:bg-muted/30 transition-all duration-300 mr-2"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>

          {/* Center: Logo */}
          <div className="text-center">
            <img
              src={logo}
              alt="Duracell Logo"
              className="w-32 h-auto object-contain"
            />
          </div>

          {/* Right: Notifications */}
          <div className="flex items-center relative">
            <button
              onClick={() => onPageChange && onPageChange("notifications")}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="px-6 space-y-6 pb-8">
        <div className="mb-2 px-2">
          <h4 className="text-xl text-foreground text-left mb-3">Settings</h4>
        </div>
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
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-full">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl text-card-foreground ">
                      Account Settings
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Cost Summary */}
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
                <button
                  onClick={() => handleNavigate("cost-summary")}
                  className="w-full flex items-center justify-between hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-full">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl text-card-foreground ">
                      Cost Summary
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
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-full">
                      <Car className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl text-card-foreground ">
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
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 bg-muted rounded-full ${
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
                        className={`text-xl  block text-left ${
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
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-full">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl text-card-foreground ">
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
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-full">
                      <Cloud className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl text-card-foreground ">
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
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-full">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl text-card-foreground ">
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
                  <div className="flex items-center space-x-4">
                    {theme === "dark" ? (
                      <div className="p-2 bg-muted rounded-full">
                        <Moon className="w-5 h-5 text-primary" />
                      </div>
                    ) : (
                      <div className="p-2 bg-muted rounded-full">
                        <Sun className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <div className="text-xl text-card-foreground ">
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
      </div>
    </>
  );

  return (
    <div className="min-h-full bg-background">
      {currentView === "main" && renderMainMenu()}
      {currentView === "system-info" && (
        <SystemInformationPage onBack={navigateBack} onGoHome={handleGoHome} />
      )}
      {currentView === "battery" && (
        <BatteryPage onBack={navigateBack} onGoHome={handleGoHome} />
      )}
      {currentView === "ev-control" && (
        <EVControlPage onBack={navigateBack} onGoHome={handleGoHome} />
      )}
      {currentView === "account-settings" && (
        <AccountSettingsPage
          onBack={navigateBack}
          onNavigate={handleNavigate}
          onGoHome={handleGoHome}
        />
      )}
      {currentView === "edit-account" && (
        <EditAccountPage onBack={navigateBack} onGoHome={handleGoHome} />
      )}
      {currentView === "change-password" && (
        <ChangePasswordPage onBack={navigateBack} onGoHome={handleGoHome} />
      )}
      {currentView === "cost-summary" && (
        <CostSummaryPage onBack={navigateBack} onGoHome={handleGoHome} />
      )}
      {currentView === "additional-support" && (
        <AdditionalSupportPage
          onBack={navigateBack}
          onNavigate={handleNavigate}
          onGoHome={handleGoHome}
        />
      )}
      {currentView === "user-guides" && (
        <UserGuidesPage onBack={navigateBack} onGoHome={handleGoHome} />
      )}
      {currentView === "faqs" && (
        <FAQsPage onBack={navigateBack} onGoHome={handleGoHome} />
      )}
      {currentView === "help-support" && (
        <HelpSupportPage onBack={navigateBack} onGoHome={handleGoHome} />
      )}
    </div>
  );
}
