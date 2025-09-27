import {
  Zap,
  Cloud,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  Play,
  Pause,
  RotateCcw,
  HousePlug,
} from "lucide-react";
import { Switch } from "../ui/switch";
import { Alert } from "../ui/alert";
import { useTheme } from "../ThemeProvider";
import { useState, useEffect, useRef } from "react";
import WeatherTab from "./weather/WeatherTab";
import LocationPermissionModal from "../LocationPermissionModal";
import { useLocation } from "../../hooks/useLocation";
import { useApp } from "../../contexts/AppContext";
import { GuidedHandoverModal } from "../ui/GuidedHandoverModal";
import exampleImage from "../../assets/iso-home.png";
import DuracellWhite from "../../assets/duracell-logo-white.svg";
import DuracellBlack from "../../assets/duracell-logo-black.svg";

import HomeDark from "../../assets/home-dark-mode.svg";
import HomeLight from "../../assets/home-light-mode.svg";

export function HomePage({ onPageChange }) {
  const { theme, setTheme } = useTheme();
  const {
    stormReadyMode,
    showGuidedHandoverModal,
    closeGuidedHandoverModal,
    visualizationType,
  } = useApp();
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showInverterSubmenu, setShowInverterSubmenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimeoutRef = useRef(null);
  const {
    location,
    loading: locationLoading,
    error: locationError,
    permissionStatus,
    requestLocation,
  } = useLocation();
  const notificationCount = 3; // Example notification count
  const headerLogo = theme === "dark" ? DuracellWhite : DuracellBlack;

  // Determine storm ready alert properties based on current state
  const getStormReadyAlert = () => {
    if (!stormReadyMode.enabled) {
      return {
        type: "neutral",
        title: "StormReady Mode: Disabled",
        message: "Storm-ready mode is currently disabled.",
        customIcon: Zap,
        showIcon: true,
        showMessage: true,
      };
    } else if (stormReadyMode.isActive) {
      return {
        type: "warning",
        title: "StormReady Mode: Active",
        message: "System is actively charging battery due to storm detection!",
        customIcon: Zap,
        showIcon: true,
        showMessage: true,
      };
    } else {
      return {
        type: "success",
        title: "StormReady Mode: Monitoring",
        message: "Storm-ready mode is on and monitoring for a storm!",
        customIcon: Zap,
        showIcon: true,
        showMessage: true,
      };
    }
  };

  // Show location modal on initial load if permission not granted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (permissionStatus === "prompt" && !location) {
        setShowLocationModal(true);
      }
    }, 2000); // Show modal 2 seconds after page load

    return () => clearTimeout(timer);
  }, [permissionStatus, location]);

  const handleLocationRequest = () => {
    requestLocation();
    setShowLocationModal(false);
  };

  const handleCloseModal = () => {
    setShowLocationModal(false);
  };

  const handleWeatherClick = () => {
    if (onPageChange) {
      onPageChange("weather");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleRefreshClick = () => {
    console.log("Refreshing live usage data...");
    setIsRefreshing(true);

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false);
      refreshTimeoutRef.current = null;
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (visualizationType !== "isometric") {
      setShowInverterSubmenu(false);
    }
  }, [visualizationType]);
  return (
    <div className="min-h-full bg-background relative">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-2">
          {/* Light/Dark Mode Toggle */}
          <div className="flex items-start">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-xl bg-muted hover:bg-muted/30 transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
          {/* Logo */}
          <div className="text-center">
            <img
              src={headerLogo}
              alt="Duracell logo"
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

      {/* Weather Information */}
      <div className="px-6 mb-6">
        <WeatherTab
          lat={location?.latitude}
          lon={location?.longitude}
          onWeatherClick={handleWeatherClick}
          onClick={() => {
            if (!location && permissionStatus !== "granted") {
              setShowLocationModal(true);
            }
          }}
        />
      </div>
      {isRefreshing && (
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mx-6 my-3 mb-5 p-4">
          <RotateCcw className="w-4 h-4 text-primary animate-spin" />
          <span>Refreshing live usage data…</span>
        </div>
      )}
      {/* Refreshing live usage data ui */}
      <div className="px-6 mb-2">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xl text-foreground text-left">
            Live Usage Monitor
          </h4>
          <button
            onClick={handleRefreshClick}
            className="flex flex-row items-center space-x-2 p-2 px-4 rounded-lg bg-muted hover:bg-muted/70 transition-all duration-200 hover:scale-105"
            title="Refresh live data"
          >
            <RotateCcw className="w-3 h-3 text-foreground" />
            {/* <span className="text-sm text-foreground">Refresh</span> */}
          </button>
        </div>
      </div>
      {/* Smart Home Visualization */}
      <div className="px-6 mb-0 flex justify-center home-image-wrapper">
        {visualizationType === "isometric" ? (
          <div className="w-full max-w-sm relative pb-20">
            {/* Animation on/off switch */}
            <img
              src={exampleImage}
              alt="Isometric smart home with solar panels and electric car charging station"
              className="w-full h-auto rounded-2xl opacity-90"
            />

            {/* Overlay Labels and Lines */}
            <div className="absolute inset-0">
              {/* Solar Panel Label - Top Center */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 text-center shadow-lg">
                  <div className="text-sm font-bold text-foreground">
                    6.5 kW
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Solar Panel
                  </div>
                </div>
                {/* Direct connector line pointing to solar panels on roof */}
                <div className="solar-connector">
                  <div className="line-vertical"></div>
                  <div className="connector-dot"></div>
                  {isAnimationEnabled && <div className="animated-dot"></div>}
                </div>
              </div>

              {/* Grid Export Label - Under image, left side */}
              <div className="absolute top-80 left-0 mt-6">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 text-center shadow-lg">
                  <div className="text-sm font-bold text-green-500">
                    +1.2 kW
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Grid Export
                  </div>
                </div>
                {/* Bent connector line pointing to grid lines on left side */}
                <div className="grid-connector">
                  <div className="line-up"></div>
                  <div className="line-right"></div>
                  <div className="line-up-final"></div>
                  <div className="connector-dot green"></div>
                  {isAnimationEnabled && <div className="animated-dot"></div>}
                </div>
              </div>

              {/* Charging Station Label - Under image, center */}
              <div className="absolute top-80 left-1/2 transform -translate-x-1/2 mt-6">
                <button
                  onClick={() => setShowInverterSubmenu(!showInverterSubmenu)}
                  className={`bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                    showInverterSubmenu ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="text-sm font-bold text-foreground">11 kW</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Invertor
                  </div>
                </button>

                {/* Floating Sub-Menu with L1, L2, L3 branches */}
                {showInverterSubmenu && (
                  <div className="absolute bottom-full mb-8 left-1/2 transform -translate-x-1/2 inverter-submenu z-50">
                    {/* Row of circular bubbles */}
                    <div className="flex items-center justify-center space-x-8">
                      {/* L1 Branch */}
                      <div className="relative l1-branch z-40">
                        <div className="w-16 h-16 bg-white/95 backdrop-blur-sm border-2 border-white-500 rounded-md flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <div className="text-xs font-medium text-blue-500 mt-1">
                            3.7kW
                          </div>
                          <div className="text-base text-blue-500 font-bold">
                            L1
                          </div>
                        </div>
                        {/* Bend connector from L1 to Inverter */}
                        <div className="l1-connector">
                          <div className="line-down"></div>
                          <div className="line-right"></div>
                          <div className="line-down-final"></div>
                        </div>
                      </div>

                      {/* L2 Branch */}
                      <div className="relative l2-branch z-40">
                        <div className="w-16 h-16 bg-white/95 backdrop-blur-sm border-2 border-white-500 rounded-md flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <div className="text-xs font-medium text-blue-500 mt-1">
                            3.6kW
                          </div>
                          <div className="text-base text-blue-500 font-bold">
                            L2
                          </div>
                        </div>
                        {/* Direct line from L2 to Inverter (center) */}
                        <div className="l2-connector">
                          <div className="line-down-direct"></div>
                        </div>
                      </div>

                      {/* L3 Branch */}
                      <div className="relative l3-branch z-40">
                        <div className="w-16 h-16 bg-white/95 backdrop-blur-sm border-2 border-white-500 rounded-md flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <div className="text-xs font-medium text-blue-500 mt-1">
                            3.7kW
                          </div>
                          <div className="text-base text-blue-500 font-bold">
                            L3
                          </div>
                        </div>
                        {/* Bend connector from L3 to Inverter */}
                        <div className="l3-connector">
                          <div className="line-down"></div>
                          <div className="line-left"></div>
                          <div className="line-down-final"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Bent connector line pointing to charging station */}
                <div className="charger-connector">
                  <div className="line-up"></div>
                  <div className="line-right"></div>
                  <div className="line-up-final"></div>
                  <div className="connector-dot"></div>
                  {isAnimationEnabled && <div className="animated-dot"></div>}
                </div>
              </div>

              {/* Electric Car Label - Under image, right side */}
              <div className="absolute top-80 right-0 mt-6">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 text-center shadow-lg">
                  <div className="text-sm font-bold text-foreground">
                    7.2 kW
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Electric Car
                  </div>
                </div>
                {/* Bent connector line pointing to electric car */}
                <div className="car-connector">
                  <div className="line-up"></div>
                  <div className="line-left"></div>
                  <div className="line-up-final"></div>
                  <div className="connector-dot"></div>
                  {isAnimationEnabled && <div className="animated-dot"></div>}
                </div>
              </div>

              {/* Home Load Circle - Center of image */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="home-load-circle-container">
                  <div className="home-load-mesh-gradient"></div>
                  <div className="home-load-pulsing-circle">
                    <div className="home-load-content text-center">
                      <HousePlug className="w-5 h-5 text-white mb-2" />
                      <div className="text-md font-bold text-white">21 kWh</div>
                      {/* <div className="text-xs text-foreground uppercase tracking-wide">
                        Home Load
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm relative pb-20 mb-10">
            <img
              src={theme === "dark" ? HomeDark : HomeLight}
              alt="Smart home flat view"
              className="w-full h-auto mb-4"
            />

            {/* Overlay Labels and Lines for Flat View */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top Labels: Solar & Grid */}
              <div className="flat-top-label flat-top-label--solar">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-center shadow-lg">
                  <div className="text-sm font-bold text-foreground">
                    6.5 kW
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Solar Panel
                  </div>
                </div>
                <div className="flat-solar-connector">
                  <div className="line-down"></div>
                  <div className="line-right"></div>
                  <div className="line-down-final"></div>
                  {isAnimationEnabled && <div className="animated-dot"></div>}
                </div>
              </div>

              <div className="flat-top-label flat-top-label--grid">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-center shadow-lg">
                  <div className="text-sm font-bold text-green-500">
                    +1.2 kW
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Grid Export
                  </div>
                </div>
                <div className="flat-grid-connector">
                  <div className="line-down"></div>
                  <div className="line-right"></div>
                  <div className="line-down-final"></div>
                  {isAnimationEnabled && <div className="animated-dot"></div>}
                </div>
              </div>

              {/* Bottom Labels Row: EV, Home Load, Battery */}
              <div className="flat-bottom-row">
                <div className="flat-bottom-label flat-bottom-label--ev">
                  <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-center shadow-lg">
                    <div className="text-sm font-bold text-foreground">
                      7.2 kW
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      EV
                    </div>
                  </div>
                  <div className="flat-ev-connector">
                    <div className="line-up"></div>
                    <div className="line-right"></div>
                    {isAnimationEnabled && <div className="animated-dot"></div>}
                  </div>
                </div>

                <div className="flat-bottom-label flat-bottom-label--home">
                  <div className="home-load-circle-container">
                    <div className="home-load-mesh-gradient"></div>
                    <div className="home-load-pulsing-circle">
                      <div className="home-load-content">
                        <HousePlug className="w-5 h-5 text-white mb-2" />
                        <div className="text-md font-bold text-white">
                          21 kWh
                        </div>
                        {/* <div className="text-xs text-foreground uppercase tracking-wide">
                          Home Load
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="flat-home-connector">
                    <div className="line-up"></div>
                    {isAnimationEnabled && <div className="animated-dot"></div>}
                  </div>
                </div>

                <div className="flat-bottom-label flat-bottom-label--battery">
                  <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-center shadow-lg">
                    <div className="text-sm font-bold text-amber-500">
                      18 kWh
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      Battery
                    </div>
                  </div>
                  <div className="flat-battery-connector">
                    <div className="line-up"></div>
                    <div className="line-left"></div>
                    {isAnimationEnabled && <div className="animated-dot"></div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Storm Ready Mode Alert */}
      <div className="px-6 mb-6">
        <Alert {...getStormReadyAlert()} />
      </div>

      {/* Location Permission Modal */}
      <LocationPermissionModal
        isOpen={showLocationModal}
        onRequestLocation={handleLocationRequest}
        onClose={handleCloseModal}
        error={locationError}
      />

      {/* Guided Handover Modal */}
      {showGuidedHandoverModal && (
        <GuidedHandoverModal
          isOpen={showGuidedHandoverModal}
          onClose={closeGuidedHandoverModal}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
