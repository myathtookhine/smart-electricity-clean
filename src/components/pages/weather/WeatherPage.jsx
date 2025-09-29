import React, { useState } from "react";
import { useWeather } from "../../../hooks/useWeather";
import { useApp } from "../../../contexts/AppContext";
import { useLocationContext } from "../../../contexts/LocationContext";
import { getWeatherIcon } from "../../../utils/weatherIcons";
import {
  ChevronLeft,
  Loader2,
  MapPinPlus,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Cloud,
  Zap,
  ChevronRight,
} from "lucide-react";
import PreferredLocationsManager from "../../PreferredLocationsManager";
import { Alert } from "../../ui/alert";
import { Button } from "../../ui/button";
import { BackToHomeButton } from "../../ui/BackToHomeButton";

export const WeatherPage = ({ onPageChange, fromPage }) => {
  const { stormReadyMode } = useApp();
  const {
    preferredLocations,
    selectedLocation,
    autoDetecting,
    autoDetectError,
    requestDeviceLocation,
  } = useLocationContext();
  const {
    weather,
    forecast,
    loading: weatherLoading,
    error: weatherError,
  } = useWeather(selectedLocation?.lat, selectedLocation?.lon);

  const [activeTab, setActiveTab] = useState("current"); // 'current' or 'manage'
  const hasPreferredLocations = preferredLocations.length > 0;
  const isManagingLocations = activeTab === "manage";

  const loading = weatherLoading;
  const error = weatherError;
  const locationDisplayName = selectedLocation?.name || weather?.name;
  const locationCountry = selectedLocation?.country || weather?.sys?.country;

  const formatErrorMessage = (message, suffix) => {
    if (!message) return suffix;
    const trimmed = message.trim();
    const needsPunctuation = !/[.!?]$/.test(trimmed);
    return `${trimmed}${needsPunctuation ? "." : ""} ${suffix}`;
  };

  // Determine storm ready alert properties based on current state
  const getStormReadyAlert = () => {
    if (!stormReadyMode.enabled) {
      return {
        type: "neutral",
        title: "StormReady Mode: Disabled",
        message: "Please check in the settings to enable!",
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

  const handleBackClick = () => {
    if (onPageChange) {
      // If we came from settings, go back to settings; otherwise go to home
      const targetPage = fromPage === "settings" ? "settings" : "home";
      onPageChange(targetPage);
    }
  };

  // Prepare forecast data
  const todayForecast = forecast?.list?.slice(0, 8) || [];
  const dailyForecast =
    forecast?.list?.filter((item, index) => index % 8 === 0).slice(0, 5) || [];

  // If no location is selected, guide the user through setup
  if (!selectedLocation) {
    return (
      <div className="min-h-full bg-background">
        <div className="px-6 pt-8 pb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={handleBackClick}
              className="w-10 h-10 bg-muted/20 rounded-xl flex items-center justify-center hover:bg-muted/30 transition-all duration-300 mr-2"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
              <Cloud className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-[180px]">
              <h1 className="text-xl text-foreground font-semibold">Weather</h1>
              <p className="text-sm text-muted-foreground">
                {autoDetecting
                  ? "Detecting your location..."
                  : "Set your home forecast"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-6 pb-16">
          {autoDetecting ? (
            <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
              <Loader2 className="w-10 h-10 mx-auto mb-4 text-primary animate-spin" />
              <h2 className="text-lg font-semibold text-foreground">
                Getting your location
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Hang tight while we personalise your weather feed.
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm space-y-4">
              <MapPinPlus className="w-12 h-12 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  Choose your weather location
                </h2>
                <p className="text-sm text-muted-foreground">
                  We’ll use your device location as the default home forecast.
                  You can add more cities below anytime.
                </p>
              </div>
              {autoDetectError && (
                <Alert
                  type="danger"
                  title="We couldn't access your location"
                  message={formatErrorMessage(
                    autoDetectError,
                    "You can allow location permission or add a city manually."
                  )}
                />
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => requestDeviceLocation?.()}
                  variant="secondary"
                  size="sm"
                  disabled={autoDetecting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  {autoDetecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Locating...
                    </>
                  ) : (
                    "Use My Location"
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <PreferredLocationsManager />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <div className="px-6 pt-8 pb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={handleBackClick}
            className="w-10 h-10 bg-muted/20 rounded-xl flex items-center justify-center hover:bg-muted/30 transition-all duration-300 mr-2"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Cloud className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-xl text-foreground font-semibold">Weather</h1>
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Loading..."
                : locationDisplayName ||
                  (hasPreferredLocations
                    ? "Select a location"
                    : "No location selected")}
              {locationCountry ? `, ${locationCountry}` : ""}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-1"
          role="tablist"
          aria-label="Weather sections"
        >
          <button
            type="button"
            role="tab"
            id="weather-tab-current-trigger"
            aria-selected={!isManagingLocations}
            aria-controls="weather-tab-current"
            onClick={() => setActiveTab("current")}
            className={`flex-1 inline-flex items-center justify-center rounded-lg border py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 ${
              !isManagingLocations
                ? "bg-background text-foreground shadow-sm border-border"
                : "bg-transparent text-muted-foreground border-transparent hover:bg-background/50 hover:text-foreground"
            }`}
          >
            Current Weather
          </button>
          <button
            type="button"
            role="tab"
            id="weather-tab-manage-trigger"
            aria-selected={isManagingLocations}
            aria-controls="weather-tab-manage"
            onClick={() => setActiveTab("manage")}
            className={`flex-1 inline-flex items-center justify-center rounded-lg border py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 ${
              isManagingLocations
                ? "bg-background text-foreground shadow-sm border-border"
                : "bg-transparent text-muted-foreground border-transparent hover:bg-background/50 hover:text-foreground"
            }`}
          >
            Manage Locations
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-12">
        {/* Current Weather Tab */}
        {activeTab === "current" && (
          <div
            id="weather-tab-current"
            role="tabpanel"
            aria-labelledby="weather-tab-current-trigger"
            className="space-y-6"
          >
            {autoDetectError && !autoDetecting && (
              <Alert
                type="warning"
                title="Location permission disabled"
                message={formatErrorMessage(
                  autoDetectError,
                  "We will keep using your saved locations until access is restored."
                )}
              />
            )}

            {/* Storm-ready Mode Alert - Show only on current weather tab */}
            {weather && (
              <div className="relative">
                <Alert {...getStormReadyAlert()} />
                <ChevronRight className="absolute top-4 right-4 w-4 h-4 text-muted-foreground" />
              </div>
            )}

            {!weather && loading && (
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-muted rounded-lg"></div>
                <div className="h-48 bg-muted rounded-lg"></div>
              </div>
            )}

            {weather && (
              <>
                {/* Current Weather */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="text-center">
                    <img
                      src={getWeatherIcon(weather.weather[0].icon)}
                      alt={weather.weather[0].description}
                      className="w-32 h-32 mx-auto mb-4"
                    />

                    <div className="text-4xl font-bold text-foreground mb-2">
                      {Math.round(weather.main.temp)}°C
                    </div>
                    <div className="text-lg text-muted-foreground capitalize mb-6">
                      {weather.weather[0].description}
                    </div>

                    {/* Weather Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-muted/30 dark:bg-muted/20 rounded-xl p-3 border border-border/40">
                        <div className="flex items-center justify-center mb-2">
                          <Thermometer className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Feels like
                        </div>
                        <div className="font-semibold text-foreground">
                          {Math.round(weather.main.feels_like)}°C
                        </div>
                      </div>

                      <div className="bg-muted/30 dark:bg-muted/20 rounded-xl p-3 border border-border/40">
                        <div className="flex items-center justify-center mb-2">
                          <Droplets className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Humidity
                        </div>
                        <div className="font-semibold text-foreground">
                          {weather.main.humidity}%
                        </div>
                      </div>

                      <div className="bg-muted/30 dark:bg-muted/20 rounded-xl p-3 border border-border/40">
                        <div className="flex items-center justify-center mb-2">
                          <Wind className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Wind
                        </div>
                        <div className="font-semibold text-foreground">
                          {weather.wind?.speed
                            ? `${weather.wind.speed} m/s`
                            : "N/A"}
                        </div>
                      </div>

                      <div className="bg-muted/30 dark:bg-muted/20 rounded-xl p-3 border border-border/40">
                        <div className="flex items-center justify-center mb-2">
                          <Gauge className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Pressure
                        </div>
                        <div className="font-semibold text-foreground">
                          {weather.main.pressure} hPa
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today's Forecast */}
                {forecast && todayForecast.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Today's Forecast
                    </h3>
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                      {todayForecast.map((item, index) => {
                        const time = new Date(
                          item.dt * 1000
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        return (
                          <div
                            key={index}
                            className="flex-shrink-0 text-center bg-muted/30 dark:bg-muted/20 rounded-xl p-3 border border-border/40 min-w-[80px]"
                          >
                            <div className="text-xs text-muted-foreground mb-2">
                              {time}
                            </div>
                            <img
                              src={getWeatherIcon(item.weather[0].icon)}
                              alt={item.weather[0].description}
                              className="w-8 h-8 mx-auto mb-2"
                            />
                            <div className="text-sm font-medium text-foreground">
                              {Math.round(item.main.temp)}°
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.pop ? `${Math.round(item.pop * 100)}%` : ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5-Day Forecast */}
                {forecast && dailyForecast.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      5-Day Forecast
                    </h3>
                    <div className="space-y-3">
                      {dailyForecast.map((item, index) => {
                        const date = new Date(item.dt * 1000);
                        const dayName =
                          index === 0
                            ? "Today"
                            : date.toLocaleDateString([], { weekday: "short" });

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="w-10 text-sm font-medium text-foreground">
                                {dayName}
                              </div>
                              <img
                                src={getWeatherIcon(item.weather[0].icon)}
                                alt={item.weather[0].description}
                                className="w-6 h-6"
                              />
                              <div className="text-sm text-muted-foreground capitalize">
                                {item.weather[0].description}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-foreground">
                                {Math.round(item.main.temp)}°
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(item.main.temp_min)}°
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Manage Locations Tab */}
        {activeTab === "manage" && (
          <div
            id="weather-tab-manage"
            role="tabpanel"
            aria-labelledby="weather-tab-manage-trigger"
            className="space-y-4"
          >
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Home location preferences
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Use your device location as a quick default or curate a list
                  of favourite cities below.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => requestDeviceLocation?.()}
                  disabled={autoDetecting}
                  className="flex items-center gap-2"
                >
                  {autoDetecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Locating...
                    </>
                  ) : (
                    "Use My Location"
                  )}
                </Button>
                {autoDetectError && (
                  <span className="text-xs text-destructive">
                    {formatErrorMessage(
                      autoDetectError,
                      "Please enable location access and try again."
                    )}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <PreferredLocationsManager />
            </div>
          </div>
        )}

        {/* Back to Home Button */}
        <div className="mt-8">
          <BackToHomeButton onGoHome={handleBackClick} />
        </div>
      </div>
    </div>
  );
};
