import { ChevronLeft, Phone } from 'lucide-react';
import { BackToHomeButton } from "../../ui/BackToHomeButton";

export function HelpSupportPage({ onBack, onGoHome }) {
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
            <Phone className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl text-foreground font-semibold">
              Help & Customer Support
            </h1>
            <p className="text-sm text-muted-foreground">
              Get assistance from our team
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="px-6 pb-24">
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-12 shadow border border-border/50 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl text-card-foreground font-semibold mb-4">
            Coming Soon
          </h3>
          <p className="text-muted-foreground text-lg">
            Our customer support system is being set up. Soon you'll be able to
            contact our support team directly through the app for personalized
            assistance.
          </p>
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
