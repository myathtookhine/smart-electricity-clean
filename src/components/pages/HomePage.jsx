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
  SunIcon,
  Car,
  Battery,
  UtilityPole,
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

import HomeDark from "../../assets/home-dark-mode-no-con.svg";
import HomeLight from "../../assets/home-light-mode-no-con.svg";

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
        onClick: () => onPageChange("storm-ready"),
        className: "cursor-pointer",
      };
    } else if (stormReadyMode.isActive) {
      return {
        type: "warning",
        title: "StormReady Mode: Active",
        message: "System is actively charging battery due to storm detection!",
        customIcon: Zap,
        showIcon: true,
        showMessage: true,
        onClick: () => onPageChange("storm-ready"),
        className: "cursor-pointer",
      };
    } else {
      return {
        type: "success",
        title: "StormReady Mode: Monitoring",
        message: "Storm-ready mode is on and monitoring for a storm!",
        customIcon: Zap,
        showIcon: true,
        showMessage: true,
        onClick: () => onPageChange("storm-ready"),
        className: "cursor-pointer",
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
      <div
        className={`px-6 mb-0 flex justify-center home-image-wrapper ${
          visualizationType === "classic" ? "mt-4" : "mt-20"
        }`}
      >
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
                  onClick={() => onPageChange("battery")}
                  className={`bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                    showInverterSubmenu ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="text-sm font-bold text-foreground">11 kW</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Battery
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
                <button
                  onClick={() => onPageChange("ev-control")}
                  className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer pointer-events-auto"
                >
                  <div className="text-sm font-bold text-foreground">
                    7.2 kW
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    EV
                  </div>
                </button>
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
              <div className="absolute top-0 left-14 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-28 h-24 flex items-center justify-center">
                  {/* Content container - square shape */}
                  <div
                    className="relative bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-500 border border-orange-300/50 rounded-lg px-4 py-2 shadow-lg flex flex-col items-center gap-2 w-full h-full justify-center"
                    style={{
                      boxShadow:
                        "0 0 20px rgba(249, 115, 22, 0.3), 0 0 40px rgba(249, 115, 22, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <HousePlug className="w-6 h-6 text-background" />
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-bold text-background">
                        21 kWh
                      </div>
                      <div className="text-[10px] text-background/90 uppercase tracking-wide">
                        Home Load
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : visualizationType === "flat" ? (
          <div className="w-full max-w-sm relative pb-20 mb-10">
            <img
              src={theme === "dark" ? HomeDark : HomeLight}
              alt="Smart home flat view"
              className="w-full h-auto mb-4"
            />

            {/* Inverter to Solar Panel Connector Lines */}
            <div className="flat-inverter-solar-connector">
              {/* Vertical line from inverter up */}
              <div className="line-up"></div>
              {/* Horizontal line left to solar panels */}
              <div className="line-left"></div>
              {/* Static connector dot */}
              <div className="connector-dot"></div>
              {/* Animated square dot */}
              {isAnimationEnabled && (
                <div className="animated-square-dot"></div>
              )}
            </div>

            {/* Inverter to Grid Connector Lines */}
            <div className="flat-inverter-grid-connector">
              {/* Vertical line from inverter up */}
              <div className="line-up"></div>
              {/* Horizontal line right to grid box */}
              <div className="line-right"></div>
              {/* Static connector dot */}
              <div className="connector-dot"></div>
              {/* Animated square dot */}
              {isAnimationEnabled && (
                <div className="animated-square-dot"></div>
              )}
            </div>

            {/* Inverter to Car Connector Lines */}
            <div className="flat-inverter-car-connector">
              {/* Horizontal line left to car */}
              <div className="line-left"></div>
              {/* Static connector dot */}
              {/* <div className="connector-dot"></div> */}
              {/* Animated square dot */}
              {isAnimationEnabled && (
                <div className="animated-square-dot"></div>
              )}
            </div>

            {/* Inverter to Battery Connector Lines */}
            <div className="flat-inverter-battery-connector">
              {/* Horizontal line right to battery */}
              <div className="line-right"></div>
              {/* Static connector dot */}
              <div className="connector-dot"></div>
              {/* Animated square dot */}
              {isAnimationEnabled && (
                <div className="animated-square-dot"></div>
              )}
            </div>

            {/* Energy Labels */}
            {/* Top Part Labels */}
            <div className="absolute -top-16 left-2 flex flex-col items-center gap-1">
              <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                <SunIcon className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-bold text-foreground">
                  12 kWh
                </span>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Solar
              </span>
            </div>

            <div className="absolute -top-16 right-2 flex flex-col items-center gap-1">
              <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                <UtilityPole className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-foreground">
                  24 kWh
                </span>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Grid
              </span>
            </div>

            {/* Bottom Part Labels */}
            <div className="absolute bottom-2 left-2 flex flex-col items-center gap-1">
              <button
                onClick={() => onPageChange("ev-control")}
                className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Car className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-bold text-foreground">
                  10 kWh
                </span>
              </button>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                EV
              </span>
            </div>

            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
              <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-6 py-4 shadow-lg flex items-center gap-2">
                <HousePlug className="w-4 h-4 text-green-500" />
                <span className="text-sm font-bold text-foreground">
                  35 kWh
                </span>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Home Load
              </span>
            </div>

            <div className="absolute bottom-2 right-2 flex flex-col items-center gap-1">
              <button
                onClick={() => onPageChange("battery")}
                className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Battery className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-foreground">
                  11 kWh
                </span>
              </button>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Battery
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm relative mb-5">
            {/* Classic View Card Container */}
            <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg p-6 h-[370px] relative">
              {/* Top Part Labels - Solar and Grid */}
              <div className="absolute top-4 left-4 flex flex-col items-center gap-1">
                <div className="flex flex-col items-center bg-muted/80 backdrop-blur-sm border border-border/30 rounded-lg px-3 py-2 shadow-md flex items-center">
                  <SunIcon className="w-6 h-6 text-yellow-500 mb-2" />
                  <div>
                    <span className="text-md font-bold text-foreground">
                      12 kWh
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Solar
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 flex flex-col items-center gap-1">
                <div className="flex flex-col items-center bg-muted/80 backdrop-blur-sm border border-border/30 rounded-lg px-3 py-2 shadow-md">
                  <UtilityPole className="w-6 h-6 text-blue-500 mb-2" />
                  <div>
                    <span className="text-md font-bold text-foreground">
                      24 kWh
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Grid
                    </span>
                  </div>
                </div>
              </div>

              {/* Home Load Circle - Absolute Center of Card */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="home-load-circle-container">
                  <div className="home-load-mesh-gradient"></div>
                  <div className="home-load-pulsing-circle">
                    <div className="home-load-content text-center">
                      <HousePlug className="w-5 h-5 text-white mb-2" />
                      <div className="text-lg font-bold text-white">21 kWh</div>
                      <div className="text-xs text-white/90 uppercase tracking-wide">
                        Home Load
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector Lines from Home Load Circle */}
              {/* Line to Solar Label - Left and Up */}
              <div className="classic-solar-connector">
                <div className="line-left"></div>
                <div className="line-up"></div>
                {/* <div className="connector-dot"></div> */}
                {isAnimationEnabled && <div className="animated-dot"></div>}
              </div>

              {/* Line to Grid Label - Right and Up */}
              <div className="classic-grid-connector">
                <div className="line-right"></div>
                <div className="line-up"></div>
                {/* <div className="connector-dot"></div> */}
                {isAnimationEnabled && <div className="animated-dot"></div>}
              </div>

              {/* Line to EV Label - Left and Down */}
              <div
                className="classic-ev-connector cursor-pointer"
                onClick={() => onPageChange("ev-control")}
                title="Navigate to EV Control"
              >
                <div className="line-left"></div>
                <div className="line-down"></div>
                {isAnimationEnabled && <div className="animated-dot"></div>}
              </div>

              {/* Line to Battery Label - Right and Down */}
              <div
                className="classic-battery-connector cursor-pointer"
                onClick={() => onPageChange("battery")}
                title="Navigate to Battery"
              >
                <div className="line-right"></div>
                <div className="line-down"></div>
                {isAnimationEnabled && <div className="animated-dot"></div>}
              </div>

              {/* Bottom Part Labels - EV and Battery */}
              <div className="absolute bottom-4 left-4 flex flex-col items-center gap-1">
                <button
                  onClick={() => onPageChange("ev-control")}
                  className="flex flex-col items-center bg-muted/80 backdrop-blur-sm border border-border/30 rounded-lg px-3 py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <Car className="w-6 h-6 text-purple-500 mb-2" />
                  <div>
                    <span className="text-md font-bold text-foreground">
                      10 kWh
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      EV
                    </span>
                  </div>
                </button>
              </div>

              <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1">
                <div className="flex flex-col items-center bg-muted/80 backdrop-blur-sm border border-border/30 rounded-lg px-3 py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                  <Battery className="w-6 h-6 text-orange-500 mb-2" />
                  <div>
                    <span className="text-md font-bold text-foreground">
                      11 kWh
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Battery
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Storm Ready Mode Alert */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Alert {...getStormReadyAlert()} />
          <ChevronRight className="absolute top-4 right-4 w-4 h-4 text-muted-foreground" />
        </div>
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

{
  /* Overlay Labels and Lines for Flat View */
}
{
  /* <div className="absolute inset-0 pointer-events-none">
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

              <div className="flat-bottom-row">
                <div className="flat-bottom-label flat-bottom-label--ev">
                  <button
                    onClick={() => onPageChange("ev-control")}
                    className="w-16 h-16 bg-background/90 backdrop-blur-sm border border-border/50 rounded-full flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer pointer-events-auto"
                  >
                    <div className="text-sm font-bold text-foreground">
                      7.2 kW
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      EV
                    </div>
                  </button>
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
                      </div>
                    </div>
                  </div>
                  <div className="flat-home-connector">
                    {isAnimationEnabled && <div className="animated-dot"></div>}
                  </div>
                </div>

                <div className="flat-bottom-label flat-bottom-label--battery">
                  <button
                    onClick={() => onPageChange("battery")}
                    className="w-16 h-16 bg-background/90 backdrop-blur-sm border border-border/50 rounded-full flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer pointer-events-auto"
                  >
                    <div className="text-sm font-bold text-foreground">
                      18 kWh
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      Battery
                    </div>
                  </button>
                  <div className="flat-battery-connector">
                    <div className="line-up"></div>
                    <div className="line-left"></div>
                    {isAnimationEnabled && <div className="animated-dot"></div>}
                  </div>
                </div>
              </div>
            </div> */
}