import React, { useState, useEffect } from 'react';
import { MapPin, X, AlertTriangle } from 'lucide-react';

const LocationPermissionModal = ({ isOpen, onRequestLocation, onClose, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Location Access</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            We need access to your location to show current weather conditions and provide personalized energy insights.
          </p>
          
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-destructive/10 rounded-lg mb-4">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Not Now
          </button>
          <button
            onClick={onRequestLocation}
            className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Enable Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionModal;
