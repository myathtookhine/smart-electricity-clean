import React, { useState } from 'react';
import { motion } from "framer-motion";
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
import logoDark from "../assets/duracell-logo-white.svg";
import logoLight from "../assets/duracell-logo-black.svg";

export function Login() {
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
    return <RegisterUser onBack={handleBackToLogin} />;
  }

  return (
    <div className="h-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden pt-32">
      {/* Top Right Controls */}
      <div className="absolute top-16 w-full px-6 z-50">
        {/* Language Toggle */}

        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="text-center">
              <img
                src={theme === "dark" ? logoDark : logoLight}
                alt="DURACELL ENERGY"
                className="h-6 mx-auto"
              />
            </div>
          </motion.div>
          <div className="flex flex-row space-x-4">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-sm space-y-6">
        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <Field label="Account">
              <div>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email or username"
                  required
                />
              </div>
            </Field>
          </div>

          {/* Password Field */}
          <div>
            <Field label="Password">
              <div>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
            </Field>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <div>
            <div>
              <Button type="submit" disabled={isLoading} width="full" size="lg">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-center">
            <div>
              <Button
                variant="link"
                type="button"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </Button>
            </div>
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

            <div>
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
