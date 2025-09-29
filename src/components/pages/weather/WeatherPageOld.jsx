import React from 'react';
import { useWeather } from '../../../hooks/useWeather';
import { useLocation } from '../../../hooks/useLocation';
import { useApp } from "../../../contexts/AppContext";
import { useLocationContext } from "../../../contexts/LocationContext";
import { getWeatherIcon } from "../../../utils/weatherIcons";
import {
  ChevronLeft,
  MapPinPlus,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Cloud,
  Zap,
  Settings,
} from "lucide-react";
import LocationPermissionModal from "../../LocationPermissionModal";
import PreferredLocationsManager from "../../PreferredLocationsManager";
import LocationSelectionModal from "../../LocationSelectionModal";
import { Alert } from "../../ui/alert";
import { Button } from "../../ui/button";
import { BackToHomeButton } from "../../ui/BackToHomeButton";
import { useState } from "react";

export const WeatherPage = ({ onPageChange, fromPage }) => {
  const { stormReadyMode } = useApp();
  const { selectedLocation } = useLocationContext();
  const {
    location: gpsLocation,
    loading: locationLoading,
    error: locationError,
    permissionStatus,
    requestLocation,
  } = useLocation();
  const {
    weather,
    forecast,
    loading: weatherLoading,
    error: weatherError,
  } = useWeather(selectedLocation?.lat, selectedLocation?.lon);
  
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'manage'

  const loading = locationLoading || weatherLoading;
  const error = locationError || weatherError;

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

  const handleLocationRequest = () => {
    requestLocation();
    setShowLocationModal(false);
  };

  const handleBackClick = () => {
    if (onPageChange) {
      // If we came from settings, go back to settings; otherwise go to home
      const targetPage = fromPage === "settings" ? "settings" : "home";
      onPageChange(targetPage);
    }
  };

  if (!selectedLocation) {
    return (
      <div className="min-h-full bg-background">
        {/* Header with Back Button */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={handleBackClick}
              className="w-10 h-10 bg-muted/20 rounded-xl flex items-center justify-center hover:bg-muted/30 transition-all duration-300 mr-2"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
              <Cloud className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl text-foreground font-semibold">Weather</h1>
              <p className="text-sm text-muted-foreground">
                Location setup required
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 space-y-6 pb-24">
          {/* Location Setup Required */}
          <div className="bg-card rounded-lg p-6 text-center">
            <MapPinPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Choose Your Weather Location
            </h2>
            <p className="text-muted-foreground mb-4">
              Add preferred locations to see weather conditions and forecasts. 
              You can set one as your default home location.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setShowLocationSelector(true)}
                variant="primary"
                size="default"
                className="w-full"
              >
                Manage Locations
              </Button>
            </div>
          </div>

          <PreferredLocationsManager />
        </div>

        <LocationSelectionModal
          isOpen={showLocationSelector}
          onClose={() => setShowLocationSelector(false)}
          onLocationSelect={() => {}}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-full bg-background">
        {/* Header with Back Button */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={handleBackClick}
              className="w-10 h-10 bg-muted/20 rounded-xl flex items-center justify-center hover:bg-muted/30 transition-all duration-300 mr-2"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
              <Cloud className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl text-foreground font-semibold">Weather</h1>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 space-y-6 pb-24">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-48 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-full bg-background">
        {/* Header with Back Button */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={handleBackClick}
              className="w-10 h-10 bg-muted/20 rounded-xl flex items-center justify-center hover:bg-muted/30 transition-all duration-300 mr-2"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
              <Cloud className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl text-foreground font-semibold">Weather</h1>
              <p className="text-sm text-muted-foreground">Unavailable</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 space-y-6 pb-24">
          <div className="text-center">
            <Thermometer className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-lg font-semibold text-foreground mb-2">
              Weather Unavailable
            </div>
            <div className="text-muted-foreground mb-4">
              {error || "Failed to load weather data"}
            </div>
            <Button onClick={handleBackClick} variant="primary" size="default">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const todayForecast = forecast?.list?.slice(0, 8) || [];
  const dailyForecast =
    forecast?.list?.filter((item, index) => index % 8 === 0).slice(0, 5) || [];

  return (
    <div className="min-h-full bg-background">
      {/* Header with Back Button */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center space-x-3 mb-2">
          <button
            onClick={handleBackClick}
            className="w-10 h-10 bg-muted/20 rounded-xl flex items-center justify-center hover:bg-muted/30 transition-all duration-300 mr-2"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Cloud className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl text-foreground font-semibold">Weather</h1>
                <p className="text-sm text-muted-foreground">
                  {loading 
                    ? "Loading..." 
                    : selectedLocation?.name || weather?.name
                  }
                  {weather?.sys?.country && `, ${weather.sys.country}`}
                </p>
              </div>
              <button
                onClick={() => setShowLocationSelector(true)}
                className="p-2 rounded-full bg-muted/20 hover:bg-muted/30 transition-colors"
                title="Change location"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted/20 rounded-lg p-1 mt-4">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'current'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Current Weather
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'manage'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Manage Locations
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-12">
        {/* Storm-ready Mode Alert - Show only on current weather tab */}
        {activeTab === 'current' && weather && <Alert {...getStormReadyAlert()} />}

        {/* Current Weather Tab */}
        {activeTab === 'current' && (
          <>
            {!weather && loading && (
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-muted rounded-lg"></div>
                <div className="h-48 bg-muted rounded-lg"></div>
              </div>
            )}

            {!weather && error && (
              <div className="bg-card rounded-lg p-6 text-center">
                <Cloud className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Weather Unavailable
                </h2>
                <p className="text-muted-foreground mb-4">
                  Unable to fetch weather data for {selectedLocation?.name}. 
                  Please check your internet connection or try a different location.
                </p>
                <Button
                  onClick={() => setShowLocationSelector(true)}
                  variant="outline"
                  size="default"
                >
                  Change Location
                </Button>
              </div>
            )}

            {weather && (
              <>
                {/* Current Weather */}
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
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
                      <div className="bg-muted/20 rounded-xl p-3 border border-border/30">
                        <div className="flex items-center justify-center mb-2">
                          <Thermometer className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-muted-foreground text-xs">Feels like</div>
                        <div className="font-semibold text-foreground">
                          {Math.round(weather.main.feels_like)}°C
                        </div>
                      </div>

                      <div className="bg-muted/20 rounded-xl p-3 border border-border/30">
                        <div className="flex items-center justify-center mb-2">
                          <Droplets className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-muted-foreground text-xs">Humidity</div>
                        <div className="font-semibold text-foreground">
                          {weather.main.humidity}%
                        </div>
                      </div>

                      <div className="bg-muted/20 rounded-xl p-3 border border-border/30">
                        <div className="flex items-center justify-center mb-2">
                          <Wind className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-muted-foreground text-xs">Wind</div>
                <div className="font-semibold text-foreground">
                  {Math.round(weather.wind?.speed || 0)} m/s
                </div>
              </div>

              <div className="bg-muted/20 rounded-xl p-3 border border-border/30">
                <div className="flex items-center justify-center mb-2">
                  <Gauge className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-muted-foreground text-xs">Pressure</div>
                <div className="font-semibold text-foreground">
                  {weather.main.pressure} hPa
                </div>
              </div>

              <div className="bg-muted/20 rounded-xl p-3 border border-border/30">
                <div className="flex items-center justify-center mb-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-muted-foreground text-xs">Visibility</div>
                <div className="font-semibold text-foreground">
                  {(weather.visibility / 1000).toFixed(1)} km
                </div>
              </div>

              <div className="bg-muted/20 rounded-xl p-3 border border-border/30">
                <div className="flex items-center justify-center mb-2">
                  <Droplets className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-muted-foreground text-xs">UV Index</div>
                <div className="font-semibold text-foreground">N/A</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Forecast */}
        {todayForecast.length > 0 && (
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Today's Forecast
            </h2>
            <div className="relative">
              <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-modern scroll-smooth">
                {todayForecast.map((item, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 text-center min-w-[60px] bg-muted/10 rounded-xl p-3 hover:bg-muted/20 transition-colors border border-border/20"
                  >
                    <div className="text-xs text-muted-foreground mb-2">
                      {new Date(item.dt * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <img
                      src={getWeatherIcon(item.weather[0].icon)}
                      alt={item.weather[0].description}
                      className="w-8 h-8 mx-auto mb-2"
                    />
                    <div className="text-sm font-semibold text-foreground mb-1">
                      {Math.round(item.main.temp)}°
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.pop > 0 ? `${Math.round(item.pop * 100)}%` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {dailyForecast.length > 0 && (
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              5-Day Forecast
            </h2>
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

        {/* Back to Home Button */}
        <div className="mt-8 px-6">
          <BackToHomeButton onGoHome={handleBackClick} />
        </div>
      </div>
    </div>
  );
};
// Remove the default export at the end
