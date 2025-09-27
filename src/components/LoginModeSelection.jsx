import React from "react";
import { Home, Plus, ArrowRight, Building2, UserCheck, ArrowLeft } from "lucide-react";
import { useApp } from "../contexts/AppContext";

export const LoginModeSelection = () => {
  const { selectExistingHomeOwner, nextOnboardingStep, logout } = useApp();

  const handleExistingHomeOwner = () => {
    selectExistingHomeOwner();
  };

  const handleCreateNewPlant = () => {
    nextOnboardingStep();
  };

  const handleBackToLogin = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Choose Your Setup
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          Select how you'd like to proceed with your account setup
        </p>
      </div>

      {/* Mode Selection Cards */}
      <div className="flex-1 px-6 py-4 space-y-4">
        {/* Existing Home Owner Card */}
        <div
          onClick={handleExistingHomeOwner}
          className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Enter as Existing Home Owner
                </h3>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your system is already set up and configured. Continue directly to your dashboard to monitor your energy usage.
              </p>
              <div className="flex items-center mt-3 space-x-2">
                <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Quick Access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Plant Card */}
        <div
          onClick={handleCreateNewPlant}
          className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Create a New Plant
                </h3>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Set up a new energy monitoring system. We'll guide you through device binding and system configuration.
              </p>
              <div className="flex items-center mt-3 space-x-2">
                <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Full Setup Required
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-6 border-t border-border">
        <div className="text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            Not sure which option to choose? Contact support for assistance.
          </p>
          {/* <button
            onClick={handleBackToLogin}
            className="flex items-center justify-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};