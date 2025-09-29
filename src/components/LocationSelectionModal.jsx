import React, { useState } from 'react';
import { MapPin, X, Check, Star, Plus } from 'lucide-react';
import { useLocationContext } from '../contexts/LocationContext';
import LocationSearch from './LocationSearch';

const LocationSelectionModal = ({ isOpen, onClose, onLocationSelect }) => {
  const {
    preferredLocations,
    selectedLocationId,
    selectLocation,
    addPreferredLocation,
  } = useLocationContext();

  const [showAddLocation, setShowAddLocation] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  // Handle selecting a location
  const handleLocationSelect = (locationId) => {
    try {
      selectLocation(locationId);
      if (onLocationSelect) {
        const location = preferredLocations.find(loc => loc.id === locationId);
        onLocationSelect(location);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle adding a new location
  const handleLocationAdd = (locationData) => {
    try {
      const newLocation = addPreferredLocation(locationData);
      selectLocation(newLocation.id);
      if (onLocationSelect) {
        onLocationSelect(newLocation);
      }
      setShowAddLocation(false);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-background border border-border rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Select Weather Location</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Add Location Toggle */}
          {!showAddLocation && (
            <button
              onClick={() => setShowAddLocation(true)}
              className="w-full mb-4 p-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Location</span>
            </button>
          )}

          {/* Add Location Search */}
          {showAddLocation && (
            <div className="mb-4 p-3 border border-border rounded-lg bg-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Add New Location</h3>
                <button
                  onClick={() => {
                    setShowAddLocation(false);
                    setError(null);
                  }}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Cancel
                </button>
              </div>
              <LocationSearch 
                onLocationAdd={handleLocationAdd}
                placeholder="Search for a city..."
              />
            </div>
          )}

          {/* Preferred Locations List */}
          {preferredLocations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No preferred locations yet</p>
              <p className="text-xs">Add a location above to get started</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {preferredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location.id)}
                  className={`w-full p-3 text-left rounded-lg border transition-colors ${
                    location.id === selectedLocationId
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm flex items-center space-x-2">
                          <span>{location.name}</span>
                          {location.id === selectedLocationId && (
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {location.country}
                        </div>
                      </div>
                    </div>
                    {location.id === selectedLocationId && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            Selected location will be used for weather display on the home screen
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationSelectionModal;