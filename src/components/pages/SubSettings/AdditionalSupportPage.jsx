import { ChevronLeft, BookOpen, HelpCircle, Phone } from 'lucide-react';
import { BackToHomeButton } from "../../ui/BackToHomeButton";

export function AdditionalSupportPage({ onBack, onNavigate, onGoHome }) {
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
            <HelpCircle className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl text-foreground font-semibold">
              Additional Support
            </h1>
            <p className="text-sm text-muted-foreground">
              Get help and resources
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-24">
        {/* User Guides */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <button
            onClick={() => onNavigate("user-guides")}
            className="w-full hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg text-card-foreground font-semibold">
                  User Guides
                </h3>
                <p className="text-sm text-muted-foreground">
                  Step-by-step instructions and tutorials
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* FAQs */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <button
            onClick={() => onNavigate("faqs")}
            className="w-full hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg text-card-foreground font-semibold">
                  FAQs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Frequently asked questions and answers
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Help & Customer Support */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <button
            onClick={() => onNavigate("help-support")}
            className="w-full hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg text-card-foreground font-semibold">
                  Help & Customer Support
                </h3>
                <p className="text-sm text-muted-foreground">
                  Contact our support team for assistance
                </p>
              </div>
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
