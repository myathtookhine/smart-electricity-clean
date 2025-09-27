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
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // New onboarding flow state
  const [onboardingStep, setOnboardingStep] = useState(null); // 'loginMode', 'systemBinding', 'guidedHandover', null
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
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

  useEffect(() => {
    // Check if user has completed wizard before
    const hasCompletedWizard = localStorage.getItem("hasCompletedWizard");
    const savedUser = localStorage.getItem("currentUser");
    const savedLanguage = localStorage.getItem("currentLanguage");
    const hasCompletedOnboarding = localStorage.getItem(
      "hasCompletedOnboarding"
    );

    if (hasCompletedWizard) {
      setIsFirstTime(false);
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    if (hasCompletedOnboarding) {
      setIsOnboardingComplete(true);
    }
  }, []);

  const completeWizard = () => {
    setIsFirstTime(false);
    localStorage.setItem("hasCompletedWizard", "true");
  };

  const login = (username, password) => {
    // Simple authentication
    if (username === "john" && password === "123123") {
      const userData = { username: "john", name: "John Doe" };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // Skip login mode selection and go directly to system binding
      setOnboardingStep("systemBinding");

      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setOnboardingStep(null);
    setIsOnboardingComplete(false);
    setShowGuidedHandoverModal(false);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("hasCompletedOnboarding");
  };

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem("currentLanguage", languageCode);
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
