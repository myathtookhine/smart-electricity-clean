import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const LocationContext = createContext();
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0';
const GEO_LIMIT = 1;
const ENV_API_KEY = (import.meta.env.VITE_OPENWEATHER_API_KEY || '').trim();
const FALLBACK_LOCATION_NAME = 'Current Location';

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  // State for managing preferred locations
  const [preferredLocations, setPreferredLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [autoDetectError, setAutoDetectError] = useState(null);
  const autoDetectAttemptedRef = useRef(false);

  const buildLocationPayload = (metadata, lat, lon) => {
    const displayName = metadata?.name?.trim() || FALLBACK_LOCATION_NAME;
    const stateName = metadata?.state?.trim();
    return {
      name: stateName ? `${displayName}, ${stateName}` : displayName,
      country: metadata?.country || metadata?.sys?.country || '',
      lat,
      lon,
      timezone: metadata?.timezone ?? metadata?.timezone_offset ?? null,
      state: stateName || null,
    };
  };

  async function resolveLocationMetadata(lat, lon) {
    if (!ENV_API_KEY) {
      return null;
    }

    try {
      const response = await fetch(
        `${GEO_BASE_URL}/reverse?lat=${lat}&lon=${lon}&limit=${GEO_LIMIT}&appid=${ENV_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
    } catch (error) {
      console.warn('Unable to resolve device location metadata:', error);
    }

    return null;
  }

  // Load saved locations and selected location from localStorage
  useEffect(() => {
    const savedLocations = localStorage.getItem('preferredLocations');
    const savedSelectedId = localStorage.getItem('selectedLocationId');
    
    if (savedLocations) {
      try {
        const locations = JSON.parse(savedLocations);
        setPreferredLocations(locations);
      } catch (error) {
        console.error('Error parsing saved locations:', error);
      }
    }
    
    if (savedSelectedId) {
      setSelectedLocationId(savedSelectedId);
    }
  }, []);

  // Save preferred locations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('preferredLocations', JSON.stringify(preferredLocations));
  }, [preferredLocations]);

  // Save selected location ID to localStorage whenever it changes
  useEffect(() => {
    if (selectedLocationId) {
      localStorage.setItem('selectedLocationId', selectedLocationId);
    } else {
      localStorage.removeItem('selectedLocationId');
    }
  }, [selectedLocationId]);

  // Add a new preferred location
  const addPreferredLocation = (locationData) => {
    const newLocation = {
      id: Date.now().toString(),
      name: locationData.name,
      country: locationData.country || locationData.sys?.country,
      lat: locationData.coord?.lat || locationData.lat,
      lon: locationData.coord?.lon || locationData.lon,
      timezone: locationData.timezone,
      state: locationData.state || null,
      addedAt: new Date().toISOString(),
    };

    // Check if location already exists (by coordinates)
    const existingLocation = preferredLocations.find(
      (loc) => 
        Math.abs(loc.lat - newLocation.lat) < 0.01 && 
        Math.abs(loc.lon - newLocation.lon) < 0.01
    );

    if (existingLocation) {
      throw new Error('This location is already in your preferred locations');
    }

    setPreferredLocations((prev) => [...prev, newLocation]);

    // If this is the first location, set it as selected
    if (preferredLocations.length === 0) {
      setSelectedLocationId(newLocation.id);
    }

    return newLocation;
  };

  const ensureLocationStored = (locationPayload) => {
    if (!locationPayload?.lat || !locationPayload?.lon) {
      throw new Error('Invalid location coordinates');
    }

    const existingLocation = preferredLocations.find(
      (loc) =>
        Math.abs(loc.lat - locationPayload.lat) < 0.01 &&
        Math.abs(loc.lon - locationPayload.lon) < 0.01
    );

    if (existingLocation) {
      setSelectedLocationId(existingLocation.id);
      return existingLocation;
    }

    const created = addPreferredLocation(locationPayload);
    setSelectedLocationId(created.id);
    return created;
  };

  // Remove a preferred location
  const removePreferredLocation = (locationId) => {
    setPreferredLocations((prev) => prev.filter((loc) => loc.id !== locationId));
    
    // If the removed location was selected, clear the selection
    if (selectedLocationId === locationId) {
      // Try to select the first remaining location
      const remainingLocations = preferredLocations.filter((loc) => loc.id !== locationId);
      if (remainingLocations.length > 0) {
        setSelectedLocationId(remainingLocations[0].id);
      } else {
        setSelectedLocationId(null);
      }
    }
  };

  // Set the selected location for home weather display
  const selectLocation = (locationId) => {
    const location = preferredLocations.find((loc) => loc.id === locationId);
    if (location) {
      setSelectedLocationId(locationId);
    } else {
      throw new Error('Location not found in preferred locations');
    }
  };

  // Get the currently selected location
  const getSelectedLocation = () => {
    if (!selectedLocationId) return null;
    return preferredLocations.find((loc) => loc.id === selectedLocationId) || null;
  };

  // Check if a location is already in preferred locations
  const isLocationPreferred = (lat, lon) => {
    return preferredLocations.some(
      (loc) => 
        Math.abs(loc.lat - lat) < 0.01 && 
        Math.abs(loc.lon - lon) < 0.01
    );
  };

  // Update location data (useful for updating timezone or other info)
  const updatePreferredLocation = (locationId, updates) => {
    setPreferredLocations((prev) =>
      prev.map((loc) =>
        loc.id === locationId ? { ...loc, ...updates } : loc
      )
    );
  };

  const attemptDeviceLocationBootstrap = (force = false) => {
    if (autoDetectAttemptedRef.current && !force) {
      return;
    }

    if (typeof window === 'undefined' || !navigator?.geolocation) {
      autoDetectAttemptedRef.current = true;
      if (!preferredLocations.length) {
        setAutoDetectError('Location services are not supported in this environment.');
      }
      return;
    }

    autoDetectAttemptedRef.current = true;
    setIsAutoDetecting(true);
    setAutoDetectError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const metadata = await resolveLocationMetadata(latitude, longitude);
          const payload = buildLocationPayload(metadata, latitude, longitude);
          ensureLocationStored(payload);
          setAutoDetectError(null);
        } catch (error) {
          console.warn('Automatic location detection failed, attempting fallback.', error);
          try {
            const fallbackPayload = buildLocationPayload(null, latitude, longitude);
            ensureLocationStored(fallbackPayload);
            setAutoDetectError(null);
          } catch (fallbackError) {
            console.error('Unable to store fallback device location:', fallbackError);
            setAutoDetectError(
              fallbackError?.message ||
                'Unable to save device location. Please add one manually.'
            );
          }
        } finally {
          setIsAutoDetecting(false);
        }
      },
      (geoError) => {
        setAutoDetectError(
          geoError?.message || 'Unable to access device location. Permission denied?'
        );
        setIsAutoDetecting(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5 * 60 * 1000,
        timeout: 15000,
      }
    );
  };

  useEffect(() => {
    if (!preferredLocations.length && !selectedLocationId) {
      attemptDeviceLocationBootstrap();
    }
  }, [preferredLocations.length, selectedLocationId]);

  const value = {
    preferredLocations,
    selectedLocationId,
    selectedLocation: getSelectedLocation(),
    addPreferredLocation,
    removePreferredLocation,
    selectLocation,
    getSelectedLocation,
    isLocationPreferred,
    updatePreferredLocation,
    autoDetecting: isAutoDetecting,
    autoDetectError,
    requestDeviceLocation: () => attemptDeviceLocationBootstrap(true),
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};