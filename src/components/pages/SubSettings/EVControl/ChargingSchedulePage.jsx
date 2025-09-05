import { 
  ChevronLeft, 
  Clock, 
  Zap, 
  Sun, 
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

export function ChargingSchedulePage({
  mode,
  modeData,
  onBack,
  onComplete,
  onGoHome,
  tariffName,
}) {
  // Single schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    startTime: dayjs().hour(22).minute(0), // 10:00 PM
    endTime: dayjs().hour(7).minute(0), // 7:00 AM
    frequency: "one-time", // 'one-time', 'weekdays', 'weekends', 'specific-days'
    specificDays: [],
    enabled: true,
  });

  const frequencyOptions = [
    { value: "one-time", label: "One-time" },
    { value: "weekdays", label: "Weekdays" },
    { value: "weekends", label: "Weekends" },
    { value: "specific-days", label: "Specific Days" },
  ];

  // Helper function to get color classes
  const getColorClasses = (modeColor) => {
    switch (modeColor) {
      case "blue":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          text: "text-blue-500",
          bgSolid: "bg-blue-500",
          bgHover: "hover:bg-blue-600",
          bgGradient: "from-blue-500 to-blue-600",
        };
      case "green":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          text: "text-green-500",
          bgSolid: "bg-green-500",
          bgHover: "hover:bg-green-600",
          bgGradient: "from-green-500 to-green-600",
        };
      case "purple":
        return {
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
          text: "text-purple-500",
          bgSolid: "bg-purple-500",
          bgHover: "hover:bg-purple-600",
          bgGradient: "from-purple-500 to-purple-600",
        };
      default:
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          text: "text-blue-500",
          bgSolid: "bg-blue-500",
          bgHover: "hover:bg-blue-600",
          bgGradient: "from-blue-500 to-blue-600",
        };
    }
  };

  const colors = getColorClasses(modeData.color);

  const daysOfWeek = [
    { value: "monday", label: "Mon" },
    { value: "tuesday", label: "Tue" },
    { value: "wednesday", label: "Wed" },
    { value: "thursday", label: "Thu" },
    { value: "friday", label: "Fri" },
    { value: "saturday", label: "Sat" },
    { value: "sunday", label: "Sun" },
  ];

  const handleSaveSchedule = () => {
    // Handle saving the schedule
    const scheduleData = {
      name: `${modeData.name} Schedule`,
      startTime: scheduleForm.startTime.format("HH:mm"),
      endTime: scheduleForm.endTime.format("HH:mm"),
      frequency: scheduleForm.frequency,
      specificDays: scheduleForm.specificDays,
      enabled: scheduleForm.enabled,
    };
    console.log("Schedule saved:", scheduleData);
    if (onComplete) onComplete(scheduleData);
  };

  const formatTime = (dayJsObj) => {
    return dayJsObj.format("HH:mm");
  };

  const formatFrequency = (frequency, specificDays) => {
    switch (frequency) {
      case "one-time":
        return "One-time";
      case "weekdays":
        return "Monday - Friday";
      case "weekends":
        return "Saturday - Sunday";
      case "specific-days":
        return specificDays
          .map((day) => daysOfWeek.find((d) => d.value === day)?.label)
          .join(", ");
      default:
        return frequency;
    }
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
              <modeData.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-foreground font-semibold">
                Charging Schedule
              </h1>
              <p className="text-sm text-muted-foreground">
                {modeData.name}
                {mode === "tariff-intelligence" &&
                  tariffName &&
                  ` • ${tariffName}`}
              </p>
            </div>
          </div>
        </div>

        {/* Direct Schedule Form */}
        <div className="px-6 space-y-6 pb-24">
          {/* Charging Time Period */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
            <h3 className="text-lg text-card-foreground font-semibold mb-4">
              Charging Period
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Set the start and end times for charging
            </p>

            {/* Time Range Display */}
            <div className="text-center mb-8">
              <div className="text-2xl font-bold text-foreground">
                {formatTime(scheduleForm.startTime)} -{" "}
                {formatTime(scheduleForm.endTime)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Charging time period
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
                      value={scheduleForm.startTime}
                      onChange={(newValue) =>
                        setScheduleForm({
                          ...scheduleForm,
                          startTime: newValue,
                        })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    When charging begins
                  </p>
                </div>

                {/* End Time */}
                <div className="bg-muted/10 rounded-2xl p-6">
                  <h4 className="text-md font-medium text-foreground mb-4 text-center">
                    End Time
                  </h4>
                  <div className="flex justify-center">
                    <TimePicker
                      value={scheduleForm.endTime}
                      onChange={(newValue) =>
                        setScheduleForm({
                          ...scheduleForm,
                          endTime: newValue,
                        })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    When charging ends
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
                    setScheduleForm({
                      ...scheduleForm,
                      frequency: option.value,
                      specificDays:
                        option.value === "specific-days"
                          ? scheduleForm.specificDays
                          : [],
                    })
                  }
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    scheduleForm.frequency === option.value
                      ? `${colors.bg} ${colors.border} ${colors.text}`
                      : "bg-muted/20 border-border text-foreground hover:bg-muted/30"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Specific Days Selection */}
            {scheduleForm.frequency === "specific-days" && (
              <div className="space-y-3">
                <label className="block text-sm text-muted-foreground">
                  Select Days
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      onClick={() => {
                        const isSelected = scheduleForm.specificDays.includes(
                          day.value
                        );
                        const newDays = isSelected
                          ? scheduleForm.specificDays.filter(
                              (d) => d !== day.value
                            )
                          : [...scheduleForm.specificDays, day.value];
                        setScheduleForm({
                          ...scheduleForm,
                          specificDays: newDays,
                        });
                      }}
                      className={`p-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                        scheduleForm.specificDays.includes(day.value)
                          ? `${colors.bgSolid} text-white`
                          : "bg-muted/20 text-foreground hover:bg-muted/30"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
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
              onClick={handleSaveSchedule}
            >
              Save Schedule
            </Button>

            <Button variant="secondary" size="lg" width="full" onClick={onBack}>
              Cancel
            </Button>
          </div>

          {/* Schedule Info */}
          {/* <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <h3 className="text-xl text-card-foreground font-semibold mb-4">How Scheduling Works</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 ${colors.bgSolid} rounded-full mt-2 flex-shrink-0`}></div>
              <p>
                <strong className="text-foreground">Charging Period:</strong> Set start and end times using MUI time pickers for precise control
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 ${colors.bgSolid} rounded-full mt-2 flex-shrink-0`}></div>
              <p>
                <strong className="text-foreground">Frequency:</strong> Choose when this schedule applies - one-time, weekdays, weekends, or specific days
              </p>
            </div>
            {mode === 'tariff-intelligence' && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong className="text-foreground">Smart Timing:</strong> Charging will occur during low-cost periods within your schedule
                </p>
              </div>
            )}
            <div className="pt-2 mt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground italic">
                This scheduling functionality replaces the previous "Time Boost" feature with enhanced control and flexibility.
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
