import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Auto-authenticate with dummy credentials - no auth flow needed
  const [isFirstTime, setIsFirstTime] = useState(false); // Skip wizard
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always authenticated
  const [user, setUser] = useState({ username: "demo", name: "Demo User" }); // Dummy user
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Skip onboarding flow - always completed
  const [onboardingStep, setOnboardingStep] = useState(null); // No onboarding steps
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true); // Always complete
  const [showGuidedHandoverModal, setShowGuidedHandoverModal] = useState(false);

  // Battery state management
  const [batteryState, setBatteryState] = useState({
    isConfigured: true, // true, false
    isOnline: true, // true, false - only relevant if configured
  });

  // Storm Ready Mode state management
  const [stormReadyMode, setStormReadyMode] = useState({
    enabled: false, // User has enabled the feature
    isMonitoring: false, // System is monitoring weather for storms
    isActive: false, // System is actively charging due to storm
    stormDetected: false, // Weather API detected storm conditions
    manuallyTriggered: false, // Debug mode or manually triggered
  });

  // Visualization type state management
  const [visualizationType, setVisualizationType] = useState(() => {
    const saved = localStorage.getItem("visualizationType");
    return saved || "flat";
  });

  useEffect(() => {
    // Auto-complete wizard and onboarding on first load
    localStorage.setItem("hasCompletedWizard", "true");
    localStorage.setItem("hasCompletedOnboarding", "true");
    localStorage.setItem("currentUser", JSON.stringify({ username: "demo", name: "Demo User" }));

    // Load saved language preference if exists
    const savedLanguage = localStorage.getItem("currentLanguage");
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const completeWizard = () => {
    setIsFirstTime(false);
    localStorage.setItem("hasCompletedWizard", "true");
  };

  const login = (username, password) => {
    // Authentication bypassed - always succeed
    // Keeping this function for compatibility but it's not needed
    return true;
  };

  const logout = () => {
    // Since we're bypassing auth, logout just reloads the page
    // which will auto-authenticate again with dummy user
    window.location.reload();
  };

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem("currentLanguage", languageCode);
  };

  const changeVisualizationType = (type) => {
    setVisualizationType(type);
    localStorage.setItem("visualizationType", type);
  };

  // Onboarding flow functions
  const startOnboarding = () => {
    setOnboardingStep("loginMode");
  };

  const nextOnboardingStep = () => {
    switch (onboardingStep) {
      case "systemBinding":
        setOnboardingStep("guidedHandover");
        break;
      case "guidedHandover":
        completeOnboarding();
        break;
      default:
        break;
    }
  };

  const skipToHome = () => {
    completeOnboarding();
  };

  const selectExistingHomeOwner = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    setOnboardingStep(null);
    setIsOnboardingComplete(true);
    setShowGuidedHandoverModal(true);
    localStorage.setItem("hasCompletedOnboarding", "true");
  };

  const closeGuidedHandoverModal = () => {
    setShowGuidedHandoverModal(false);
  };

  // Storm detection function - checks weather conditions
  const checkForStormConditions = (weatherData) => {
    if (!weatherData || !stormReadyMode.enabled) return;

    // Check for storm-related weather conditions
    const stormConditions = [
      "thunderstorm",
      "heavy rain",
      "severe",
      "storm",
      "tornado",
      "hurricane",
      "hail",
    ];

    const currentWeather =
      weatherData.weather?.[0]?.description?.toLowerCase() || "";
    const mainWeather = weatherData.weather?.[0]?.main?.toLowerCase() || "";

    // Check if any storm condition exists
    const isStormDetected = stormConditions.some(
      (condition) =>
        currentWeather.includes(condition) ||
        mainWeather.includes("thunderstorm")
    );

    // Update storm ready mode if storm detected
    if (isStormDetected && !stormReadyMode.isActive) {
      setStormReadyMode((prev) => ({
        ...prev,
        stormDetected: true,
        isActive: true,
      }));
    } else if (
      !isStormDetected &&
      stormReadyMode.isActive &&
      !stormReadyMode.manuallyTriggered
    ) {
      // Reset if no storm and wasn't manually triggered
      setStormReadyMode((prev) => ({
        ...prev,
        stormDetected: false,
        isActive: false,
      }));
    }
  };

  const value = {
    isFirstTime,
    isAuthenticated,
    user,
    completeWizard,
    login,
    logout,
    batteryState,
    setBatteryState,
    stormReadyMode,
    setStormReadyMode,
    checkForStormConditions,
    currentLanguage,
    changeLanguage,
    visualizationType,
    changeVisualizationType,
    onboardingStep,
    setOnboardingStep,
    isOnboardingComplete,
    startOnboarding,
    nextOnboardingStep,
    skipToHome,
    selectExistingHomeOwner,
    completeOnboarding,
    showGuidedHandoverModal,
    closeGuidedHandoverModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
