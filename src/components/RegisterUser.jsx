import React, { useState } from 'react';
import { Zap, Moon, Sun, ArrowLeft, Globe } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Input } from "./ui/input";
import { PasswordInput } from "./ui/password-input";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { LanguageChangeModal } from "./LanguageChangeModal";
import duracellLogo from "../assets/duracell-logo.png";

export function RegisterUser({ userType, onBack }) {
  // Register form states
  const [accountName, setAccountName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("(UTC+0:00) London, Dublin");
  const [verificationCode, setVerificationCode] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const { theme, setTheme } = useTheme();

  const timezones = [
    "(UTC+0:00) London, Dublin",
    "(UTC+1:00) Berlin, Paris",
    "(UTC+2:00) Cairo, Helsinki",
    "(UTC+3:00) Moscow, Istanbul",
    "(UTC+5:00) Karachi, Tashkent",
    "(UTC+8:00) Beijing, Singapore",
    "(UTC+9:00) Tokyo, Seoul",
    "(UTC-5:00) New York, Toronto",
    "(UTC-8:00) Los Angeles, Vancouver"
  ];

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!verificationCode) {
      setError("Please enter verification code");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      // Here you would typically call your registration API
      console.log("Registration data:", {
        accountName,
        password: registerPassword,
        email,
        timezone,
        verificationCode,
        userType
      });
      setIsLoading(false);
      // Go back to login after successful registration
      onBack();
    }, 1000);
  };

  const handleGetVerificationCode = () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }
    // Simulate sending verification code
    console.log("Sending verification code to:", email);
    // You would typically call your API here
  };

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    console.log("Language changed to:", languageCode);
    // Here you would typically update your i18n context or global language state
  };

  return (
    <div className="min-h-screen h-full bg-background flex flex-col items-center justify-center p-6 relative overflow-y-auto scrollbar-hide">
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

      {/* Back Button - Top Left */}
      <div className="absolute top-12 left-6 z-50">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Main Content with Slide Animation */}
      <div 
        className="w-full max-w-sm space-y-6 wizard-step forward py-24"
      >
        {/* Logo */}
        {/* <div className="text-center">
          <div className="text-center">
            <img 
              src={duracellLogo} 
              alt="DURACELL ENERGY" 
              className="h-12 mx-auto mb-4 brightness-0 invert dark:brightness-100 dark:invert-0"
            />
          </div>
        </div> */}

        {/* User Type Indicator */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center py-2 bg-primary/10 rounded-full">
            <span className="text-xl font-medium text-primary capitalize">
              {userType} Registration
            </span>
          </div>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-6">
          {/* Account Name Field */}
          <Field label="Account name">
            <Input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Account name"
              required
            />
          </Field>

          {/* Password Field */}
          <Field label="Password">
            <PasswordInput
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </Field>

          {/* Confirm Password Field */}
          <Field label="Confirm password">
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </Field>

          {/* Email Field */}
          <Field label="Email address">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Please enter your e-mail address"
              required
            />
          </Field>

          {/* Timezone Field */}
          <Field label="Location">
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full h-12 px-4 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </Field>

          {/* Verification Code Field */}
          <Field label="Verification code">
            <div className="flex gap-2">
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Please enter the verification code"
                required
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleGetVerificationCode}
                variant="primary"
                className="px-6"
              >
                GET
              </Button>
            </div>
          </Field>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Register Button */}
          <Button 
            type="submit" 
            disabled={isLoading} 
            width="full" 
            size="lg"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "REGISTER"
            )}
          </Button>

          {/* Return Button */}
          <Button 
            type="button" 
            variant="secondary" 
            width="full" 
            size="lg"
            onClick={onBack}
          >
            RETURN
          </Button>
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
