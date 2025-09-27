import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { PhoneMockup } from "./components/PhoneMockup";
import { BottomNavigation } from "./components/BottomNavigation";
import { HomePage } from "./components/pages/HomePage";
import { InsightsPage } from "./components/pages/InsightsPage";
import { WeatherPage } from "./components/pages/weather/WeatherPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { NotificationPage } from "./components/pages/NotificationPage";
import { AppProvider, useApp } from "./contexts/AppContext";
import { WeatherProvider } from "./contexts/WeatherContext";
import { AppWizard } from "./components/AppWizard";
import { Login } from "./components/Login";
import { LoginModeSelection } from "./components/LoginModeSelection";
import { SystemBinding } from "./components/SystemBinding";
import { ChangePassword } from "./components/ChangePassword";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const [previousPage, setPreviousPage] = useState("home");
  const [isInSubPage, setIsInSubPage] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLoginLoading, setShowLoginLoading] = useState(false);
  const { isFirstTime, isAuthenticated, onboardingStep, isOnboardingComplete } =
    useApp();

  // Ensure we're on home page when onboarding completes
  React.useEffect(() => {
    if (isAuthenticated && !onboardingStep && isOnboardingComplete) {
      setCurrentPage("home");
    }
  }, [isAuthenticated, onboardingStep, isOnboardingComplete]);

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Show loading overlay when user logs in and is on home page
  useEffect(() => {
    if (
      isAuthenticated &&
      !onboardingStep &&
      isOnboardingComplete &&
      currentPage === "home"
    ) {
      setShowLoginLoading(true);
      const timer = setTimeout(() => {
        setShowLoginLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, onboardingStep, isOnboardingComplete, currentPage]);

  const handlePageChange = (page) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
    // Reset sub-page state when navigating to main pages
    if (["home", "insights", "weather"].includes(page)) {
      setIsInSubPage(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onPageChange={handlePageChange} />;
      case "insights":
        return <InsightsPage onPageChange={handlePageChange} />;
      case "weather":
        return (
          <WeatherPage
            onPageChange={handlePageChange}
            fromPage={previousPage}
          />
        );
      case "settings":
        return (
          <SettingsPage
            onSubPageChange={setIsInSubPage}
            onPageChange={handlePageChange}
          />
        );
      case "notifications":
        return <NotificationPage onPageChange={handlePageChange} />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  const renderOnboardingStep = () => {
    switch (onboardingStep) {
      case "systemBinding":
        return <SystemBinding />;
      default:
        return null;
    }
  };

  const handlePasswordChangeComplete = () => {
    setShowChangePassword(false);
    // Return to guided handover page after password change
    if (onboardingStep === "guidedHandover") {
      // User can continue with the handover or complete onboarding
    }
  };

  const handleChangePasswordBack = () => {
    setShowChangePassword(false);
    // If coming from guided handover, return to that step
    // Otherwise, this handles navigation appropriately
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-black flex items-center justify-center p-4">
        <PhoneMockup>
          {/* Show wizard if it's the first time */}
          {isFirstTime ? (
            <AppWizard />
          ) : !isAuthenticated ? (
            /* Show login if not authenticated */
            <Login />
          ) : showChangePassword ? (
            /* Show change password page */
            <ChangePassword
              onBack={handleChangePasswordBack}
              onComplete={handlePasswordChangeComplete}
            />
          ) : onboardingStep ? (
            /* Show onboarding steps after login */
            renderOnboardingStep()
          ) : (
            /* Show main app if authenticated and onboarding complete */
            <div className="flex flex-col h-full bg-background relative">
              {/* iPhone Status Bar */}
              <div className="flex justify-between items-center px-8 py-3 bg-background">
                {/* Left side - Time */}
                <div className="text-sm font-semibold text-foreground">
                  {currentTime}
                </div>

                {/* Right side - Signal, WiFi, Battery */}
                <div className="flex items-center space-x-1">
                  {/* Signal bars */}
                  <div className="flex items-end space-x-0.5">
                    <div className="w-1 h-1 bg-foreground rounded-full"></div>
                    <div className="w-1 h-2 bg-foreground rounded-full"></div>
                    <div className="w-1 h-3 bg-foreground rounded-full"></div>
                    <div className="w-1 h-4 bg-foreground rounded-full"></div>
                  </div>
                  {/* WiFi icon */}
                  <div className="ml-1">
                    <svg
                      width="15"
                      height="11"
                      viewBox="0 0 15 11"
                      fill="none"
                      className="text-foreground"
                    >
                      <path
                        d="M1.5 4.5C4.5 1.5 10.5 1.5 13.5 4.5M3.5 6.5C5.5 4.5 9.5 4.5 11.5 6.5M5.5 8.5C6.5 7.5 8.5 7.5 9.5 8.5M7.5 10.5H7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {/* Battery */}
                  <div className="ml-1">
                    <svg
                      width="24"
                      height="12"
                      viewBox="0 0 24 12"
                      fill="none"
                      className="text-foreground"
                    >
                      <rect
                        x="1"
                        y="2"
                        width="18"
                        height="8"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                      <path
                        opacity="0.4"
                        d="M21 4V8C21.5523 8 22 7.55228 22 7V5C22 4.44772 21.5523 4 21 4Z"
                        fill="currentColor"
                      />
                      <rect
                        x="2"
                        y="3"
                        width="16"
                        height="6"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Page Content with Scrolling */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="pb-24">{renderPage()}</div>
              </div>

              {/* Login Loading Overlay */}
              {showLoginLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="text-white text-xl font-semibold animate-pulse">
                    Loading your dashboard...
                  </div>
                </div>
              )}

              {/* Bottom Navigation */}
              {!isInSubPage && currentPage !== "weather" && (
                <BottomNavigation
                  activeTab={currentPage}
                  onTabChange={handlePageChange}
                />
              )}
            </div>
          )}
        </PhoneMockup>
      </div>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AppProvider>
      <WeatherProvider>
        <AppContent />
      </WeatherProvider>
    </AppProvider>
  );
}

export default App;
