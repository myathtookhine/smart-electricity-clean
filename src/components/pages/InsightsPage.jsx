import { useState, useMemo, useRef, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  BarChart3,
  Zap,
  Sun,
  Battery,
  Car,
  Home,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Info,
} from "lucide-react";
import { useTheme } from "../ThemeProvider";

// Mock data for demonstration - Enhanced bidirectional flow
const generateHourlyData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map((hour) => {
    // Solar generation pattern (peak around noon)
    const solarMultiplier =
      hour >= 6 && hour <= 18 ? Math.sin(((hour - 6) / 12) * Math.PI) : 0;
    const solarGeneration = solarMultiplier * (2 + Math.random() * 2); // 0-4 kW peak

    // House load pattern (higher in morning/evening)
    const baseLoad = 1 + Math.sin((((hour + 6) % 24) / 24) * 2 * Math.PI) * 0.5;
    const houseLoad = baseLoad + Math.random() * 0.5; // 0.5-2 kW

    // Battery behavior based on solar and load
    const excessSolar = Math.max(0, solarGeneration - houseLoad);
    const deficit = Math.max(0, houseLoad - solarGeneration);

    // Battery: Positive = discharging, Negative = charging
    let batteryFlow = 0;
    if (excessSolar > 0.5) {
      batteryFlow = -(excessSolar * 0.7 + Math.random() * 0.3); // Charging (negative)
    } else if (deficit > 0.3 && Math.random() > 0.3) {
      batteryFlow = Math.min(deficit * 0.8, 2) + Math.random() * 0.5; // Discharging (positive)
    }

    // Grid: Positive = import, Negative = export
    const netDemand = houseLoad - solarGeneration - batteryFlow;
    const gridFlow = netDemand + (Math.random() - 0.5) * 0.3; // Add some variation

    // EV charging (mostly evening/night)
    const evCharger =
      (hour >= 20 || hour <= 6) && Math.random() > 0.6
        ? Math.random() * 2.5 + 0.5
        : 0;

    return {
      time: hour,
      gridImportExport: Number(gridFlow.toFixed(2)),
      solarGeneration: Number(solarGeneration.toFixed(2)),
      batteryChargeDischarge: Number(batteryFlow.toFixed(2)),
      houseLoad: Number(houseLoad.toFixed(2)),
      evCharger: Number(evCharger.toFixed(2)),
    };
  });
};

const generateSummaryData = () => ({
  grid: 25.4,
  solar: 18.7,
  battery: 12.3,
  ev: 8.9,
});

// Generate summary report data based on time period
const generateSummaryReportData = (timeView) => {
  const baseData = {
    gridImport: 0,
    gridExport: 0,
    solarGeneration: 0,
    homeConsumption: 0,
    evCharging: 0,
    batteryCharge: 0,
  };

  // Simulate different values based on time period with more variation
  const multiplier =
    timeView === "1day"
      ? 1
      : timeView === "7days"
      ? 7
      : timeView === "30days"
      ? 30
      : 365;

  // Create more varied data for better pie chart visualization
  const baseValues = {
    gridImport: 15.2,
    gridExport: 8.7,
    solarGeneration: 25.5,
    homeConsumption: 18.9,
    evCharging: 12.3,
    batteryCharge: 9.6,
  };

  return {
    gridImport: (
      baseValues.gridImport * multiplier +
      Math.random() * 8
    ).toFixed(1),
    gridExport: (
      baseValues.gridExport * multiplier +
      Math.random() * 5
    ).toFixed(1),
    solarGeneration: (
      baseValues.solarGeneration * multiplier +
      Math.random() * 10
    ).toFixed(1),
    homeConsumption: (
      baseValues.homeConsumption * multiplier +
      Math.random() * 7
    ).toFixed(1),
    evCharging: (
      baseValues.evCharging * multiplier +
      Math.random() * 6
    ).toFixed(1),
    batteryCharge: (
      baseValues.batteryCharge * multiplier +
      Math.random() * 4
    ).toFixed(1),
  };
};

export function InsightsPage() {
  const { theme } = useTheme();
  const [timeView, setTimeView] = useState("today"); // 'today', '7days', '30days', '1year'
  const [summaryTimeView, setSummaryTimeView] = useState("1day"); // '1day', '7days', '30days', '1year'
  const [selectedFilters, setSelectedFilters] = useState({
    grid: true,
    solar: true,
    battery: true,
    house: true,
    ev: true,
  });
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-09-02");

  // Refs for drag scrolling
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const dateInputRef = useRef(null);

  // Drag scrolling functionality
  const useDragScroll = (ref) => {
    useEffect(() => {
      const element = ref.current;
      if (!element) return;

      let isDown = false;
      let startX;
      let scrollLeft;

      // Mouse events
      const mouseDown = (e) => {
        isDown = true;
        element.style.cursor = "grabbing";
        startX = e.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
        e.preventDefault();
      };

      const mouseLeave = () => {
        isDown = false;
        element.style.cursor = "grab";
      };

      const mouseUp = () => {
        isDown = false;
        element.style.cursor = "grab";
      };

      const mouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - element.offsetLeft;
        const walk = (x - startX) * 2;
        element.scrollLeft = scrollLeft - walk;
      };

      // Touch events for mobile
      const touchStart = (e) => {
        isDown = true;
        const touch = e.touches[0];
        startX = touch.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
      };

      const touchEnd = () => {
        isDown = false;
      };

      const touchMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const touch = e.touches[0];
        const x = touch.pageX - element.offsetLeft;
        const walk = (x - startX) * 2;
        element.scrollLeft = scrollLeft - walk;
      };

      element.addEventListener("mousedown", mouseDown);
      element.addEventListener("mouseleave", mouseLeave);
      element.addEventListener("mouseup", mouseUp);
      element.addEventListener("mousemove", mouseMove);
      element.addEventListener("touchstart", touchStart, { passive: false });
      element.addEventListener("touchend", touchEnd);
      element.addEventListener("touchmove", touchMove, { passive: false });

      return () => {
        element.removeEventListener("mousedown", mouseDown);
        element.removeEventListener("mouseleave", mouseLeave);
        element.removeEventListener("mouseup", mouseUp);
        element.removeEventListener("mousemove", mouseMove);
        element.removeEventListener("touchstart", touchStart);
        element.removeEventListener("touchend", touchEnd);
        element.removeEventListener("touchmove", touchMove);
      };
    }, [ref]);
  };

  useDragScroll(scrollRef1);
  useDragScroll(scrollRef2);

  // Close tooltip and calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeTooltip && !event.target.closest(".relative")) {
        setActiveTooltip(null);
      }

      // Close calendar if clicking outside the date picker
      if (showCalendar && !event.target.closest("[data-date-picker]")) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeTooltip, showCalendar]);

  const hourlyData = useMemo(() => generateHourlyData(), []);
  const summaryData = useMemo(() => generateSummaryData(), []);
  const summaryReportData = useMemo(
    () => generateSummaryReportData(summaryTimeView),
    [summaryTimeView]
  );

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const resetFilters = () => {
    setSelectedFilters({
      grid: true,
      solar: true,
      battery: true,
      house: true,
      ev: true,
    });
  };

  // Tooltip data
  const tooltipData = {
    gridImport:
      "Electricity drawn from the grid to power your home, EV Charger and charge your battery.",
    gridExport:
      "Excess electricity sent back to the grid, usually from solar or battery.",
    solarGeneration:
      "Total electricity generated by your solar panels during the selected time period.",
    homeConsumption:
      "Total electricity used by your home, including appliances, EVs, and heating.",
    evCharging:
      "Electricity used to charge your electric vehicle via the Duracell EV charger.",
    batteryCharge: "Total Energy input to your battery via Solar and Grid.",
  };

  const toggleTooltip = (cardType) => {
    setActiveTooltip(activeTooltip === cardType ? null : cardType);
  };

  // Calendar handlers
  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
    if (!showCalendar && dateInputRef.current) {
      // Small delay to ensure the calendar is shown, then focus
      setTimeout(() => {
        dateInputRef.current.showPicker();
      }, 100);
    }
  };

  const handleDateInputFocus = () => {
    setShowCalendar(true);
  };

  const handleDateInputBlur = () => {
    // Delay hiding to allow for calendar interaction
    setTimeout(() => {
      setShowCalendar(false);
    }, 200);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const getChartData = () => {
    if (timeView === "today") {
      return hourlyData.map((item) => ({
        x: item.time,
        ...(selectedFilters.grid && { grid: item.gridImportExport }),
        ...(selectedFilters.solar && { solar: item.solarGeneration }),
        ...(selectedFilters.battery && {
          battery: item.batteryChargeDischarge,
        }),
        ...(selectedFilters.house && { house: item.houseLoad }),
        ...(selectedFilters.ev && { ev: item.evCharger }),
      }));
    }

    // Generate summary data for other time periods
    let periods = [];
    let labelFormat = "";

    if (timeView === "7days") {
      periods = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);
      labelFormat = "Day";
    } else if (timeView === "30days") {
      periods = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
      labelFormat = "Day";
    } else if (timeView === "1year") {
      periods = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      labelFormat = "Month";
    }

    return periods.map((period, index) => ({
      x: period,
      grid: (Math.random() - 0.5) * 40 + 20, // -10 to +50 kWh range
      solar: Math.random() * 60 + 10, // 10-70 kWh range
      battery: (Math.random() - 0.5) * 30, // -15 to +15 kWh range
      house: Math.random() * 50 + 20, // 20-70 kWh range
      ev: Math.random() * 25 + 5, // 5-30 kWh range
    }));
  };

  const getLineConfig = () => {
    const lines = [];
    if (selectedFilters.grid) {
      lines.push({
        dataKey: "grid",
        label: "Grid Import/Export",
        color: "#ef4444", // red
      });
    }
    if (selectedFilters.solar) {
      lines.push({
        dataKey: "solar",
        label: "Solar Generation",
        color: "#eab308", // yellow
      });
    }
    if (selectedFilters.battery) {
      lines.push({
        dataKey: "battery",
        label: "Battery Charge/Discharge",
        color: "#3b82f6", // blue
      });
    }
    if (selectedFilters.house) {
      lines.push({
        dataKey: "house",
        label: "House Load",
        color: theme === "dark" ? "#ffffff" : "#6b7280", // white for dark mode, gray for light mode
      });
    }
    if (selectedFilters.ev) {
      lines.push({
        dataKey: "ev",
        label: "EV Charger",
        color: "#22c55e", // green
      });
    }
    return lines;
  };

  const getChartDimensions = () => {
    if (timeView === "today") {
      return { width: 400, height: 300 };
    }
    // Smaller dimensions for longer time periods to fit phone viewport
    return { width: 350, height: 250 };
  };

  const getYAxisRange = () => {
    if (timeView === "today") {
      return { min: -4, max: 4 };
    }
    // Larger range for longer time periods (kWh vs kW)
    return { min: -20, max: 80 };
  };

  const getXAxisLabel = () => {
    const chartData = getChartData();
    if (timeView === "today") {
      return chartData.map((item) => `${item.x}:00`);
    }
    return chartData.map((item) => item.x);
  };

  const pieData = [
    { id: 0, value: summaryData.grid, label: "Grid", color: "#ef4444" },
    { id: 1, value: summaryData.solar, label: "Solar", color: "#eab308" },
    { id: 2, value: summaryData.battery, label: "Battery", color: "#3b82f6" },
    { id: 3, value: summaryData.ev, label: "EV", color: "#22c55e" },
  ];

  const filterIcons = [
    { key: "grid", icon: Zap, color: "#ef4444", label: "Grid" },
    { key: "solar", icon: Sun, color: "#eab308", label: "Solar" },
    { key: "battery", icon: Battery, color: "#3b82f6", label: "Battery" },
    {
      key: "house",
      icon: Home,
      color: theme === "dark" ? "#ffffff" : "#6b7280",
      label: "House",
    },
    { key: "ev", icon: Car, color: "#22c55e", label: "EV" },
  ];

  const timeViewOptions = [
    { key: "today", label: "Today", icon: Clock },
    { key: "7days", label: "7 Days", icon: Calendar },
    { key: "30days", label: "30 Days", icon: Calendar },
    { key: "1year", label: "1 Year", icon: Calendar },
  ];

  const summaryTimeViewOptions = [
    { key: "1day", label: "1 Day" },
    { key: "7days", label: "7 Days" },
    { key: "30days", label: "30 Days" },
    { key: "1year", label: "1 Year" },
  ];

  const summaryCards = [
    {
      key: "gridImport",
      label: "Grid Import",
      icon: ArrowDown,
      color: "#ef4444",
      value: summaryReportData.gridImport,
    },
    {
      key: "gridExport",
      label: "Grid Export",
      icon: ArrowUp,
      color: "#22c55e",
      value: summaryReportData.gridExport,
    },
    {
      key: "solarGeneration",
      label: "Solar Generation",
      icon: Sun,
      color: "#eab308",
      value: summaryReportData.solarGeneration,
    },
    {
      key: "homeConsumption",
      label: "Home Consumption",
      icon: Home,
      color: theme === "dark" ? "#ffffff" : "#6b7280",
      value: summaryReportData.homeConsumption,
    },
    {
      key: "evCharging",
      label: "EV Charging",
      icon: Car,
      color: "#3b82f6",
      value: summaryReportData.evCharging,
    },
    {
      key: "batteryCharge",
      label: "Battery Charge",
      icon: Battery,
      color: "#8b5cf6",
      value: summaryReportData.batteryCharge,
    },
  ];

  return (
    <div className="min-h-full bg-background text-foreground">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .modern-scrollbar::-webkit-scrollbar {
            height: 6px;
          }
          .modern-scrollbar::-webkit-scrollbar-track {
            background: ${theme === "dark" ? "#2d3748" : "#f7fafc"};
            border-radius: 10px;
            margin: 0 10px;
          }
          .modern-scrollbar::-webkit-scrollbar-thumb {
            background: ${theme === "dark" ? "#4a5568" : "#cbd5e0"};
            border-radius: 10px;
            transition: all 0.2s ease;
          }
          .modern-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${theme === "dark" ? "#718096" : "#a0aec0"};
          }
          .modern-scrollbar::-webkit-scrollbar-thumb:active {
            background: ${theme === "dark" ? "#a0aec0" : "#718096"};
          }
          
          /* For Firefox */
          .modern-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: ${
              theme === "dark" ? "#4a5568 #2d3748" : "#cbd5e0 #f7fafc"
            };
          }

          /* Hide default date input calendar icon */
          input[type="date"]::-webkit-calendar-picker-indicator {
            display: none;
            -webkit-appearance: none;
          }
          
          input[type="date"]::-webkit-inner-spin-button,
          input[type="date"]::-webkit-clear-button {
            display: none;
            -webkit-appearance: none;
          }
        `,
        }}
      />
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl text-foreground font-semibold">
              Energy Insights
            </h1>
            <p className="text-sm text-muted-foreground">Analytics & Reports</p>
          </div>
        </div>
      </div>

      {/* Time View Selector */}
      <div className="px-6 mb-6">
        <div className="flex space-x-2">
          {timeViewOptions.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTimeView(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                timeView === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/20 text-muted-foreground hover:bg-muted/30"
              }`}
            >
              {/* <Icon className="w-4 h-4" /> */}
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-24">
        <div className="bg-card rounded-2xl p-6 shadow-lg">
          {timeView === "today" ? (
            <>
              {/* Interactive Bar Chart */}
              <div>
                <h2 className="text-lg font-semibold text-card-foreground mb-4">
                  Real-time Energy Flow
                </h2>

                {/* Y-axis Legend */}
                {/* <div className="mb-4 text-sm text-muted-foreground">
                <div className="flex justify-between items-center">
                  <span>↑ Positive: Grid Import • Battery Discharge</span>
                  <span>↓ Negative: Grid Export • Battery Charge</span>
                </div>
                <div className="text-center mt-1 text-xs">
                  {timeView === "today" ? "Power (kW)" : "Energy (kWh)"}
                </div>
              </div> */}

                <div
                  ref={scrollRef1}
                  className="overflow-x-auto cursor-grab select-none modern-scrollbar transition-all duration-200 hover:shadow-sm"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor:
                      theme === "dark" ? "#4a5568 #2d3748" : "#cbd5e0 #f7fafc",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.cursor = "grab";
                    e.target.style.background =
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(0,0,0,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  <div className="min-w-fit">
                    <BarChart
                      width={timeView === "today" ? 600 : 450}
                      height={280}
                      colors={getLineConfig().map((line) =>
                        line.dataKey === "house"
                          ? theme === "dark"
                            ? "#ffffff"
                            : "#6b7280"
                          : line.color
                      )}
                      series={getLineConfig().map((line) => ({
                        data: getChartData().map(
                          (item) => item[line.dataKey] || 0
                        ),
                        label: line.label,
                        type: "bar",
                      }))}
                      xAxis={[
                        {
                          data: getXAxisLabel(),
                          scaleType: "band",
                          tickLabelStyle: {
                            fontSize: "10px",
                            fill: theme === "dark" ? "#ffffff" : "#000000",
                          },
                        },
                      ]}
                      yAxis={[
                        {
                          min: getYAxisRange().min,
                          max: getYAxisRange().max,
                          tickLabelStyle: {
                            fontSize: "12px",
                            fill: theme === "dark" ? "#ffffff" : "#000000",
                          },
                        },
                      ]}
                      margin={{ left: 10, right: 10, top: 10, bottom: 50 }}
                      grid={{ horizontal: true }}
                      sx={{
                        "& .MuiChartsAxis-root": {
                          "& .MuiChartsAxis-tickLabel": {
                            color: theme === "dark" ? "#ffffff" : "#000000",
                            fontSize: "12px",
                          },
                          "& .MuiChartsAxis-line": {
                            stroke: theme === "dark" ? "#ffffff" : "#000000",
                          },
                          "& .MuiChartsAxis-tick": {
                            stroke: theme === "dark" ? "#ffffff" : "#000000",
                          },
                        },
                        "& .MuiChartsGrid-root": {
                          "& .MuiChartsGrid-line": {
                            stroke:
                              theme === "dark"
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.1)",
                          },
                        },
                        "& .MuiChartsTooltip-root": {
                          backgroundColor:
                            theme === "dark" ? "#2a2d30" : "#ffffff",
                          color: theme === "dark" ? "#ffffff" : "#000000",
                          border: `1px solid ${
                            theme === "dark" ? "#4a4d50" : "#e5e5e5"
                          }`,
                        },
                        "& .MuiChartsLabel-root": {
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        },
                        "& .MuiChartsLegend-label": {
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Bar Chart for longer periods */}
              <div>
                <h2 className="text-lg font-semibold text-card-foreground mb-4">
                  Energy Flow Analysis
                </h2>

                {/* Y-axis Legend */}
                {/* <div className="mb-4 text-sm text-muted-foreground">
                <div className="flex justify-between items-center">
                  <span>↑ Positive: Grid Import • Battery Discharge</span>
                  <span>↓ Negative: Grid Export • Battery Charge</span>
                </div>
                <div className="text-center mt-1 text-xs">Energy (kWh)</div>
              </div> */}

                <div
                  ref={scrollRef2}
                  className="overflow-x-auto cursor-grab select-none modern-scrollbar transition-all duration-200 hover:shadow-sm"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor:
                      theme === "dark" ? "#4a5568 #2d3748" : "#cbd5e0 #f7fafc",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.cursor = "grab";
                    e.target.style.background =
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(0,0,0,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  <div className="min-w-fit">
                    <BarChart
                      width={
                        timeView === "7days"
                          ? 500
                          : timeView === "30days"
                          ? 800
                          : 700
                      }
                      height={280}
                      colors={getLineConfig().map((line) =>
                        line.dataKey === "house"
                          ? theme === "dark"
                            ? "#ffffff"
                            : "#6b7280"
                          : line.color
                      )}
                      series={getLineConfig().map((line) => ({
                        data: getChartData().map(
                          (item) => item[line.dataKey] || 0
                        ),
                        label: line.label,
                        type: "bar",
                      }))}
                      xAxis={[
                        {
                          data: getXAxisLabel(),
                          scaleType: "band",
                          tickLabelStyle: {
                            fontSize: "10px",
                            fill: theme === "dark" ? "#ffffff" : "#000000",
                          },
                        },
                      ]}
                      yAxis={[
                        {
                          min: getYAxisRange().min,
                          max: getYAxisRange().max,
                          tickLabelStyle: {
                            fontSize: "12px",
                            fill: theme === "dark" ? "#ffffff" : "#000000",
                          },
                        },
                      ]}
                      margin={{ left: 10, right: 10, top: 10, bottom: 50 }}
                      grid={{ horizontal: true }}
                      sx={{
                        "& .MuiChartsAxis-root": {
                          "& .MuiChartsAxis-tickLabel": {
                            fill: theme === "dark" ? "#ffffff" : "#000000",
                            fontSize: "12px",
                          },
                          "& .MuiChartsAxis-line": {
                            stroke: theme === "dark" ? "#ffffff" : "#000000",
                          },
                          "& .MuiChartsAxis-tick": {
                            stroke: theme === "dark" ? "#ffffff" : "#000000",
                          },
                        },
                        "& .MuiChartsGrid-root": {
                          "& .MuiChartsGrid-line": {
                            stroke:
                              theme === "dark"
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.1)",
                          },
                        },
                        "& .MuiChartsTooltip-root": {
                          backgroundColor:
                            theme === "dark" ? "#2a2d30" : "#ffffff",
                          color: theme === "dark" ? "#ffffff" : "#000000",
                          border: `1px solid ${
                            theme === "dark" ? "#4a4d50" : "#e5e5e5"
                          }`,
                        },
                        "& .MuiChartsLabel-root": {
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        },
                        "& .MuiChartsLegend-label": {
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Filter Controls */}
          <div className="mt-6">
            <div className="flex flex-row justify-around gap-2">
              {filterIcons.map(({ key, icon: Icon, color, label }) => (
                <button
                  key={key}
                  onClick={() => toggleFilter(key)}
                  className={`flex flex-col items-center justify-center space-y-1 rounded-lg transition-all duration-200 border flex-shrink-0 ${
                    selectedFilters[key]
                      ? "border-opacity-50 shadow-sm"
                      : "border-border bg-muted/20 hover:bg-muted/30"
                  }`}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: selectedFilters[key]
                      ? `${color}15`
                      : undefined,
                    borderColor: selectedFilters[key] ? color : undefined,
                    color: selectedFilters[key] ? color : undefined,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xl text-foreground font-semibold text-center mb-3">
            Summary Report
          </h4>

          {/* Summary Time View Selector */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {summaryTimeViewOptions.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSummaryTimeView(key)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl transition-all duration-300 ${
                  summaryTimeView === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/20 text-muted-foreground hover:bg-muted/30"
                }`}
              >
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Date Picker  */}
          <div
            className="bg-card rounded-2xl p-4 shadow-lg border border-border/50"
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
          {/* Summary Pie Chart  */}
          <div className="bg-card rounded-2xl p-4 shadow-lg border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Energy Distribution
              </h3>
              <div className="text-xs text-muted-foreground">
                {summaryTimeView === "1day"
                  ? "Daily"
                  : summaryTimeView === "7days"
                  ? "Weekly"
                  : summaryTimeView === "30days"
                  ? "Monthly"
                  : "Yearly"}{" "}
                Overview
              </div>
            </div>

            <div className="flex flex-col items-center">
              <PieChart
                width={300}
                height={200}
                colors={[
                  "#ef4444", // Grid Import - Red
                  "#22c55e", // Grid Export - Green
                  "#eab308", // Solar Generation - Yellow
                  theme === "dark" ? "#ffffff" : "#6b7280", // Home Consumption - White/Gray
                  "#3b82f6", // EV Charging - Blue
                  "#8b5cf6", // Battery Charge - Purple
                ]}
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: parseFloat(summaryReportData.gridImport),
                        label: "Grid Import",
                        color: "#ef4444",
                      },
                      {
                        id: 1,
                        value: parseFloat(summaryReportData.gridExport),
                        label: "Grid Export",
                        color: "#22c55e",
                      },
                      {
                        id: 2,
                        value: parseFloat(summaryReportData.solarGeneration),
                        label: "Solar",
                        color: "#eab308",
                      },
                      {
                        id: 3,
                        value: parseFloat(summaryReportData.homeConsumption),
                        label: "Home",
                        color: theme === "dark" ? "#ffffff" : "#6b7280",
                      },
                      {
                        id: 4,
                        value: parseFloat(summaryReportData.evCharging),
                        label: "EV",
                        color: "#3b82f6",
                      },
                      {
                        id: 5,
                        value: parseFloat(summaryReportData.batteryCharge),
                        label: "Battery",
                        color: "#8b5cf6",
                      },
                    ],
                    innerRadius: 30,
                    outerRadius: 80,
                    paddingAngle: 2,
                    cornerRadius: 0,
                  },
                ]}
                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                legend={{ hidden: true }}
                sx={{
                  "& .MuiChartsTooltip-root": {
                    backgroundColor: theme === "dark" ? "#2a2d30" : "#ffffff",
                    color: theme === "dark" ? "#ffffff" : "#000000",
                    border: `1px solid ${
                      theme === "dark" ? "#4a4d50" : "#e5e5e5"
                    }`,
                  },
                  "& .MuiChartsLegend-root": {
                    display: "none",
                  },
                }}
              />

              {/* Custom Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4 w-full max-w-xs">
                {[
                  {
                    label: "Grid Import",
                    color: "#ef4444",
                    value: summaryReportData.gridImport,
                  },
                  {
                    label: "Grid Export",
                    color: "#22c55e",
                    value: summaryReportData.gridExport,
                  },
                  {
                    label: "Solar",
                    color: "#eab308",
                    value: summaryReportData.solarGeneration,
                  },
                  {
                    label: "Home",
                    color: theme === "dark" ? "#ffffff" : "#6b7280",
                    value: summaryReportData.homeConsumption,
                  },
                  {
                    label: "EV",
                    color: "#3b82f6",
                    value: summaryReportData.evCharging,
                  },
                  {
                    label: "Battery",
                    color: "#8b5cf6",
                    value: summaryReportData.batteryCharge,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-muted-foreground truncate">
                        {item.label}
                      </span>
                      <span className="text-xs font-medium text-card-foreground">
                        {item.value} kWh
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Cards - 2 col 3 row Grid */}
          <div className="grid grid-cols-2 gap-4">
            {summaryCards.map(({ key, label, icon: Icon, color, value }) => (
              <div
                key={key}
                className="bg-card rounded-2xl p-4 shadow-lg border border-border/50 relative"
              >
                {/* Info Icon */}
                <button
                  onClick={() => toggleTooltip(key)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-muted/20 hover:bg-muted/30 flex items-center justify-center transition-colors"
                >
                  <Info className="w-3 h-3 text-muted-foreground" />
                </button>

                {/* Tooltip */}
                {activeTooltip === key && (
                  <div className="absolute top-10 right-0 z-10 w-48 p-3 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border text-xs">
                    {tooltipData[key]}
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
                  </div>
                )}

                {/* Card Content */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      {label}
                    </p>
                    <p className="text-lg font-bold text-card-foreground">
                      {value} kWh
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
