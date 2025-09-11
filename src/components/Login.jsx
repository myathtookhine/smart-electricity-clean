import React, { useState } from 'react';
import { Zap, Moon, Sun, Globe } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "./ThemeProvider";
import { Input } from "./ui/input";
import { PasswordInput } from "./ui/password-input";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { ForgotPassword } from "./ForgotPassword";
import { RegisterUser } from "./RegisterUser";
import { LanguageChangeModal } from "./LanguageChangeModal";
import duracellLogo from "../assets/duracell-logo.png";

export function Login() {
  const [userType, setUserType] = useState("monitoring"); // "monitoring" or "service"
  const [currentView, setCurrentView] = useState("login"); // "login", "register", "forgot-password"

  // Login form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const { login } = useApp();
  const { theme, setTheme } = useTheme();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate loading time
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError("Invalid username or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleForgotPassword = () => {
    setCurrentView("forgot-password");
  };

  const handleRegisterUser = () => {
    setCurrentView("register");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    console.log("Language changed to:", languageCode);
    // Here you would typically update your i18n context or global language state
  };

  // Show Forgot Password screen if requested
  if (currentView === "forgot-password") {
    return <ForgotPassword onBack={handleBackToLogin} />;
  }

  // Show Register screen if requested
  if (currentView === "register") {
    return <RegisterUser userType={userType} onBack={handleBackToLogin} />;
  }

  return (
    <div className="h-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Top Right Controls */}
      <div className="absolute top-12 right-6 z-50 flex items-center space-x-3">
        {/* Language Toggle */}
        <button
          onClick={() => setShowLanguageModal(true)}
          className="p-2 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all duration-300"
        >
          <Globe className="w-5 h-5 text-foreground" />
        </button>

        {/* Light/Dark Mode Toggle */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all duration-300"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      {/* Background Pattern */}
      {/* <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-foreground/10 rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 border border-foreground/10 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 border border-foreground/10 rounded-full"></div>
      </div> */}

      {/* Main Content */}
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center mb-8">
          {/* <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div> */}
          <div className="text-center">
            <img
              src={duracellLogo}
              alt="DURACELL ENERGY"
              className="h-12 mx-auto mb-4 brightness-0 invert dark:brightness-100 dark:invert-0"
            />
          </div>
        </div>

        {/* User Type Tabs */}
        <div className="flex bg-muted/30 rounded-full p-1.5 mb-6 border border-muted/40 space-x-2">
          <button
            onClick={() => setUserType("monitoring")}
            className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
              userType === "monitoring"
                ? "bg-primary text-background font-semibold shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/20 bg-background/50 border border-muted/30"
            }`}
          >
            Monitoring
          </button>
          <button
            onClick={() => setUserType("service")}
            className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
              userType === "service"
                ? "bg-primary text-background font-semibold shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/20 bg-background/50 border border-muted/30"
            }`}
          >
            Service
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          {/* Username Field */}
          <Field label="Username">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </Field>

          {/* Password Field */}
          <Field label="Password">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </Field>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <Button type="submit" disabled={isLoading} width="full" size="lg">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Forgot Password */}
          <div className="text-center">
            <Button variant="link" type="button" onClick={handleForgotPassword}>
              Forgot password?
            </Button>
          </div>

          {/* Register New User Button */}
          <div className="text-center space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">
                  Don't have an account?
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              width="full"
              size="lg"
              onClick={handleRegisterUser}
            >
              Register New User
            </Button>
          </div>
        </form>

        {/* Copyright */}
        <div className="text-center pt-4">
          <p className="text-muted-foreground text-xs">
            © 2025 Dura App. All rights reserved.
          </p>
        </div>
      </div>

      {/* Language Change Modal */}
      <LanguageChangeModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}
