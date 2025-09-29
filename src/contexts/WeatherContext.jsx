import React, { createContext, useContext, useState, useEffect } from 'react';

const WeatherContext = createContext();
const STORAGE_KEY = "openweather-api-key";
const DEFAULT_API_KEY = (import.meta.env.VITE_OPENWEATHER_API_KEY || "").trim();

export function WeatherProvider({ children }) {
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null, city: "" });
  const [lastFetch, setLastFetch] = useState(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    try {
      const savedApiKey = localStorage.getItem(STORAGE_KEY);
      if (savedApiKey) {
        const trimmedKey = savedApiKey.trim();
        if (trimmedKey) {
          setApiKey(trimmedKey);
        } else if (!DEFAULT_API_KEY) {
          setApiKey("");
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (storageError) {
      console.warn(
        "Unable to read OpenWeather API key from storage:",
        storageError
      );
    }
  }, []);

  // Save API key to localStorage whenever it changes
  const updateApiKey = (key) => {
    const trimmedKey = key?.trim() ?? "";

    if (trimmedKey) {
      setApiKey(trimmedKey);
      try {
        localStorage.setItem(STORAGE_KEY, trimmedKey);
      } catch (storageError) {
        console.warn("Unable to persist OpenWeather API key:", storageError);
      }
    } else {
      setApiKey(DEFAULT_API_KEY);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (storageError) {
        console.warn(
          "Unable to clear stored OpenWeather API key:",
          storageError
        );
      }
    }
  };

  const resolvedApiKey = apiKey?.trim() || DEFAULT_API_KEY;

  // Check if weather data needs refresh (older than 10 minutes)
  const needsRefresh = () => {
    if (!lastFetch) return true;
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    return now - lastFetch > tenMinutes;
  };

  // Fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async (lat, lon) => {
    if (!resolvedApiKey) {
      throw new Error("OpenWeatherMap API key is required");
    }

    try {
      // Fetch current weather
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${resolvedApiKey}&units=metric`
      );

      if (!currentWeatherResponse.ok) {
        if (currentWeatherResponse.status === 401) {
          throw new Error(
            "Invalid API key. Please check your OpenWeatherMap API key."
          );
        }
        throw new Error(`HTTP error! status: ${currentWeatherResponse.status}`);
      }

      const currentWeather = await currentWeatherResponse.json();

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      if (!forecastResponse.ok) {
        if (forecastResponse.status === 401) {
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${resolvedApiKey}&units=metric`;
        }
        throw new Error(`HTTP error! status: ${forecastResponse.status}`);
      }

      const forecast = await forecastResponse.json();

      setWeatherData(currentWeather);
      setForecastData(forecast);
      setLocation((prev) => ({ ...prev, city: currentWeather.name }));
      setLastFetch(Date.now());

      return { currentWeather, forecast };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  };

  const value = {
    apiKey: resolvedApiKey,
    updateApiKey,
    weatherData,
    forecastData,
    location,
    setLocation,
    fetchWeatherData,
    needsRefresh,
    lastFetch,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
