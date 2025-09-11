import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  ArrowDown, 
  ArrowUp, 
  DollarSign 
} from 'lucide-react';
import { useTheme } from '../../ThemeProvider';
import { BackToHomeButton } from "../../ui/BackToHomeButton";

// Mock data generator for cost information
const generateCostData = (timeView) => {
  const multiplier = 
    timeView === '1day' ? 1 :
    timeView === '7days' ? 7 :
    timeView === '30days' ? 30 : 365;

  // Base daily values
  const baseGridImport = { kwh: 18.2, cost: 1543 };
  const baseGridExport = { kwh: 6.2, cost: 503 };

  return {
    gridImport: {
      kwh: (baseGridImport.kwh * multiplier * (0.8 + Math.random() * 0.4)).toFixed(1),
      cost: Math.round(baseGridImport.cost * multiplier * (0.8 + Math.random() * 0.4))
    },
    gridExport: {
      kwh: (baseGridExport.kwh * multiplier * (0.8 + Math.random() * 0.4)).toFixed(1),
      cost: Math.round(baseGridExport.cost * multiplier * (0.8 + Math.random() * 0.4))
    }
  };
};

export function CostSummaryPage({ onBack, onGoHome }) {
  const { theme } = useTheme();
  const [timeView, setTimeView] = useState('1day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendar, setShowCalendar] = useState(false);
  const dateInputRef = useRef(null);

  const costData = generateCostData(timeView);

  const timeViewOptions = [
    { key: '1day', label: '1 Day' },
    { key: '7days', label: '7 Days' },
    { key: '30days', label: '30 Days' },
    { key: '1year', label: '1 Year' }
  ];

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateInputFocus = () => {
    setShowCalendar(true);
  };

  const handleDateInputBlur = () => {
    // Delay hiding calendar to allow for click events
    setTimeout(() => setShowCalendar(false), 200);
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
            <DollarSign className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-foreground font-semibold">
              Cost Summary
            </h1>
            <p className="text-sm text-muted-foreground">
              View your energy costs
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-8">
        {/* Time Period Selection */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Time Period
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {timeViewOptions.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTimeView(key)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  timeView === key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted/20 text-muted-foreground hover:bg-muted/30"
                }`}
              >
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Picker */}
        <div
          className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50"
          data-date-picker
        >
          <div className="flex items-center space-x-3 mb-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <label className="text-sm font-medium text-card-foreground">
              Select Date
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                ref={dateInputRef}
                type="date"
                className={`w-full px-3 py-2 pr-10 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                  showCalendar ? "border-primary shadow-md" : "border-border"
                }`}
                style={{
                  colorScheme: theme === "dark" ? "dark" : "light",
                }}
                value={selectedDate}
                onChange={handleDateChange}
                onFocus={handleDateInputFocus}
                onBlur={handleDateInputBlur}
                onClick={handleCalendarToggle}
              />
              <button
                onClick={handleCalendarToggle}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-all duration-200 ${
                  showCalendar
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-muted/20 text-muted-foreground"
                }`}
              >
                <Calendar className="w-4 h-4" />
              </button>

              {/* Calendar state indicator */}
              {showCalendar && (
                <div className="absolute top-full left-0 right-0 mt-1 text-xs text-primary text-center animate-pulse">
                  📅 Calendar is active
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cost Cards */}
        <div className="space-y-4">
          {/* Grid Import Cost Card */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center">
                <ArrowDown className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  Grid Import
                </h3>
                <p className="text-sm text-muted-foreground">
                  Electricity purchased from grid
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-card-foreground">
                  {costData.gridImport.kwh}
                </div>
                <div className="text-sm text-muted-foreground">kWh</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {costData.gridImport.cost}
                </div>
                <div className="text-sm text-muted-foreground">THB</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="text-sm text-muted-foreground text-center">
                Rate:{" "}
                {(costData.gridImport.cost / costData.gridImport.kwh).toFixed(
                  2
                )}{" "}
                THB/kWh
              </div>
            </div>
          </div>

          {/* Grid Export Cost Card */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center">
                <ArrowUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  Grid Export
                </h3>
                <p className="text-sm text-muted-foreground">
                  Electricity sold to grid
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-card-foreground">
                  {costData.gridExport.kwh}
                </div>
                <div className="text-sm text-muted-foreground">kWh</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {costData.gridExport.cost}
                </div>
                <div className="text-sm text-muted-foreground">THB</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="text-sm text-muted-foreground text-center">
                Rate:{" "}
                {(costData.gridExport.cost / costData.gridExport.kwh).toFixed(
                  2
                )}{" "}
                THB/kWh
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Net Cost Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Import Cost:</span>
              <span className="font-semibold text-red-500">
                +{costData.gridImport.cost} THB
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Total Export Revenue:
              </span>
              <span className="font-semibold text-green-500">
                -{costData.gridExport.cost} THB
              </span>
            </div>
            <div className="border-t border-border/50 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-card-foreground">
                  Net Cost:
                </span>
                <span
                  className={`font-bold text-lg ${
                    costData.gridImport.cost - costData.gridExport.cost > 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {costData.gridImport.cost - costData.gridExport.cost > 0
                    ? "+"
                    : ""}
                  {costData.gridImport.cost - costData.gridExport.cost} THB
                </span>
              </div>
            </div>
          </div>
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
