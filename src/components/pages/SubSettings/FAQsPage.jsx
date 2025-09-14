import { ChevronLeft, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { BackToHomeButton } from "../../ui/BackToHomeButton";
import { useState } from "react";

export function FAQsPage({ onBack, onGoHome }) {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleItem = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const faqItems = [
    {
      question: "How do I optimize my EV charging schedule?",
      answer:
        "To optimize your EV charging schedule, use the time-of-use settings in the EV Control section. Set charging during off-peak hours (typically 11 PM to 7 AM) when electricity rates are lower. You can also enable smart charging mode to automatically adjust based on your daily routine and electricity pricing.",
    },
    {
      question: "What should I do if my battery isn't charging properly?",
      answer:
        "First, check all connections and ensure the charging cable is properly connected. Verify that the charging station is operational and has power. If the issue persists, check the battery temperature - charging may be disabled if the battery is too hot or cold. Contact customer support if these steps don't resolve the issue.",
    },
    {
      question: "How can I monitor my energy usage and costs?",
      answer:
        "Use the Energy Insights dashboard to track your daily, weekly, and monthly energy consumption. The system provides detailed breakdowns by device and time of use. You can set budget alerts and view cost projections based on your current usage patterns. Historical data helps you identify trends and optimization opportunities.",
    },
    {
      question: "What are the different battery protection features?",
      answer:
        "Our system includes multiple protection features: over-voltage protection, under-voltage protection, over-current protection, temperature monitoring, and cell balancing. These features automatically activate to prevent damage and ensure safe operation. You can view protection status and configure alert thresholds in the Battery Configuration section.",
    },
    {
      question: "How do I set up emergency backup power?",
      answer:
        "Navigate to Settings > Emergency Backup to configure your backup power settings. Set priority loads that should receive power during outages, configure automatic transfer settings, and set reserve battery levels. Test your backup system regularly to ensure it's working properly. The system can provide power for essential devices during grid outages.",
    },
  ];
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
            <h1 className="text-xl text-foreground font-semibold">FAQs</h1>
            <p className="text-sm text-muted-foreground">
              Frequently asked questions
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="px-6 space-y-4 pb-24">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-card/50 backdrop-blur-sm rounded-3xl shadow border border-border/50 overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full p-6 text-left hover:bg-muted/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg text-card-foreground font-semibold pr-4">
                  {item.question}
                </h3>
                <div className="flex-shrink-0">
                  {expandedItems.has(index) ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </button>

            {expandedItems.has(index) && (
              <div className="px-6 pb-6">
                <div className="border-t border-border/30 pt-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

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
