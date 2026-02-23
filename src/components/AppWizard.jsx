import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Activity,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Rocket,
  Moon,
  Sun,
  Globe,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "./ThemeProvider";
import { LanguageChangeModal } from "./LanguageChangeModal";

import wz1 from "../assets/iso-0-welcome.png";
import wz2 from "../assets/iso-1-live.png";
import wz3 from "../assets/iso-2-graph.png";
import wz4 from "../assets/iso-3-menuandsettings.png";
import wz5 from "../assets/iso-4-noti.png";
import wz6 from "../assets/iso-5-help.png";
import wz7 from "../assets/iso-6-ready.png";

const wizardSteps = [
  {
    id: 1,
    type: "image",
    image: wz1,
    bgColor: "",
    title: "Welcome to the Dura App",
    description:
      "Take control of your energy consumption with our comprehensive monitoring solution. Track usage patterns, optimize efficiency, and make informed decisions to reduce costs while contributing to a sustainable future.",
  },
  {
    id: 2,
    type: "image",
    image: wz2,
    bgColor: "",
    title: "Live Usage Monitor",
    description:
      "Monitor your electricity consumption in real-time with our advanced dashboard. Track usage patterns, identify peak periods, and receive instant notifications about unusual activity to avoid unexpected bill spikes.",
  },
  {
    id: 3,
    type: "image",
    image: wz3,
    bgColor: "",
    title: "Charts & Graphs",
    description:
      "Analyze your energy consumption through detailed visualizations and trend analysis. Compare daily, weekly, and monthly usage patterns to identify optimization opportunities and plan for future needs.",
  },
  {
    id: 4,
    type: "image",
    image: wz4,
    bgColor: "",
    title: "Menu & Settings",
    description:
      "Customize your energy management experience with comprehensive settings. Configure device preferences, set personalized alerts, manage connected devices, and access advanced features through our intuitive interface.",
  },
  {
    id: 5,
    type: "image",
    image: wz5,
    bgColor: "",
    title: "Notifications",
    description:
      "Stay informed with intelligent alerts tailored to your usage patterns. Receive timely updates about consumption anomalies, cost-saving opportunities, and system changes to maintain proactive energy management.",
  },
  {
    id: 6,
    type: "image",
    image: wz6,
    bgColor: "",
    title: "Need Help?",
    description:
      "Access comprehensive support resources whenever you need assistance. Our help center provides detailed guides, troubleshooting steps, and direct access to technical support for optimal user experience.",
  },
  {
    id: 7,
    type: "image",
    image: wz7,
    bgColor: "",
    title: "Ready to go!",
    description:
      "You're now equipped to begin smart energy management. Start monitoring consumption, analyzing trends, and making data-driven decisions to optimize your electricity usage and efficiency.",
  },
];

export function AppWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const { completeWizard, currentLanguage, changeLanguage } = useApp();
  const { theme, setTheme } = useTheme();

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setDirection("forward");
      setCurrentStep(currentStep + 1);
    } else {
      handleGetStarted();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection("backward");
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setDirection("forward");
    setCurrentStep(wizardSteps.length - 1);
  };

  const handleGetStarted = () => {
    completeWizard();
  };

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsLanguageModalOpen(false);
  };

  const currentWizardStep = wizardSteps[currentStep];
  const Icon = currentWizardStep.icon;
  const isLastStep = currentStep === wizardSteps.length - 1;

  return (
    <div className="h-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-16 w-full px-8 z-50">
        {/* Logo - display on all steps */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center">
            {/* Light/Dark Mode Toggle */}
            {/* <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button> */}
            <div>
              <h1 className="text-xl font-bold text-foreground mx-auto">
                Clean Electricity
              </h1>
            </div>
            {/* Language Selection */}
            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className="p-2 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all duration-300"
            >
              <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>{" "}
          </div>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      {/* <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {wizardSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-foreground w-8'
                  : index < currentStep
                  ? 'bg-foreground/60'
                  : 'bg-foreground/20'
              }`}
            />
          ))}
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full relative">
        {/* Animated Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon/Image Circle */}

            {currentWizardStep.type === "icon" ? (
              <motion.div
                className="flex flex-col items-center justify-center mb-3 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div
                  className={`w-28 h-28 rounded-full bg-gradient-to-br ${currentWizardStep.bgColor} flex items-center justify-center`}
                >
                  <Icon className="w-14 h-14 text-white" strokeWidth={1.5} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center mb-3 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <img
                  src={currentWizardStep.image}
                  alt={currentWizardStep.title}
                  className="w-90 h-90"
                />
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              className="text-3xl font-semibold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {currentWizardStep.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-muted-foreground text-base leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.4 }}
            >
              {currentWizardStep.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-sm space-y-3 mb-4">
        {/* Primary Action Button */}
        <button
          onClick={isLastStep ? handleGetStarted : handleNext}
          className="w-full bg-primary text-background font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
        >
          {isLastStep ? (
            <>
              <Rocket className="w-5 h-5" />
              <span>Get Started</span>
            </>
          ) : (
            <>
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Secondary Actions */}
        <div className="flex justify-between">
          {/* Back Button - Hidden on first step */}
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {/* Spacer when back button is hidden */}
          {currentStep === 0 && <div></div>}

          {/* Skip Button */}
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
            >
              <span>Skip</span>
            </button>
          )}
        </div>
      </div>

      {/* Language Change Modal */}
      <LanguageChangeModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}
