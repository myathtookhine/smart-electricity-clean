import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Plus } from 'lucide-react';
import { useWeather as useWeatherContext } from '../contexts/WeatherContext';
import { useLocationContext } from '../contexts/LocationContext';

const LocationSearch = ({ onLocationAdd, placeholder = "Search for a city..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const { apiKey } = useWeatherContext();
  const { isLocationPreferred } = useLocationContext();
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Search for locations using OpenWeatherMap Geocoding API
  const searchLocations = async (searchQuery) => {
    if (!apiKey) {
      setError('OpenWeatherMap API key is required');
      return;
    }

    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=5&appid=${apiKey}`
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the results to include more readable information
      const transformedResults = data.map((location) => ({
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon,
        displayName: `${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`,
        isAlreadyAdded: isLocationPreferred(location.lat, location.lon),
      }));

      setResults(transformedResults);
    } catch (err) {
      setError(err.message);
      console.error('Location search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, apiKey]);

  // Handle location selection
  const handleLocationSelect = (location) => {
    if (location.isAlreadyAdded) {
      return;
    }

    try {
      if (onLocationAdd) {
        onLocationAdd(location);
      }
      setQuery('');
      setResults([]);
      setShowResults(false);
      inputRef.current?.blur();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle input focus/blur
  const handleInputFocus = () => {
    setShowResults(true);
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow for clicking
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {showResults && (query.trim().length > 1 || results.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-64 overflow-y-auto">
          {loading && query.trim().length > 1 && (
            <div className="p-3 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Searching...</span>
            </div>
          )}
          
          {!loading && results.length === 0 && query.trim().length > 1 && (
            <div className="p-3 text-sm text-muted-foreground">
              No locations found for "{query}"
            </div>
          )}
          
          {results.map((location, index) => (
            <button
              key={`${location.lat}-${location.lon}-${index}`}
              onClick={() => handleLocationSelect(location)}
              disabled={location.isAlreadyAdded}
              className={`w-full text-left p-3 hover:bg-accent flex items-center justify-between transition-colors ${
                location.isAlreadyAdded 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">{location.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {location.state && `${location.state}, `}{location.country}
                  </div>
                </div>
              </div>
              {location.isAlreadyAdded ? (
                <span className="text-xs text-muted-foreground">Already added</span>
              ) : (
                <Plus className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;