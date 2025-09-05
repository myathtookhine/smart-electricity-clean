import { useState, useEffect } from 'react';
import { weatherService } from '../services/weatherService';

export const useWeather = (lat = null, lon = null) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!lat || !lon) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const [currentWeather, forecastData] = await Promise.all([
          weatherService.getCurrentWeather(lat, lon),
          weatherService.getForecast(lat, lon)
        ]);
        
        setWeather(currentWeather);
        setForecast(forecastData);
      } catch (err) {
        setError(err.message);
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [lat, lon]);

  return { weather, forecast, loading, error };
};
