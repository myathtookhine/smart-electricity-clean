import {
  ChevronLeft,
  BookOpen,
  Zap,
  Battery,
  ChevronRight,
} from "lucide-react";
import { BackToHomeButton } from "../../ui/BackToHomeButton";

export function UserGuidesPage({ onBack, onNavigate, onGoHome }) {
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
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl text-foreground font-semibold">
              User Guides
            </h1>
            <p className="text-sm text-muted-foreground">
              Instructions and tutorials
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-24">
        {/* EV Control Guide */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <button
            onClick={() => onNavigate("ev-control-guide")}
            className="w-full hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg text-card-foreground font-semibold">
                  EV Control
                </h3>
                <p className="text-sm text-muted-foreground">
                  Learn how to control and manage your electric vehicle
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
        </div>

        {/* Battery Configuration Guide */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <button
            onClick={() => onNavigate("battery-config-guide")}
            className="w-full hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Battery className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg text-card-foreground font-semibold">
                  Battery Configuration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Configure and optimize your battery settings
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
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
