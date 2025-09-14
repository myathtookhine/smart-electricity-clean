import { ChevronLeft, Battery, Settings, Zap, Shield } from 'lucide-react';
import { BackToHomeButton } from "../../ui/BackToHomeButton";

export function BatteryConfigGuidePage({ onBack, onGoHome }) {
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
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Battery className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-foreground font-semibold">
              Battery Configuration Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Optimize your battery settings and performance
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-8 pb-24">
        {/* Introduction */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <h2 className="text-xl text-card-foreground font-semibold mb-4">
            Battery Configuration Overview
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Proper battery configuration is essential for maximizing your system's performance, longevity, and safety. 
            This guide will help you configure your battery settings for optimal operation.
          </p>
        </div>

        {/* Step 1 */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
              1
            </div>
            <h3 className="text-lg text-card-foreground font-semibold">
              Access Battery Settings
            </h3>
          </div>
          
          <div className="mb-6">
            <div className="w-full max-w-md mx-auto h-48 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl shadow-lg border border-border/30 flex items-center justify-center">
              <div className="text-center">
                <Settings className="w-16 h-16 text-orange-500 mx-auto mb-3" />
                <p className="text-orange-600 dark:text-orange-400 font-medium">Battery Settings Interface</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 text-muted-foreground">
            <p className="leading-relaxed">
              Navigate to the battery configuration section from the main settings menu. This is where you can 
              adjust all battery-related parameters and monitoring options.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Open the main settings menu</li>
              <li>Select "Battery Configuration" from the list</li>
              <li>Verify your battery system is detected</li>
              <li>Check current battery status and health</li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
              2
            </div>
            <h3 className="text-lg text-card-foreground font-semibold">
              Configure Charging Parameters
            </h3>
          </div>
          
          <div className="mb-6">
            <div className="w-full max-w-md mx-auto h-48 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-2xl shadow-lg border border-border/30 flex items-center justify-center">
              <div className="text-center">
                <Zap className="w-16 h-16 text-blue-500 mx-auto mb-3" />
                <p className="text-blue-600 dark:text-blue-400 font-medium">Charging Configuration</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 text-muted-foreground">
            <p className="leading-relaxed">
              Set up your charging parameters to ensure safe and efficient battery charging. These settings 
              will help maximize battery life and performance.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Set maximum charging current (recommended: 80% of battery capacity)</li>
              <li>Configure charging voltage limits</li>
              <li>Enable temperature monitoring and protection</li>
              <li>Set up charging schedules and time-of-use optimization</li>
            </ul>
          </div>
        </div>

        {/* Configuration Options */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <h3 className="text-lg text-card-foreground font-semibold mb-6 flex items-center space-x-2">
            <Settings className="w-6 h-6 text-orange-500" />
            <span>Key Configuration Options</span>
          </h3>
          
          <div className="grid gap-4">
            <div className="p-4 bg-muted/20 rounded-xl">
              <h4 className="font-semibold text-card-foreground mb-2">Charging Limits</h4>
              <p className="text-sm text-muted-foreground">
                Set maximum and minimum charge levels to protect battery health (recommended: 20%-80%)
              </p>
            </div>
            
            <div className="p-4 bg-muted/20 rounded-xl">
              <h4 className="font-semibold text-card-foreground mb-2">Temperature Protection</h4>
              <p className="text-sm text-muted-foreground">
                Configure temperature thresholds to prevent overheating and optimize performance
              </p>
            </div>
            
            <div className="p-4 bg-muted/20 rounded-xl">
              <h4 className="font-semibold text-card-foreground mb-2">Load Balancing</h4>
              <p className="text-sm text-muted-foreground">
                Enable automatic load balancing to distribute power efficiently across your system
              </p>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-3xl p-6 shadow border border-border/50">
          <h3 className="text-lg text-card-foreground font-semibold mb-4 flex items-center space-x-2">
            <Shield className="w-6 h-6 text-red-500" />
            <span>Safety Guidelines</span>
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Always ensure proper ventilation around battery systems</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Never exceed manufacturer's recommended charging rates</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Regularly monitor battery temperature and voltage levels</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Contact support if you notice any unusual battery behavior</span>
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