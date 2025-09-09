import { 
  X, 
  Zap, 
  Sun, 
  Clock, 
  HelpCircle,
  ChevronLeft,
  Check,
  AlertTriangle 
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../ui/button';
import { Popup } from '../../../ui/popup';

export function SelectChargeModeModal({ 
  isOpen, 
  onClose, 
  onModeSelect, 
  chargingModes, 
  selectedMode,
  tariffConfigured,
  onSetupTariff
}) {
  const [showTooltip, setShowTooltip] = useState(null);
  const [selectedModeLocal, setSelectedModeLocal] = useState(selectedMode);
  const [showTariffSetupPopup, setShowTariffSetupPopup] = useState(false);

  if (!isOpen) return null;

  const modeDetails = {
    'charge-now': {
      tooltip: 'Starts charging immediately when activated. Perfect for when you need to charge quickly without waiting for optimal conditions. You can set schedules to control when this immediate charging occurs.',
      benefits: ['Instant charging', 'No waiting', 'Flexible scheduling']
    },
    'pure-green': {
      tooltip: 'Environmentally conscious charging that only uses solar power. Charging begins automatically when your solar panels generate more than 1.4kW of power, ensuring zero grid consumption.',
      benefits: ['100% solar powered', 'Zero grid consumption', 'Environmentally friendly']
    },
    'tariff-intelligence': {
      tooltip: 'Smart charging that automatically activates during your cheapest electricity rates. Requires tariff configuration to identify low-cost periods and optimize your charging costs.',
      benefits: ['Cost optimization', 'Automatic scheduling', 'Grid-smart charging']
    }
  };

  const handleModeSelect = (mode) => {
    if (mode === 'tariff-intelligence' && !tariffConfigured) {
      setShowTariffSetupPopup(true);
      return;
    }
    setSelectedModeLocal(mode);
  };

  const handleConfirm = () => {
    onModeSelect(selectedModeLocal);
  };

  const handleTariffSetupConfirm = () => {
    setShowTariffSetupPopup(false);
    onSetupTariff && onSetupTariff();
  };

  const handleTariffSetupCancel = () => {
    setShowTariffSetupPopup(false);
  };

  const getModeIcon = (mode) => {
    switch(mode) {
      case 'charge-now': return Zap;
      case 'pure-green': return Sun;
      case 'tariff-intelligence': return Clock;
      default: return Zap;
    }
  };

  const getColorClasses = (mode) => {
    switch(mode) {
      case 'charge-now':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-500',
          bgSolid: 'bg-blue-500',
          bgHover: 'hover:bg-blue-600',
          ring: 'ring-blue-500/20',
          borderActive: 'border-blue-500/50'
        };
      case 'pure-green':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          text: 'text-green-500',
          bgSolid: 'bg-green-500',
          bgHover: 'hover:bg-green-600',
          ring: 'ring-green-500/20',
          borderActive: 'border-green-500/50'
        };
      case 'tariff-intelligence':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          text: 'text-purple-500',
          bgSolid: 'bg-purple-500',
          bgHover: 'hover:bg-purple-600',
          ring: 'ring-purple-500/20',
          borderActive: 'border-purple-500/50'
        };
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-500',
          bgSolid: 'bg-blue-500',
          bgHover: 'hover:bg-blue-600',
          ring: 'ring-blue-500/20',
          borderActive: 'border-blue-500/50'
        };
    }
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center space-x-3 mb-2">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-muted/20 rounded-xl flex items-center justify-center hover:bg-muted/30 transition-all duration-300 mr-2"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl text-foreground font-semibold">
              Select Charge Mode
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose your charging strategy
            </p>
          </div>
        </div>
      </div>

      {/* Mode Cards */}
      <div className="px-6 space-y-6 pb-8">
        {Object.entries(chargingModes).map(([key, mode]) => {
          const IconComponent = getModeIcon(key);
          const colors = getColorClasses(key);
          const isSelected = selectedModeLocal === key;
          const details = modeDetails[key];
          const needsTariffSetup =
            key === "tariff-intelligence" && !tariffConfigured;

          return (
            <div key={key} className="space-y-3">
              {/* Mode Card */}
              <div
                className={`bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? `${colors.borderActive} ring-2 ${colors.ring}`
                    : "border-border/50 hover:border-border"
                }`}
                onClick={() => handleModeSelect(key)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 ${colors.bg} rounded-xl`}>
                      <IconComponent className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="text-xl text-card-foreground font-semibold">
                        {mode.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTooltip(showTooltip === key ? null : key);
                      }}
                      className="w-8 h-8 bg-muted/20 rounded-full flex items-center justify-center hover:bg-muted/30 transition-all duration-300"
                    >
                      <HelpCircle className="w-8 h-8 text-muted-foreground" />
                    </button>

                    {isSelected && (
                      <div
                        className={`w-8 h-8 ${colors.bgSolid} rounded-full flex items-center justify-center`}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Setup Warning for Tariff Intelligence */}
                {needsTariffSetup && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                          Setup Required
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-300 mb-3">
                      Tariff configuration needed before use
                    </p>
                  </div>
                )}

                {/* Benefits */}
                <div className="space-y-2">
                  {details.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className={`w-1.5 h-1.5 ${colors.bgSolid} rounded-full`}
                      ></div>
                      <span className="text-sm text-muted-foreground">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tooltip Expansion */}
              {showTooltip === key && (
                <div
                  className={`${colors.bg} ${colors.border} rounded-2xl p-4 space-y-3`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 ${colors.bg} rounded-lg mt-0.5`}>
                      <HelpCircle className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div>
                      <h4 className={`font-medium ${colors.text} mb-2`}>
                        How it works
                      </h4>
                      <p className={`text-sm ${colors.text}`}>
                        {details.tooltip}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Confirm Button */}
        {selectedModeLocal !== selectedMode && (
          <div className="pt-6">
            <Button
              variant="primary"
              size="lg"
              width="full"
              onClick={handleConfirm}
              className="h-14"
            >
              Confirm Selection
            </Button>
          </div>
        )}
      </div>

      {/* Tariff Setup Popup */}
      <Popup
        isOpen={showTariffSetupPopup}
        onClose={handleTariffSetupCancel}
        type="warning"
        icon={Clock}
        title="Tariff Configuration Required"
        description="To use Tariff Intelligence, you need to configure your electricity tariff settings. This helps the system identify the cheapest charging periods."
        primaryButton={{
          text: "Configure",
          onClick: handleTariffSetupConfirm,
        }}
        secondaryButton={{
          text: "Cancel",
          onClick: handleTariffSetupCancel,
        }}
      />
    </div>
  );
}
