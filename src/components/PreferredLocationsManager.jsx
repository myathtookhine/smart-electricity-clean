import React, { useState } from 'react';
import { MapPin, Trash2, Check, Star, Plus } from 'lucide-react';
import { useLocationContext } from '../contexts/LocationContext';
import LocationSearch from './LocationSearch';
import { Alert } from '../components/ui/alert';

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
      setSuccess(`Added ${locationData.name} to your preferred locations`);
      setError(null);
      setShowAddLocation(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  // Handle removing a location
  const handleLocationRemove = (locationId) => {
    const location = preferredLocations.find(loc => loc.id === locationId);
    if (location) {
      removePreferredLocation(locationId);
      setSuccess(`Removed ${location.name} from preferred locations`);
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Handle selecting a location as default
  const handleLocationSelect = (locationId) => {
    try {
      selectLocation(locationId);
      const location = preferredLocations.find(loc => loc.id === locationId);
      setSuccess(`${location?.name} set as your home weather location`);
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Preferred Locations</h3>
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
        <Alert className="border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <div className="text-green-800">{success}</div>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <div>{error}</div>
        </Alert>
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
          <p className="text-sm">Add some locations to manage your weather preferences</p>
        </div>
      ) : (
        <div className="space-y-2">
          {preferredLocations.map((location) => (
            <div
              key={location.id}
              className={`p-4 border rounded-lg transition-colors ${
                location.id === selectedLocationId
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:bg-accent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="font-medium flex items-center space-x-2">
                      <span className='text-foreground'>{location.name}</span>
                      {location.id === selectedLocationId && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {[location.state, location.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Set as Default Button */}
                  {location.id !== selectedLocationId && (
                    <button
                      onClick={() => handleLocationSelect(location.id)}
                      className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                    >
                      Set as Default
                    </button>
                  )}

                  {/* Currently Selected Badge */}
                  {location.id === selectedLocationId && (
                    <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full font-medium">
                      Home Location
                    </span>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => handleLocationRemove(location.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                    title="Remove location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Text */}
      <div className="text-sm text-muted-foreground">
        <p>• Your home location will be displayed on the main weather tab</p>
        <p>• You can switch between preferred locations anytime</p>
        <p>• Location data is saved locally on your device</p>
      </div>
    </div>
  );
};

export default PreferredLocationsManager;