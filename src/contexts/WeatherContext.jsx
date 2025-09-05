import React, { createContext, useContext, useState, useEffect } from 'react';

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [apiKey, setApiKey] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null, city: '' });
  const [lastFetch, setLastFetch] = useState(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openweather-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage whenever it changes
  const updateApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('openweather-api-key', key);
    } else {
      localStorage.removeItem('openweather-api-key');
    }
  };

  // Check if weather data needs refresh (older than 10 minutes)
  const needsRefresh = () => {
    if (!lastFetch) return true;
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    return (now - lastFetch) > tenMinutes;
  };

  // Fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async (lat, lon) => {
    if (!apiKey) {
      throw new Error('OpenWeatherMap API key is required');
    }

    try {
      // Fetch current weather
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      
      if (!currentWeatherResponse.ok) {
        if (currentWeatherResponse.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
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
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        }
        throw new Error(`HTTP error! status: ${forecastResponse.status}`);
      }
      
      const forecast = await forecastResponse.json();

      setWeatherData(currentWeather);
      setForecastData(forecast);
      setLocation(prev => ({ ...prev, city: currentWeather.name }));
      setLastFetch(Date.now());

      return { currentWeather, forecast };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  };

  const value = {
    apiKey,
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
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
