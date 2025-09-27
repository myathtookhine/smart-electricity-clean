import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  ArrowLeft,
  Globe,
  CheckCircle2,
  Mail,
  KeyRound,
  User,
  Copy,
  Check,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { LanguageChangeModal } from "./LanguageChangeModal";
import duracellLogo from "../assets/duracell-logo.png";

export function RegisterUser({ onBack }) {
  // Register form states
  const [homeownerName, setHomeownerName] = useState("");
  const [homeownerEmail, setHomeownerEmail] = useState("");
  const [successDetails, setSuccessDetails] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [copied, setCopied] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!homeownerName.trim()) {
      setError("Please enter the homeowner's full name");
      return;
    }

    if (!homeownerEmail.trim()) {
      setError("Please enter the homeowner's email address");
      return;
    }

    setIsLoading(true);

    const generateTemporaryPassword = () => {
      const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      return Array.from(
        { length: 10 },
        () => charset[Math.floor(Math.random() * charset.length)]
      ).join("");
    };

    const deriveUsername = () => {
      if (homeownerEmail.includes("@")) {
        const candidate = homeownerEmail
          .split("@")[0]
          .replace(/[^a-zA-Z0-9._-]/g, "");

        if (candidate.length >= 3) {
          return candidate.toLowerCase();
        }
      }

      const fromName = homeownerName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ".")
        .replace(/\.+/g, ".")
        .replace(/^\.|\.$/g, "");

      if (fromName.length >= 3) {
        return fromName;
      }

      const fallback = Math.random().toString(36).slice(2, 8);
      return `user_${fallback}`;
    };

    // Simulate registration process
    setTimeout(() => {
      // Here you would typically call your registration API
      const temporaryPassword = generateTemporaryPassword();
      const username = deriveUsername();

      console.log("Registration data:", {
        homeownerName,
        homeownerEmail,
        username,
        temporaryPassword,
      });

      setSuccessDetails({
        homeownerName,
        homeownerEmail,
        username,
        temporaryPassword,
      });

      setHomeownerName("");
      setHomeownerEmail("");
      setIsLoading(false);
    }, 1000);
  };

  const handleCreateAnother = () => {
    setSuccessDetails(null);
    setError("");
    setCopied(false);
  };

  const handleCopyPassword = async () => {
    if (!successDetails?.temporaryPassword) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(successDetails.temporaryPassword);
        setCopied(true);
      }
    } catch (copyError) {
      console.error("Failed to copy temporary password", copyError);
    }
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
      <div className="w-full max-w-xl space-y-6 wizard-step forward py-24">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Create a homeowner account
            </h1>
            <p className="text-sm text-muted-foreground">
              Installers can set up access for homeowners in two quick steps.
              Enter their details, submit, and we’ll handle the welcome email
              with credentials automatically.
            </p>
          </div>
        </div>

        {successDetails ? (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-emerald-200">
                    Account created for {successDetails.homeownerName}
                  </h2>
                  <p className="text-sm text-emerald-100/80">
                    A welcome email is already on its way to{" "}
                    {successDetails.homeownerEmail}. It includes the username
                    and temporary password shown below.
                  </p>
                </div>
              </div>

              <div className="bg-background/80 border border-border rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Username
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {successDetails.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Homeowner email
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {successDetails.homeownerEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3">
                    <KeyRound className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Temporary password
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {successDetails.temporaryPassword}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition-all duration-200 hover:bg-muted/30"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Homeowners can sign in with either their username or email
                  using this temporary password.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                width="full"
                size="lg"
                onClick={handleCreateAnother}
              >
                Register New
              </Button>
              <Button
                type="button"
                variant="secondary"
                width="full"
                size="lg"
                onClick={onBack}
              >
                Back to Login
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <Field label="Homeowner full name">
              <Input
                type="text"
                value={homeownerName}
                onChange={(e) => setHomeownerName(e.target.value)}
                placeholder="e.g. Taylor Morgan"
                required
              />
            </Field>

            <Field label="Homeowner email">
              <Input
                type="email"
                value={homeownerEmail}
                onChange={(e) => setHomeownerEmail(e.target.value)}
                placeholder="e.g. taylor@example.com"
                required
              />
            </Field>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={isLoading} width="full" size="lg">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Register Now"
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              width="full"
              size="lg"
              onClick={onBack}
            >
              Back to Login
            </Button>
          </form>
        )}

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
