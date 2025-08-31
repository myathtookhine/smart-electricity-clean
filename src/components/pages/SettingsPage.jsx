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
  Zap,
  Cloud,
  Battery,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { Switch } from "../ui/switch";
import { useApp } from "../../contexts/AppContext";
import { useState } from "react";
import { InverterPage, BatteryPage, AppSettingsPage } from "./SubSettings";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useApp();
  const [currentView, setCurrentView] = useState("main"); // 'main', 'inverter', 'battery', 'settings'

  const navigateBack = () => {
    setCurrentView("main");
  };

  const renderMainMenu = () => (
    <>
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg">
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
        <div className="space-y-4">
          {/* EV Control */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
            <button className="w-full flex items-center justify-between hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/10 rounded-xl">
                  <Car className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-xl text-card-foreground font-semibold">
                  EV Control
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Inverter */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
            <button
              onClick={() => setCurrentView("inverter")}
              className="w-full flex items-center justify-between hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-500/10 rounded-xl">
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                <span className="text-xl text-card-foreground font-semibold">
                  Inverter
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Weather Tab */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
            <button className="w-full flex items-center justify-between hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <Cloud className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-xl text-card-foreground font-semibold">
                  Weather Tab
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Battery Page */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
            <button
              onClick={() => setCurrentView("battery")}
              className="w-full flex items-center justify-between hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600/10 rounded-xl">
                  <Battery className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xl text-card-foreground font-semibold">
                  Battery Page
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Settings */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
            <button
              onClick={() => setCurrentView("settings")}
              className="w-full flex items-center justify-between hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl text-card-foreground font-semibold">
                  Settings
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <h3 className="text-xl text-card-foreground font-semibold mb-4">
            Appearance
          </h3>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
            <div className="flex items-center space-x-3">
              {theme === "dark" ? (
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Moon className="w-5 h-5 text-primary" />
                </div>
              ) : (
                <div className="p-2 bg-yellow-500/10 rounded-xl">
                  <Sun className="w-5 h-5 text-yellow-500" />
                </div>
              )}
              <div>
                <div className="text-card-foreground font-medium">
                  Dark Mode
                </div>
                <div className="text-xs text-muted-foreground">
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
      {currentView === "inverter" && <InverterPage onBack={navigateBack} />}
      {currentView === "battery" && <BatteryPage onBack={navigateBack} />}
      {currentView === "settings" && <AppSettingsPage onBack={navigateBack} />}
    </div>
  );
}
