import { ChevronLeft, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { BackToHomeButton } from "../../ui/BackToHomeButton";

export function HelpSupportPage({ onBack, onGoHome }) {
  const handleEmailSupport = () => {
    window.location.href =
      "mailto:support@duracell-smart.com?subject=Smart Electricity Support Request";
  };

  const handleCallSupport = () => {
    window.location.href = "tel:+1-800-DURACELL";
  };
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

      {/* Contact Options */}
      <div className="px-6 space-y-6 pb-24">
        {/* Contact Introduction */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <h2 className="text-xl text-card-foreground font-semibold mb-4">
            Get in Touch with Our Support Team
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Our customer support team is here to help you with any questions or
            issues you may have. Choose your preferred contact method below.
          </p>
        </div>

        {/* Email Support */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <button
            onClick={handleEmailSupport}
            className="w-full hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl text-card-foreground font-semibold mb-2">
                  Send Email
                </h3>
                <p className="text-muted-foreground mb-2">
                  Send us a detailed message about your issue
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Response: 24-48 hours</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>support@duracell-smart.com</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Phone Support */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
          <button
            onClick={handleCallSupport}
            className="w-full hover:bg-muted/10 rounded-2xl p-2 -m-2 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Phone className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl text-card-foreground font-semibold mb-2">
                  Call Support
                </h3>
                <p className="text-muted-foreground mb-2">
                  Speak directly with our support specialists
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Mon-Fri: 8 AM - 8 PM EST</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>1-800-DURACELL</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Support Tips */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-3xl p-6 shadow border border-border/50">
          <h3 className="text-lg text-card-foreground font-semibold mb-4 flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-purple-500" />
            <span>Before You Contact Us</span>
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Check the FAQs section for quick answers to common questions
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Have your device serial number and error codes ready</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Include photos or screenshots when reporting issues via email
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Describe the problem clearly including when it started
              </span>
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
