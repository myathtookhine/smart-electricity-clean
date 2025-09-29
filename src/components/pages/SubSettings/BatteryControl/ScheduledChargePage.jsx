import {
  ChevronLeft,
  Battery,
  Clock,
  Calendar,
  Info,
  Edit,
  Save,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Switch } from "../../../ui/switch";
import { Button } from "../../../ui/button";
import { BackToHomeButton } from "../../../ui/BackToHomeButton";
import { Popup } from "../../../ui/popup";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material/styles";
import { createCustomTheme } from "../../../../theme/muiTheme";
import { useApp } from "../../../../contexts/AppContext";
import dayjs from "dayjs";

export function ScheduledChargePage({ onBack, onGoHome }) {
  const { batteryState } = useApp();
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [hasShownOfflineModal, setHasShownOfflineModal] = useState(false);

  // Form state
  const [settings, setSettings] = useState({
    enabled: false,
    periods: [
      {
        id: 1,
        name: "Night Charge",
        startTime: dayjs().hour(22).minute(0), // 10:00 PM
        endTime: dayjs().hour(7).minute(0), // 7:00 AM
      },
    ],
    frequency: "weekdays", // 'one-time', 'weekdays', 'weekends', 'specific-days'
    specificDays: [],
  });

  const [editingPeriodId, setEditingPeriodId] = useState(null);

  const frequencyOptions = [
    { value: "one-time", label: "One-time" },
    { value: "weekdays", label: "Weekdays" },
    { value: "weekends", label: "Weekends" },
    { value: "specific-days", label: "Specific Days" },
  ];

  const daysOfWeek = [
    { value: "monday", label: "Mon" },
    { value: "tuesday", label: "Tue" },
    { value: "wednesday", label: "Wed" },
    { value: "thursday", label: "Thu" },
    { value: "friday", label: "Fri" },
    { value: "saturday", label: "Sat" },
    { value: "sunday", label: "Sun" },
  ];

  // Show offline modal when battery is offline
  useEffect(() => {
    if (
      batteryState.isConfigured &&
      !batteryState.isOnline &&
      !hasShownOfflineModal
    ) {
      setShowOfflineModal(true);
    }
  }, [batteryState.isConfigured, batteryState.isOnline, hasShownOfflineModal]);

  const handleCloseOfflineModal = () => {
    setShowOfflineModal(false);
    setHasShownOfflineModal(true);
  };

  const formatTime = (time) => {
    return time.format("HH:mm");
  };

  const isDisabled = batteryState.isConfigured && !batteryState.isOnline;

  const addPeriod = () => {
    if (settings.periods.length >= 4) return;
    const defaultNames = [
      "Night Charge",
      "Morning Charge",
      "Afternoon Charge",
      "Evening Charge",
    ];
    const newPeriod = {
      id: Math.max(...settings.periods.map((p) => p.id)) + 1,
      name:
        defaultNames[settings.periods.length] ||
        `Period ${settings.periods.length + 1}`,
      startTime: dayjs().hour(22).minute(0),
      endTime: dayjs().hour(7).minute(0),
    };
    setSettings({
      ...settings,
      periods: [...settings.periods, newPeriod],
    });
  };

  const removePeriod = (periodId) => {
    if (settings.periods.length <= 1) return;
    setSettings({
      ...settings,
      periods: settings.periods.filter((p) => p.id !== periodId),
    });
  };

  const updatePeriod = (periodId, field, value) => {
    setSettings({
      ...settings,
      periods: settings.periods.map((p) =>
        p.id === periodId ? { ...p, [field]: value } : p
      ),
    });
  };

  const startEditingPeriod = (periodId) => {
    setEditingPeriodId(periodId);
  };

  const savePeriodName = () => {
    setEditingPeriodId(null);
  };

  const handleSave = () => {
    if (isDisabled) return;

    const scheduleData = {
      enabled: settings.enabled,
      periods: settings.periods.map((period) => ({
        name: period.name,
        startTime: period.startTime.format("HH:mm"),
        endTime: period.endTime.format("HH:mm"),
      })),
      frequency: settings.frequency,
      specificDays: settings.specificDays,
    };
    console.log("Scheduled Charge saved:", scheduleData);
    // Here you would typically save to your backend/state management
    onBack();
  };

  return (
    <ThemeProvider theme={createCustomTheme("light")}>
      <div className="min-h-full bg-background">
        {/* Offline Modal */}
        <Popup
          isOpen={showOfflineModal}
          onClose={handleCloseOfflineModal}
          type="warning"
          icon={Info}
          title="System Offline"
          description="The system is currently offline. You can view the settings, but changes cannot be made until the system is back online."
          primaryButton={{
            text: "Understood",
            onClick: handleCloseOfflineModal,
          }}
        />

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
              <Battery className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-foreground font-semibold">
                Scheduled Charge
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure automatic charging times
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 space-y-6 pb-24">
          {/* Main Toggle */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg text-card-foreground font-semibold">
                  Enable Scheduled Charge
                </h3>
                <p className="text-sm text-muted-foreground">
                  Automatically charge during set time periods
                </p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) =>
                  !isDisabled && setSettings({ ...settings, enabled: checked })
                }
                disabled={isDisabled}
                className={isDisabled ? "opacity-50" : ""}
              />
            </div>
          </div>

          {/* Time Configuration */}
          {settings.enabled && (
            <div className="space-y-4">
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
                <div className="mb-3">
                  <h3 className="text-lg text-card-foreground font-semibold">
                    Charging Periods
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Set multiple time periods to charge (
                    {settings.periods.length}/4)
                  </p>
                </div>
                {settings.periods.length < 4 && (
                  <Button
                    variant="primary"
                    size="sm"
                    width="full"
                    onClick={addPeriod}
                    disabled={isDisabled}
                    className={
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    Add
                  </Button>
                )}

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="space-y-4 mt-4">
                    {settings.periods.map((period, index) => (
                      <div key={period.id} className="bg-muted rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center flex-1 mr-4">
                            {editingPeriodId === period.id ? (
                              <input
                                type="text"
                                value={period.name}
                                onChange={(e) =>
                                  updatePeriod(
                                    period.id,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="flex-1 bg-transparent border border-primary/20 rounded-lg px-3 py-1 text-md font-medium text-foreground outline-none focus:border-primary"
                                placeholder="Enter period name"
                                autoFocus
                              />
                            ) : (
                              <h4 className="text-md font-medium text-foreground flex-1">
                                {period.name || `Period ${index + 1}`}
                              </h4>
                            )}
                            <button
                              onClick={() =>
                                editingPeriodId === period.id
                                  ? savePeriodName()
                                  : startEditingPeriod(period.id)
                              }
                              disabled={isDisabled}
                              className={`ml-2 p-1 h-8 w-8 rounded-md hover:bg-muted/20 transition-colors ${
                                isDisabled
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                            >
                              {editingPeriodId === period.id ? (
                                <Save className="w-4 h-4 text-green-500" />
                              ) : (
                                <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                              )}
                            </button>
                          </div>
                          {settings.periods.length > 1 &&
                            editingPeriodId !== period.id && (
                              <button
                                onClick={() => removePeriod(period.id)}
                                disabled={isDisabled}
                                className={`p-1 h-8 w-8 rounded-md hover:bg-red-50 transition-colors ${
                                  isDisabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            )}
                        </div>

                        {/* Time Range Display */}
                        <div className="text-center mb-4">
                          <div className="text-lg font-bold text-foreground">
                            {formatTime(period.startTime)} -{" "}
                            {formatTime(period.endTime)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Charging time period
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-1">
                          {/* Start Time */}
                          <div
                            className={`bg-background/50 rounded-xl p-4 ${
                              isDisabled ? "opacity-50" : ""
                            }`}
                          >
                            <h5 className="text-sm font-medium text-foreground mb-2 text-center">
                              Start Time
                            </h5>
                            <div className="flex justify-center">
                              <TimePicker
                                value={period.startTime}
                                onChange={(newValue) =>
                                  !isDisabled &&
                                  updatePeriod(period.id, "startTime", newValue)
                                }
                                disabled={isDisabled}
                                slotProps={{
                                  textField: {
                                    size: "small",
                                    sx: { width: "100px" },
                                  },
                                }}
                              />
                            </div>
                          </div>

                          {/* End Time */}
                          <div
                            className={`bg-background/50 rounded-xl p-4 ${
                              isDisabled ? "opacity-50" : ""
                            }`}
                          >
                            <h5 className="text-sm font-medium text-foreground mb-2 text-center">
                              End Time
                            </h5>
                            <div className="flex justify-center">
                              <TimePicker
                                value={period.endTime}
                                onChange={(newValue) =>
                                  !isDisabled &&
                                  updatePeriod(period.id, "endTime", newValue)
                                }
                                disabled={isDisabled}
                                slotProps={{
                                  textField: {
                                    size: "small",
                                    sx: { width: "100px" },
                                  },
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </LocalizationProvider>
              </div>
            </div>
          )}

          {/* Frequency Configuration */}
          {settings.enabled && (
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
              <h3 className="text-lg text-card-foreground font-semibold mb-4">
                Frequency
              </h3>
              <div
                className={`grid grid-cols-2 gap-3 mb-4 ${
                  isDisabled ? "opacity-50" : ""
                }`}
              >
                {frequencyOptions.map((option) => (
                  <button
                    key={option.value}
                    disabled={isDisabled}
                    onClick={() =>
                      !isDisabled &&
                      setSettings({
                        ...settings,
                        frequency: option.value,
                        specificDays:
                          option.value === "specific-days"
                            ? settings.specificDays
                            : [],
                      })
                    }
                    className={`p-3 rounded-xl border transition-all duration-300 ${
                      settings.frequency === option.value
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                        : "bg-muted/20 border-border text-foreground hover:bg-muted/30"
                    } ${isDisabled ? "cursor-not-allowed" : ""}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Specific Days Selection */}
              {settings.frequency === "specific-days" && (
                <div className="space-y-3">
                  <label className="block text-sm text-muted-foreground">
                    Select Days
                  </label>
                  <div
                    className={`grid grid-cols-7 gap-2 ${
                      isDisabled ? "opacity-50" : ""
                    }`}
                  >
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.value}
                        disabled={isDisabled}
                        onClick={() => {
                          if (isDisabled) return;
                          const isSelected = settings.specificDays.includes(
                            day.value
                          );
                          const newDays = isSelected
                            ? settings.specificDays.filter(
                                (d) => d !== day.value
                              )
                            : [...settings.specificDays, day.value];
                          setSettings({ ...settings, specificDays: newDays });
                        }}
                        className={`p-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                          settings.specificDays.includes(day.value)
                            ? "bg-blue-500 text-white"
                            : "bg-muted/20 text-foreground hover:bg-muted/30"
                        } ${isDisabled ? "cursor-not-allowed" : ""}`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Information Section */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
            <h3 className="text-lg text-card-foreground font-semibold mb-4 flex items-center">
              <Info className="w-5 h-5 text-blue-500 mr-2" />
              How Scheduled Charging Works
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong className="text-foreground">Multiple Periods:</strong>{" "}
                  Set up to 4 different time periods for flexible charging
                  schedules
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong className="text-foreground">Time Control:</strong>{" "}
                  Battery charges only during the specified start and end times
                  for each period
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong className="text-foreground">Frequency:</strong> Choose
                  when this schedule applies - one-time, weekdays, weekends, or
                  specific days
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong className="text-foreground">Smart Control:</strong>{" "}
                  Charging automatically stops outside all scheduled periods
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              width="full"
              onClick={handleSave}
              disabled={isDisabled}
              className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
            >
              Save Settings
            </Button>

            <Button variant="secondary" size="lg" width="full" onClick={onBack}>
              Cancel
            </Button>
          </div>

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
