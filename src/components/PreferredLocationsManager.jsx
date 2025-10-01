import React, { useState } from 'react';
import { MapPin, Trash2, Star, Plus, CheckCircle, XCircle } from "lucide-react";
import { useLocationContext } from "../contexts/LocationContext";
import LocationSearch from "./LocationSearch";

const PreferredLocationsManager = () => {
  const {
    preferredLocations,
    selectedLocationId,
    addPreferredLocation,
    removePreferredLocation,
    selectLocation,
  } = useLocationContext();

  const [showAddLocation, setShowAddLocation] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle adding a new location
  const handleLocationAdd = (locationData) => {
    try {
      addPreferredLocation(locationData);
      setSuccess(`✓ ${locationData.name} added successfully`);
      setError(null);
      setShowAddLocation(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to add location: ${err.message}`);
      setSuccess(null);
    }
  };

  // Handle removing a location
  const handleLocationRemove = (locationId) => {
    const location = preferredLocations.find((loc) => loc.id === locationId);
    if (location) {
      try {
        removePreferredLocation(locationId);
        setSuccess(`✓ ${location.name} removed successfully`);
        setError(null);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(`Failed to remove location: ${err.message}`);
        setSuccess(null);
      }
    }
  };

  // Handle selecting a location as default
  const handleLocationSelect = (locationId) => {
    try {
      selectLocation(locationId);
      const location = preferredLocations.find((loc) => loc.id === locationId);
      setSuccess(`${location?.name} set as home location`);
      setError(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to set home location: ${err.message}`);
      setSuccess(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Preferred Locations
        </h3>
        {!showAddLocation && (
          <button
            onClick={() => setShowAddLocation(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm font-medium text-green-700 dark:text-green-300">
            {success}
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* Add Location Search */}
      {showAddLocation && (
        <div className="p-4 border border-border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Add New Location</h4>
            <button
              onClick={() => {
                setShowAddLocation(false);
                setError(null);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
          <LocationSearch
            onLocationAdd={handleLocationAdd}
            placeholder="Search for a city to add..."
          />
        </div>
      )}

      {/* Preferred Locations List */}
      {preferredLocations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No preferred locations yet</p>
          <p className="text-sm">
            Add some locations to manage your weather preferences
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {preferredLocations.map((location) => (
            <div
              key={location.id}
              className={`p-3 border rounded-xl transition-all ${
                location.id === selectedLocationId
                  ? "border-primary/50 bg-primary/5 shadow-sm"
                  : "border-border/50 bg-card/50 hover:bg-accent/50 hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={`p-1.5 rounded-lg ${
                      location.id === selectedLocationId
                        ? "bg-primary/10"
                        : "bg-muted/50"
                    }`}
                  >
                    <MapPin
                      className={`w-4 h-4 ${
                        location.id === selectedLocationId
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground text-sm truncate">
                        {location.name}
                      </span>
                      {location.id === selectedLocationId && (
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {[location.state, location.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Currently Selected Badge */}
                  {location.id === selectedLocationId && (
                    <span className="px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-lg font-medium whitespace-nowrap">
                      Home
                    </span>
                  )}

                  <div className="flex flex-col items-end space-y-2">
                    {/* Remove Button */}
                    <button
                      onClick={() => handleLocationRemove(location.id)}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Remove location"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {/* Set as Default Button */}
                    {location.id !== selectedLocationId && (
                      <button
                        onClick={() => handleLocationSelect(location.id)}
                        className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors whitespace-nowrap"
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Text */}
      <div className="text-xs text-muted-foreground space-y-0.5 bg-muted/20 p-3 rounded-lg">
        <p>• Your home location is shown on the main weather tab</p>
        <p>• Switch between locations anytime</p>
      </div>
    </div>
  );
};

export default PreferredLocationsManager;