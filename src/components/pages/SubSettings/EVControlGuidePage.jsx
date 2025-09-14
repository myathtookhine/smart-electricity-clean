import { ChevronLeft, Zap } from 'lucide-react';
import { BackToHomeButton } from "../../ui/BackToHomeButton";
import evControlModeImage from "../../../assets/user-guide/ev-control-mode.png";
import evControlModeSelectionImage from "../../../assets/user-guide/ev-control-mode-selection.png";

export function EVControlGuidePage({ onBack, onGoHome }) {
  return (
    <div className="min-h-full bg-background">
      {/* Header with Back Button */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center space-x-3 mb-2">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-muted/20 rounded-xl flex items-center justify-center hover:bg-muted/30 transition-all duration-300 mr-2"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-foreground font-semibold">
              EV Control Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Step-by-step instructions for EV control
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-8 pb-24">
        {/* Introduction */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <h2 className="text-xl text-card-foreground font-semibold mb-4">
            Getting Started with EV Control
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            This guide will walk you through the essential steps to control and manage your electric vehicle efficiently. 
            Follow these step-by-step instructions to get the most out of your EV control system.
          </p>
        </div>

        {/* Step 1 */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
              1
            </div>
            <h3 className="text-lg text-card-foreground font-semibold">
              Access EV Control Mode
            </h3>
          </div>
          
          <div className="mb-6">
            <img 
              src={evControlModeImage} 
              alt="EV Control Mode Interface" 
              className="w-full max-w-md mx-auto rounded-2xl shadow-lg border border-border/30"
            />
          </div>
          
          <div className="space-y-3 text-muted-foreground">
            <p className="leading-relaxed">
              Navigate to the main dashboard and locate the EV Control section. This is where you can manage 
              all aspects of your electric vehicle's operation.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tap on the EV Control icon in the main menu</li>
              <li>Ensure your vehicle is connected and online</li>
              <li>Check the connection status indicator</li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
              2
            </div>
            <h3 className="text-lg text-card-foreground font-semibold">
              Select Control Mode
            </h3>
          </div>
          
          <div className="mb-6">
            <img 
              src={evControlModeSelectionImage} 
              alt="EV Control Mode Selection" 
              className="w-full max-w-md mx-auto rounded-2xl shadow-lg border border-border/30"
            />
          </div>
          
          <div className="space-y-3 text-muted-foreground">
            <p className="leading-relaxed">
              Choose the appropriate control mode based on your current needs. Each mode offers different 
              levels of control and optimization for various scenarios.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Select from available control modes (Eco, Normal, Sport)</li>
              <li>Review the mode description and benefits</li>
              <li>Confirm your selection by tapping "Apply Mode"</li>
              <li>Monitor the system response and vehicle status</li>
            </ul>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 rounded-3xl p-6 shadow border border-border/50">
          <h3 className="text-lg text-card-foreground font-semibold mb-4 flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">💡</span>
            <span>Pro Tips</span>
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Use Eco mode for maximum energy efficiency during daily commutes</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Normal mode provides the best balance between performance and efficiency</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Sport mode delivers maximum performance but uses more energy</span>
            </li>
          </ul>
        </div>

        {/* Back to Home Button */}
        {onGoHome && (
          <div className="mt-8">
            <BackToHomeButton onGoHome={onGoHome} />
          </div>
        )}
      </div>
    </div>
  );
}