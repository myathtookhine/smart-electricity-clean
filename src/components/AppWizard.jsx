import React, { useState } from 'react';
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
  Sun
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from './ThemeProvider';

const wizardSteps = [
  {
    id: 1,
    icon: Zap,
    bgColor: 'from-blue-500 to-blue-600',
    title: 'Welcome to the Dura App',
    description: 'Brief welcome and purpose of the app.',
  },
  {
    id: 2,
    icon: Activity,
    bgColor: 'from-green-500 to-green-600',
    title: 'Live Usage Monitor',
    description: 'See your real-time energy data here.',
  },
  {
    id: 3,
    icon: BarChart3,
    bgColor: 'from-purple-500 to-purple-600',
    title: 'Charts & Graphs',
    description: 'Tap or swipe to view trends in energy use.',
  },
  {
    id: 4,
    icon: Settings,
    bgColor: 'from-orange-500 to-orange-600',
    title: 'Menu & Settings',
    description: 'Access detailed controls, device settings, and support.',
  },
  {
    id: 5,
    icon: Bell,
    bgColor: 'from-red-500 to-red-600',
    title: 'Notifications',
    description: 'Get alerts and updates here.',
  },
  {
    id: 6,
    icon: HelpCircle,
    bgColor: 'from-indigo-500 to-indigo-600',
    title: 'Need Help?',
    description: 'Support is just a tap away.',
  },
  {
    id: 7,
    icon: CheckCircle,
    bgColor: 'from-emerald-500 to-emerald-600',
    title: "You're Ready!",
    description: "Let's get started.",
  },
];

export function AppWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState('forward');
  const { completeWizard } = useApp();
  const { theme, setTheme } = useTheme();

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setDirection('forward');
      setCurrentStep(currentStep + 1);
    } else {
      handleGetStarted();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection('backward');
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setDirection('forward');
    setCurrentStep(wizardSteps.length - 1);
  };

  const handleGetStarted = () => {
    completeWizard();
  };

  const currentWizardStep = wizardSteps[currentStep];
  const Icon = currentWizardStep.icon;
  const isLastStep = currentStep === wizardSteps.length - 1;

  return (
    <div className="h-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className='absolute top-12 w-full px-6 z-50'>
        <div className="flex justify-between items-center">
          {/* Step Counter */}
          <div className="text-muted-foreground text-sm">
            {currentStep + 1} / {wizardSteps.length}
          </div>

          {/* Light/Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all duration-300"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>
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
        <div
          key={currentStep}
          className={`wizard-step ${direction} flex flex-col items-center text-center`}
        >
          {/* Icon Circle */}
          <div
            className={`w-28 h-28 rounded-full bg-gradient-to-br ${currentWizardStep.bgColor} flex items-center justify-center shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300`}
          >
            <Icon className="w-14 h-14 text-white" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-foreground mb-3">
            {currentWizardStep.title}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground text-base leading-relaxed mb-6">
            {currentWizardStep.description}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-sm space-y-3 mb-4">
        {/* Primary Action Button */}
        <button
          onClick={isLastStep ? handleGetStarted : handleNext}
          className="w-full bg-primary text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
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
    </div>
  );
}
