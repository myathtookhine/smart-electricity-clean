// Import weather icons as modules (Vite will handle the paths)
import clearDay from '../assets/weather/clear-day.svg';
import clearNight from '../assets/weather/clear-night.svg';
import partlyCloudyDay from '../assets/weather/partly-cloudy-day.svg';
import partlyCloudyNight from '../assets/weather/partly-cloudy-night.svg';
import cloudy from '../assets/weather/cloudy.svg';
import overcastDay from '../assets/weather/overcast-day.svg';
import overcastNight from '../assets/weather/overcast-night.svg';
import drizzle from '../assets/weather/drizzle.svg';
import partlyCloudyDayRain from '../assets/weather/partly-cloudy-day-rain.svg';
import rain from '../assets/weather/rain.svg';
import lightningBolt from '../assets/weather/lightning-bolt.svg';
import thunderstorms from '../assets/weather/thunderstorms.svg';
import snow from '../assets/weather/snow.svg';
import fogDay from '../assets/weather/fog-day.svg';
import fogNight from '../assets/weather/fog-night.svg';
import notAvailable from '../assets/weather/not-available.svg';

// Map OpenWeather icon codes to your local assets
export const getWeatherIcon = (iconCode) => {
  const iconMap = {
    // Clear sky
    '01d': clearDay,
    '01n': clearNight,
    
    // Few clouds
    '02d': partlyCloudyDay,
    '02n': partlyCloudyNight,
    
    // Scattered clouds
    '03d': cloudy,
    '03n': cloudy,
    
    // Broken clouds
    '04d': overcastDay,
    '04n': overcastNight,
    
    // Shower rain
    '09d': drizzle,
    '09n': drizzle,
    
    // Rain
    '10d': partlyCloudyDayRain,
    '10n': rain,
    
    // Thunderstorm
    '11d': lightningBolt,
    '11n': thunderstorms,
    
    // Snow
    '13d': snow,
    '13n': snow,
    
    // Mist/Fog
    '50d': fogDay,
    '50n': fogNight
  };

  return iconMap[iconCode] || notAvailable;
};

// Optional: Export weather descriptions for additional context
export const getWeatherDescription = (weatherCode) => {
  const descriptions = {
    200: 'Thunderstorm with light rain',
    201: 'Thunderstorm with rain',
    202: 'Thunderstorm with heavy rain',
    210: 'Light thunderstorm',
    211: 'Thunderstorm',
    212: 'Heavy thunderstorm',
    221: 'Ragged thunderstorm',
    230: 'Thunderstorm with light drizzle',
    231: 'Thunderstorm with drizzle',
    232: 'Thunderstorm with heavy drizzle',
    300: 'Light intensity drizzle',
    301: 'Drizzle',
    302: 'Heavy intensity drizzle',
    310: 'Light intensity drizzle rain',
    311: 'Drizzle rain',
    312: 'Heavy intensity drizzle rain',
    313: 'Shower rain and drizzle',
    314: 'Heavy shower rain and drizzle',
    321: 'Shower drizzle',
    500: 'Light rain',
    501: 'Moderate rain',
    502: 'Heavy intensity rain',
    503: 'Very heavy rain',
    504: 'Extreme rain',
    511: 'Freezing rain',
    520: 'Light intensity shower rain',
    521: 'Shower rain',
    522: 'Heavy intensity shower rain',
    531: 'Ragged shower rain',
    600: 'Light snow',
    601: 'Snow',
    602: 'Heavy snow',
    611: 'Sleet',
    612: 'Light shower sleet',
    613: 'Shower sleet',
    615: 'Light rain and snow',
    616: 'Rain and snow',
    620: 'Light shower snow',
    621: 'Shower snow',
    622: 'Heavy shower snow',
    701: 'Mist',
    711: 'Smoke',
    721: 'Haze',
    731: 'Sand/dust whirls',
    741: 'Fog',
    751: 'Sand',
    761: 'Dust',
    762: 'Volcanic ash',
    771: 'Squalls',
    781: 'Tornado',
    800: 'Clear sky',
    801: 'Few clouds',
    802: 'Scattered clouds',
    803: 'Broken clouds',
    804: 'Overcast clouds'
  };

  return descriptions[weatherCode] || 'Unknown weather condition';
};
