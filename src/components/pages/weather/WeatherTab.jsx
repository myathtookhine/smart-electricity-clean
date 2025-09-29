import React, { useEffect } from "react";
import { useWeather } from "../../../hooks/useWeather";
import { useApp } from "../../../contexts/AppContext";
import { useLocationContext } from "../../../contexts/LocationContext";
import { getWeatherIcon } from "../../../utils/weatherIcons";
import {
  MapPin,
  Thermometer,
  CircleQuestionMark,
  ArrowRightCircle,
  Settings,
} from "lucide-react";

const WeatherTab = ({ className = "", onClick, onWeatherClick }) => {
  const { selectedLocation } = useLocationContext();
  const { weather, loading, error } = useWeather(
    selectedLocation?.lat,
    selectedLocation?.lon
  );
  const { checkForStormConditions } = useApp();

  // Monitor weather for storm conditions when weather data updates
  useEffect(() => {
    if (weather && !loading && !error) {
      checkForStormConditions(weather);
    }
  }, [weather, loading, error, checkForStormConditions]);

  if (loading) {
    return (
      <div
        className={`bg-card rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors ${className}`}
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 bg-muted rounded w-20 mb-2"></div>
              <div className="h-4 bg-muted rounded w-32 mb-1"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </div>
            <div className="w-12 h-12 bg-muted rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div
        className={`bg-card rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors ${className}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              <span className="text-lg font-semibold text-muted-foreground">
                --°C
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {!selectedLocation
                ? "No location selected"
                : "Weather unavailable"}
            </p>
            <p className="text-xs text-muted-foreground">
              {!selectedLocation
                ? "Add a preferred location to see weather"
                : "Unable to fetch weather data"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (onWeatherClick) {
                  onWeatherClick();
                }
              }}
              title="Manage weather locations"
            >
              <Settings className="w-4 h-4" />
            </button>
            <CircleQuestionMark className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  const handleClick = () => {
    if (onWeatherClick) {
      onWeatherClick(); // Navigate to weather page
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`bg-card border rounded-lg p-3 py-2 cursor-pointer hover:bg-accent transition-colors ${className} relative`}
      onClick={handleClick}
    >
      {/* Detail button in top right corner */}
      <button
        className="absolute bottom-3 right-3 p-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click
          if (onWeatherClick) {
            onWeatherClick();
          }
        }}
        aria-label="View weather details"
      >
        <ArrowRightCircle className="w-6 h-6" />
      </button>

      <div className="flex items-center justify-start">
        <div className="flex-shrink-0 mr-4">
          <img
            src={getWeatherIcon(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            className="w-20 h-20 object-contain"
          />
        </div>
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-lg font-semibold text-foreground">
              {Math.round(weather.main.temp)}°C
            </span>
            <span className="text-xs text-muted-foreground">
              feels {Math.round(weather.main.feels_like)}°
            </span>
            <p className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full capitalize mb-1">
              {weather.weather[0].description}
            </p>
          </div>
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
              <p className="text-sm text-muted-foreground">
                {selectedLocation?.name || weather.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherTab;
