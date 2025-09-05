import { 
  ChevronLeft, 
  Clock,
  Calendar
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../ui/button';
import { BackToHomeButton } from "../../../ui/BackToHomeButton";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material/styles";
import { createCustomTheme } from "../../../../theme/muiTheme";
import dayjs from "dayjs";

export function TariffSettingPage({ onBack, onComplete, onGoHome }) {
  // Single tariff form state
  const [tariffData, setTariffData] = useState({
    lowCostStartTime: dayjs().hour(23).minute(0), // 11:00 PM
    lowCostEndTime: dayjs().hour(6).minute(0), // 6:00 AM
    frequency: "weekdays", // 'one-time', 'weekdays', 'weekends', 'specific-days'
    specificDays: [],
  });

  const frequencyOptions = [
    { value: "one-time", label: "One-time" },
    { value: "weekdays", label: "Weekdays" },
    { value: "weekends", label: "Weekends" },
    { value: "specific-days", label: "Specific Days" },
  ];

  const handleSaveTariff = () => {
    // Handle saving the tariff
    const tariffConfig = {
      lowCostStartTime: tariffData.lowCostStartTime.format("HH:mm"),
      lowCostEndTime: tariffData.lowCostEndTime.format("HH:mm"),
      frequency: tariffData.frequency,
      specificDays: tariffData.specificDays,
    };
    console.log("Tariff saved:", tariffConfig);
    onComplete(tariffConfig);
  };

  const formatTime = (dayJsObj) => {
    return dayJsObj.format("HH:mm");
  };

  const colors = {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-500",
    bgSolid: "bg-purple-500",
    bgHover: "hover:bg-purple-600",
    bgGradient: "from-purple-500 to-purple-600",
  };

  return (
    <ThemeProvider theme={createCustomTheme()}>
      <div className="min-h-full bg-background">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-muted/20 rounded-xl flex items-center justify-center hover:bg-muted/30 transition-all duration-300 mr-2"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div
              className={`w-12 h-12 bg-gradient-to-br ${colors.bgGradient} rounded-2xl flex items-center justify-center shadow-lg`}
            >
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-foreground font-semibold">
                Tariff Settings
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure your tariff rates
              </p>
            </div>
          </div>
        </div>

        {/* Direct Tariff Form */}
        <div className="px-6 space-y-6 pb-24">
          {/* Low-Cost Period Time Range */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
            <h3 className="text-lg text-card-foreground font-semibold mb-4">
              Low-Cost Period
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Charges during low-cost tariff periods for optimal savings
            </p>

            {/* Time Range Display */}
            <div className="text-center mb-8">
              <div className="text-2xl font-bold text-foreground">
                {formatTime(tariffData.lowCostStartTime)} -{" "}
                {formatTime(tariffData.lowCostEndTime)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Low-cost charging period
              </p>
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="space-y-6">
                {/* Start Time */}
                <div className="bg-muted/10 rounded-2xl p-6">
                  <h4 className="text-md font-medium text-foreground mb-4 text-center">
                    Start Time
                  </h4>
                  <div className="flex justify-center">
                    <TimePicker
                      value={tariffData.lowCostStartTime}
                      onChange={(newValue) =>
                        setTariffData({
                          ...tariffData,
                          lowCostStartTime: newValue,
                        })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    When low-cost period begins
                  </p>
                </div>

                {/* End Time */}
                <div className="bg-muted/10 rounded-2xl p-6">
                  <h4 className="text-md font-medium text-foreground mb-4 text-center">
                    End Time
                  </h4>
                  <div className="flex justify-center">
                    <TimePicker
                      value={tariffData.lowCostEndTime}
                      onChange={(newValue) =>
                        setTariffData({
                          ...tariffData,
                          lowCostEndTime: newValue,
                        })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    When low-cost period ends
                  </p>
                </div>
              </div>
            </LocalizationProvider>
          </div>

          {/* Frequency */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
            <h3 className="text-lg text-card-foreground font-semibold mb-4">
              Frequency
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {frequencyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setTariffData({
                      ...tariffData,
                      frequency: option.value,
                      specificDays:
                        option.value === "specific-days"
                          ? tariffData.specificDays
                          : [],
                    })
                  }
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    tariffData.frequency === option.value
                      ? `${colors.bgSolid} text-white shadow-md`
                      : "bg-muted/10 text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Specific Days Selection */}
            {tariffData.frequency === "specific-days" && (
              <div className="space-y-3">
                <label className="block text-sm text-muted-foreground">
                  Select Days
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, index) => (
                      <button
                        key={day}
                        onClick={() => {
                          const newSpecificDays =
                            tariffData.specificDays.includes(index)
                              ? tariffData.specificDays.filter(
                                  (d) => d !== index
                                )
                              : [...tariffData.specificDays, index];
                          setTariffData({
                            ...tariffData,
                            specificDays: newSpecificDays,
                          });
                        }}
                        className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                          tariffData.specificDays.includes(index)
                            ? `${colors.bgSolid} text-white`
                            : "bg-muted/10 text-muted-foreground hover:bg-muted/20"
                        }`}
                      >
                        {day}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              width="full"
              onClick={handleSaveTariff}
            >
              Save Tariff Settings
            </Button>

            <Button variant="secondary" size="lg" width="full" onClick={onBack}>
              Cancel
            </Button>
          </div>

          {/* Tariff Info */}
          {/* <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <h3 className="text-xl text-card-foreground font-semibold mb-4">How Low-Cost Tariff Works</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong className="text-foreground">Low-Cost Period:</strong> Set using MUI time pickers for precise timing control
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong className="text-foreground">Frequency:</strong> Choose when this tariff applies - one-time, weekdays, weekends, or specific days
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong className="text-foreground">Smart Charging:</strong> Vehicle charges automatically during low-cost periods
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong className="text-foreground">Cost Savings:</strong> Maximize savings by charging during off-peak hours
              </p>
            </div>
            <div className="pt-2 mt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground italic">
                These settings enable the system to charge your vehicle during the most cost-effective tariff periods for optimal savings.
              </p>
            </div>
          </div>
        </div> */}

          {/* Back to Home Button */}
          {onGoHome && (
            <div className="mt-8">
              <BackToHomeButton onGoHome={onGoHome} />
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}