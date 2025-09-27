import { useState, useMemo, useRef, useEffect } from "react";
import { LineChart, areaElementClasses } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useYScale, useDrawingArea } from "@mui/x-charts/hooks";
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
  Bell,
  Moon,
  Plus,
  UtilityPoleIcon,
} from "lucide-react";
import { useTheme } from "../ThemeProvider";
import {
  ConsumptionSourceBreakdownChart,
  BatteryUsageBreakdownChart,
  SelfConsumptionRatioChart,
} from "../AdvancedDonutCharts";
import logo from "../../assets/duracell-logo.png";
import DuracellWhite from "../../assets/duracell-logo-white.svg";
import DuracellBlack from "../../assets/duracell-logo-black.svg";

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const hexToRgb = (hex) => {
  const normalized = hex.replace("#", "");
  const len = normalized.length;
  if (len !== 3 && len !== 6) return { r: 0, g: 0, b: 0 };
  const expanded =
    len === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;
  const num = parseInt(expanded, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;

const mixChannel = (channel, amount, target) =>
  Math.round(channel + (target - channel) * amount);

const mixColor = (hex, amount, target) => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: mixChannel(r, amount, target),
    g: mixChannel(g, amount, target),
    b: mixChannel(b, amount, target),
  });
};

const lightenColor = (hex, amount = 0.25) => mixColor(hex, amount, 255);
const darkenColor = (hex, amount = 0.2) => mixColor(hex, amount, 0);

const SUMMARY_TIMEFRAME_LABELS = {
  "1day": "Daily",
  "7days": "Weekly",
  "30days": "Monthly",
  "1year": "Yearly",
};

const ENERGY_PALETTE = {
  solar: "#eab308",
  battery: "#16a34a",
  gridImport: "#ef4444",
  gridExport: "#22c55e",
  house: "#38bdf8",
  ev: "#3b82f6",
};

const parseNumber = (value, fallback = 0) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildRatioSegments = (total, configs) => {
  if (!Number.isFinite(total) || total <= 0) {
    return [];
  }

  let allocated = 0;
  const lastIndex = configs.length - 1;

  return configs
    .map((config, index) => {
      let value;

      if (index === lastIndex) {
        value = total - allocated;
      } else {
        const proposed = total * (config.ratio ?? 0);
        value = Number(proposed.toFixed(1));
        if (config.maxValue !== undefined) {
          value = Math.min(value, config.maxValue);
        }
        value = Math.min(value, Math.max(total - allocated, 0));
        allocated += value;
      }

      const finalValue = Number(Number(Math.max(value, 0)).toFixed(1));
      if (index === lastIndex) {
        allocated += finalValue;
      }

      return {
        ...config,
        value: finalValue,
      };
    })
    .filter((item) => item.value > 0);
};

// Bi-directional gradient component for energy flow visualization
function BiDirectionalGradient({
  threshold = 0,
  positiveColor,
  negativeColor,
  id,
}) {
  const { top, height, bottom } = useDrawingArea();
  const svgHeight = top + bottom + height;
  const scale = useYScale();
  const y0 = scale(threshold);
  const offset = svgHeight ? clamp01(y0 / svgHeight) : 0.5;
  const upperLight = lightenColor(positiveColor, 0.35);
  const upperDeep = darkenColor(positiveColor, 0.1);
  const lowerLight = lightenColor(negativeColor, 0.3);
  const lowerDeep = darkenColor(negativeColor, 0.15);
  const upperStop = clamp01(offset - 0.015);
  const lowerStop = clamp01(offset + 0.015);

  return (
    <defs>
      <linearGradient
        id={id}
        x1="0"
        x2="0"
        y1="0"
        y2={`${svgHeight}px`}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} stopColor={upperLight} stopOpacity={0.85} />
        <stop offset={upperStop} stopColor={upperDeep} stopOpacity={0.95} />
        <stop offset={lowerStop} stopColor={lowerLight} stopOpacity={0.8} />
        <stop offset={1} stopColor={lowerDeep} stopOpacity={0.95} />
      </linearGradient>
    </defs>
  );
}

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

export function InsightsPage({ onPageChange }) {
  const { theme, setTheme } = useTheme();
  const notificationCount = 3; // Example notification count
  const [timeView, setTimeView] = useState("today"); // 'today', '7d', '30d', '1y'
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
  const headerLogo = theme === "dark" ? DuracellWhite : DuracellBlack;
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
  const summaryReportData = useMemo(
    () => generateSummaryReportData(summaryTimeView),
    [summaryTimeView]
  );
  const summaryTimeframeLabel = useMemo(
    () => SUMMARY_TIMEFRAME_LABELS[summaryTimeView] ?? "Custom",
    [summaryTimeView]
  );

  const consumptionBreakdown = useMemo(() => {
    const totalConsumption = parseNumber(summaryReportData.homeConsumption);

    if (totalConsumption <= 0) {
      return { total: 0, segments: [] };
    }

    const solarAvailable = parseNumber(summaryReportData.solarGeneration);
    const gridImport = parseNumber(summaryReportData.gridImport);
    const batteryCharge = parseNumber(summaryReportData.batteryCharge);

    const maxGridContribution = Math.min(totalConsumption, gridImport * 0.6);
    const maxBatteryContribution = Math.min(
      totalConsumption,
      batteryCharge * 0.7
    );
    const baseConfigs = [
      {
        id: "solar-to-load",
        label: "Solar to Load",
        ratio: 0.48,
        color: ENERGY_PALETTE.solar,
        legendColor: ENERGY_PALETTE.solar,
        legendSubLabel: "Direct solar coverage",
        maxValue: solarAvailable,
      },
      {
        id: "battery-to-load",
        label: "Battery to Load",
        ratio: 0.24,
        color: "#f97316",
        legendColor: "#f97316",
        legendSubLabel: "Stored energy",
        maxValue: maxBatteryContribution,
      },
      {
        id: "grid-to-load",
        label: "Grid to Load",
        ratio: 0.28,
        color: "#2563eb",
        legendColor: "#2563eb",
        legendSubLabel: "Supplement from grid",
        maxValue: maxGridContribution,
      },
    ];

    return {
      total: Number(totalConsumption.toFixed(1)),
      segments: buildRatioSegments(totalConsumption, baseConfigs),
    };
  }, [
    summaryReportData.homeConsumption,
    summaryReportData.solarGeneration,
    summaryReportData.gridImport,
    summaryReportData.batteryCharge,
  ]);

  const batteryUsageBreakdown = useMemo(() => {
    const batteryCharge = parseNumber(summaryReportData.batteryCharge);
    const gridExport = parseNumber(summaryReportData.gridExport);
    const dischargeBaseline = batteryCharge * 0.85 + gridExport * 0.2;
    const totalDischarge = Number(Math.max(dischargeBaseline, 0).toFixed(1));

    if (totalDischarge <= 0) {
      return { total: 0, segments: [] };
    }

    const configs = [
      {
        id: "battery-to-house",
        label: "To House",
        ratio: 0.5,
        color: ENERGY_PALETTE.house,
        legendColor: ENERGY_PALETTE.house,
        legendSubLabel: "Home loads",
      },
      {
        id: "battery-to-grid",
        label: "To Grid Export",
        ratio: 0.24,
        color: ENERGY_PALETTE.gridExport,
        legendColor: ENERGY_PALETTE.gridExport,
        legendSubLabel: "Grid support",
        maxValue: gridExport,
      },
      {
        id: "battery-to-ev",
        label: "To EV Charging",
        ratio: 0.26,
        color: ENERGY_PALETTE.ev,
        legendColor: ENERGY_PALETTE.ev,
        legendSubLabel: "EV sessions",
      },
    ];

    return {
      total: totalDischarge,
      segments: buildRatioSegments(totalDischarge, configs),
    };
  }, [summaryReportData.batteryCharge, summaryReportData.gridExport]);

  const selfConsumptionStats = useMemo(() => {
    const solarGeneration = parseNumber(summaryReportData.solarGeneration);
    const gridExport = parseNumber(summaryReportData.gridExport);
    if (solarGeneration <= 0) {
      return {
        total: 0,
        consumed: 0,
        exported: 0,
      };
    }

    const exported = Math.min(gridExport, solarGeneration);
    const consumed = Math.max(solarGeneration - exported, 0);

    return {
      total: Number(solarGeneration.toFixed(1)),
      consumed: Number(consumed.toFixed(1)),
      exported: Number(exported.toFixed(1)),
    };
  }, [summaryReportData.solarGeneration, summaryReportData.gridExport]);

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

    if (timeView === "7d") {
      periods = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);
      labelFormat = "Day";
    } else if (timeView === "30d") {
      periods = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
      labelFormat = "Day";
    } else if (timeView === "1y") {
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
    const baseConfig = {
      grid: {
        dataKey: "grid",
        label: "Grid Import/Export",
        strokeColor: "#f97316",
        positiveColor: "#f97316",
        negativeColor: "#2563eb",
        gradientId: "grid-gradient",
      },
      solar: {
        dataKey: "solar",
        label: "Solar Generation",
        strokeColor: "#f59e0b",
        positiveColor: "#f59e0b",
        negativeColor: "#f59e0b",
        gradientId: "solar-gradient",
      },
      battery: {
        dataKey: "battery",
        label: "Battery Charge/Discharge",
        strokeColor: "#fb8a22",
        positiveColor: "#fb8a22",
        negativeColor: "#0ea5e9",
        gradientId: "battery-gradient",
      },
      house: {
        dataKey: "house",
        label: "House Load",
        strokeColor: "#38bdf8",
        positiveColor: "#38bdf8",
        negativeColor: "#38bdf8",
        gradientId: "house-gradient",
      },
      ev: {
        dataKey: "ev",
        label: "EV Charger",
        strokeColor: "#0284c7",
        positiveColor: "#0ea5e9",
        negativeColor: "#0ea5e9",
        gradientId: "ev-gradient",
      },
    };

    return Object.keys(selectedFilters)
      .filter((key) => selectedFilters[key])
      .map((key) => baseConfig[key])
      .filter(Boolean);
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

  const lineSeries = useMemo(() => getLineConfig(), [selectedFilters]);
  const chartDataMemo = useMemo(
    () => getChartData(),
    [timeView, selectedFilters, hourlyData]
  );

  const getXAxisData = () => {
    if (timeView === "today") {
      return chartDataMemo.map((item) => `${item.x}:00`);
    }
    return chartDataMemo.map((item) => item.x);
  };

  const getXAxisLabel = () => {
    if (timeView === "today") {
      return chartDataMemo.map((item) => `${item.x}:00`);
    }
    return chartDataMemo.map((item) => item.x);
  };

  // Color scheme based on energy insights redesign spec
  // Warm tones for generation/inflow: Solar, Battery Discharge, Grid Export
  // Cool tones for consumption/outflow: House, EV, Grid Import, Battery Charge
  const filterIcons = [
    { key: "grid", icon: Zap, color: "#f97316", label: "Grid" },
    { key: "solar", icon: Sun, color: "#f59e0b", label: "Solar" },
    { key: "battery", icon: Battery, color: "#fb8a22", label: "Battery" },
    {
      key: "house",
      icon: Home,
      color: "#38bdf8",
      label: "House",
    },
    { key: "ev", icon: Car, color: "#0ea5e9", label: "EV" },
  ];

  const timeViewOptions = [
    { key: "today", label: "Today", icon: Clock },
    { key: "7d", label: "7d", icon: Calendar },
    { key: "30d", label: "30d", icon: Calendar },
    { key: "1y", label: "1y", icon: Calendar },
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
      color: "#22c55e",
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
        <div className="flex items-center justify-between mb-2">
          {/* Left: Light/Dark Mode Toggle */}
          <div>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-xl bg-muted hover:bg-muted/30 transition-all duration-300 mr-2"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>

          {/* Center: Logo */}
          <div className="text-center">
            <img
              src={headerLogo}
              alt="Duracell logo"
              className="w-32 h-auto object-contain"
            />
          </div>

          {/* Right: Notifications */}
          <div className="flex items-center relative">
            <button
              onClick={() => onPageChange && onPageChange("notifications")}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Time View Selector */}
      <div className="px-6 mb-6">
        <h4 className="text-xl text-foreground text-left mb-3">
          Energy Insights
        </h4>
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
      <div className="px-6 space-y-6 pb-8">
        <div className="bg-card rounded-2xl p-4 shadow-lg">
          {timeView === "today" ? (
            <>
              {/* Interactive Bar Chart */}
              <div>
                <h2 className="text-lg font-semibold text-card-foreground mb-4">
                  Real-time Energy Flow
                </h2>

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
                    <LineChart
                      width={timeView === "today" ? 600 : 450}
                      height={280}
                      xAxis={[
                        {
                          data: getXAxisData(),
                          scaleType: "point",
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
                      series={lineSeries.map((line) => ({
                        data: chartDataMemo.map(
                          (item) => item[line.dataKey] ?? 0
                        ),
                        label: line.label,
                        area: true,
                        showMark: false,
                        color: line.strokeColor,
                        areaFill: `url(#${line.gradientId})`,
                        stack:
                          line.dataKey === "solar" ||
                          line.dataKey === "house" ||
                          line.dataKey === "ev"
                            ? "positive"
                            : line.dataKey === "grid" ||
                              line.dataKey === "battery"
                            ? "bidirectional"
                            : undefined,
                      }))}
                      margin={{ left: 40, right: 20, top: 20, bottom: 50 }}
                      grid={{ horizontal: true, vertical: false }}
                      sx={{
                        [`& .${areaElementClasses.root}`]: {
                          fillOpacity: 0.7,
                          filter: "none",
                        },
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
                        "& .MuiChartsLegend-root": {
                          display: "none",
                        },
                      }}
                    >
                      {/* Bi-directional gradients for different energy types */}
                      {lineSeries.map((line) => (
                        <BiDirectionalGradient
                          key={line.gradientId}
                          threshold={0}
                          positiveColor={line.positiveColor}
                          negativeColor={line.negativeColor}
                          id={line.gradientId}
                        />
                      ))}
                    </LineChart>
                  </div>
                </div>
              </div>

              {/* Pill-style Legend */}
              <div className="mt-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  {filterIcons.map(({ key, icon: Icon, color, label }) => (
                    <button
                      key={key}
                      onClick={() => toggleFilter(key)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 border ${
                        selectedFilters[key]
                          ? "text-white border-transparent"
                          : "bg-muted/20 text-muted-foreground border-border hover:bg-muted/30"
                      }`}
                      style={{
                        backgroundColor: selectedFilters[key]
                          ? color
                          : undefined,
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{
                          color: selectedFilters[key] ? "white" : color,
                        }}
                      />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2x2 Minimalist Card Grid */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Energy Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Solar Card */}
                  <div
                    className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-amber-200/30 dark:border-amber-800/30 cursor-pointer hover:scale-105 transition-transform duration-200 relative overflow-hidden"
                    onClick={() => {
                      /* Navigate to solar detail view */
                    }}
                  >
                    {/* Background Sparkline */}
                    <div className="absolute inset-0 opacity-[0.25]">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 120 80"
                        className="text-amber-600"
                      >
                        <path
                          d="M0,52 C16,30 36,34 56,20 C74,10 96,40 112,28 S120,34 120,34"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <div className="text-xs text-amber-700/60 dark:text-amber-300/60">
                        Solar
                      </div>
                    </div>
                    <div className="relative z-10">
                      {/* Main Metric */}
                      <div className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-1">
                        {summaryReportData.solarGeneration}
                        <span className="text-base ms-1">kWh</span>
                      </div>
                      {/* Context Text */}
                      <div className="text-xs text-amber-700/70 dark:text-amber-300/70">
                        15% less than yesterday
                      </div>
                    </div>
                  </div>

                  {/* Battery Card */}
                  <div
                    className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-4 border border-teal-200/30 dark:border-teal-800/30 cursor-pointer hover:scale-105 transition-transform duration-200 relative overflow-hidden"
                    onClick={() => {
                      /* Navigate to battery detail view */
                    }}
                  >
                    {/* Background Sparkline */}
                    <div className="absolute inset-0 opacity-[0.25]">
                      <svg width="100%" height="100%" viewBox="0 0 120 80">
                        <line
                          x1="0"
                          y1="40"
                          x2="120"
                          y2="40"
                          stroke="rgba(20,184,166,0.2)"
                          strokeWidth="0.8"
                          strokeDasharray="4 4"
                        />
                        <path
                          d="M0,46 C12,28 36,30 56,22 C78,18 96,26 112,20 S120,18 120,18"
                          stroke="#f59e0b"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          d="M0,44 C18,58 36,68 58,70 C82,72 102,60 118,66 S120,68 120,68"
                          stroke="#14b8a6"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <Battery className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      <div className="text-xs text-teal-700/60 dark:text-teal-300/60">
                        Battery
                      </div>
                    </div>
                    <div className="relative flex justify-between items-start z-10">
                      <div className="space-y-2">
                        <div className="flex flex-col justify-start">
                          <span className="text-xs font-semibold tracking-wide text-amber-600/80 dark:text-amber-300/80">
                            Discharge
                          </span>
                          <div className="flex flex-row items-center space-x-1.5">
                            <span className="text-md font-semibold text-amber-700 dark:text-amber-200">
                              4.8
                            </span>
                            <span className="text-xs text-amber-700/70 dark:text-amber-300/70">
                              kWh
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col justify-start">
                          <span className="text-xs font-semibold tracking-wide text-teal-600/80 dark:text-teal-300/80">
                            Charge
                          </span>
                          <div className="flex flex-row items-center space-x-1.5">
                            <span className="text-md font-semibold text-amber-700 dark:text-amber-200">
                              3.4
                            </span>
                            <span className="text-xs text-amber-700/70 dark:text-amber-300/70">
                              kWh
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* SOC Gauge */}
                      <div className="absolute bottom-0 right-0 w-12 h-12 flex-shrink-0">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          <path
                            className="text-teal-200 dark:text-teal-700"
                            strokeDasharray="85, 100"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                          <path
                            className="text-teal-500 dark:text-teal-400"
                            strokeDasharray="85, 100"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                            85%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EV Card */}
                  <div
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-blue-200/30 dark:border-blue-800/30 cursor-pointer hover:scale-105 transition-transform duration-200 relative overflow-hidden"
                    onClick={() => {
                      /* Navigate to EV detail view */
                    }}
                  >
                    {/* Background Sparkline */}
                    <div className="absolute inset-0 opacity-[0.25]">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 120 80"
                        className="text-blue-600"
                      >
                        <path
                          d="M0,58 C18,68 40,50 60,56 C78,60 98,38 118,46 S120,48 120,48"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <div className="flex flex-row items-center">
                        <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <Plus className="w-3 h-3 text-blue-600 dark:text-blue-400 mx-1" />
                        <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-xs text-blue-700/60 dark:text-blue-300/60">
                        Home/EV
                      </div>
                    </div>
                    <div className="relative z-10">
                      {/* Main Metric */}
                      <div className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                        3.1<span className="ms-1 text-base">kWh</span>
                      </div>
                      {/* Context Text */}
                      <div className="text-xs text-blue-700/70 dark:text-blue-300/70">
                        10% less than yesterday
                      </div>
                    </div>
                  </div>

                  {/* Grid Card */}
                  <div
                    className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-2xl p-4 border border-gray-200/30 dark:border-gray-700/30 cursor-pointer hover:scale-105 transition-transform duration-200 relative overflow-hidden"
                    onClick={() => {
                      /* Navigate to grid detail view */
                    }}
                  >
                    {/* Background Sparkline */}
                    <div className="absolute inset-0 opacity-[0.25]">
                      <svg width="100%" height="100%" viewBox="0 0 120 80">
                        <line
                          x1="0"
                          y1="40"
                          x2="120"
                          y2="40"
                          stroke="rgba(148,163,184,0.25)"
                          strokeWidth="0.8"
                          strokeDasharray="4 4"
                        />
                        <path
                          d="M0,38 C18,24 36,36 54,28 C72,22 94,16 112,26 S120,30 120,30"
                          stroke="#3b82f6"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          d="M0,40 C20,56 42,46 60,60 C80,70 102,64 118,72 S120,74 120,74"
                          stroke="#f97316"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <UtilityPoleIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <div className="text-xs text-gray-700/60 dark:text-gray-300/60">
                        Grid
                      </div>
                    </div>
                    <div className="relative z-10">
                      {/* Main Metrics Side by Side */}
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                            5.0<span className="text-sm">kWh</span>
                          </div>
                          <div className="text-[11px] uppercase tracking-wide text-blue-700/70 dark:text-blue-300/70">
                            Import
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                            1.8<span className="text-sm">kWh</span>
                          </div>
                          <div className="text-[11px] uppercase tracking-wide text-orange-600/70 dark:text-orange-400/70">
                            Export
                          </div>
                        </div>
                      </div>
                      {/* Context Text */}
                      <div className="text-xs text-gray-700/70 dark:text-gray-300/70">
                        Net Import: 3.2 kWh today
                      </div>
                    </div>
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
                      colors={lineSeries.map((line) => {
                        // Use gradient URLs for different data types
                        if (line.dataKey === "grid")
                          return "url(#gridGradient2)";
                        if (line.dataKey === "solar")
                          return "url(#solarGradient2)";
                        if (line.dataKey === "battery")
                          return "url(#batteryGradient2)";
                        if (line.dataKey === "ev") return "url(#evGradient2)";
                        if (line.dataKey === "house")
                          return "url(#houseGradient2)";
                        return line.strokeColor;
                      })}
                      series={lineSeries.map((line) => ({
                        data: chartDataMemo.map(
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
                    >
                      {/* Define gradients for second bar chart */}
                      <defs>
                        <linearGradient
                          id="gridGradient2"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#ef4444"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#dc2626"
                            stopOpacity={1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="solarGradient2"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#fbbf24"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#eab308"
                            stopOpacity={1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="batteryGradient2"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#60a5fa"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity={1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="evGradient2"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#a78bfa"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#8b5cf6"
                            stopOpacity={1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="houseGradient2"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor={theme === "dark" ? "#e5e7eb" : "#9ca3af"}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor={theme === "dark" ? "#d1d5db" : "#6b7280"}
                            stopOpacity={1}
                          />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Summary Report Pie  */}
        <div className="space-y-3">
          <h4 className="text-xl text-foreground text-left mb-3">
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
          {/* Advanced Summary Donut Charts */}
          <div className="bg-card rounded-2xl p-4 shadow-lg border border-border/50">
            <div className="flex flex-col gap-3 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  Advanced Energy Distribution
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Premium donut charts synchronized with the{" "}
                  {summaryTimeframeLabel.toLowerCase()} overview.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="block text-[11px] uppercase tracking-wide">
                  Timeframe
                </span>
                <span className="text-card-foreground font-semibold">
                  {summaryTimeframeLabel} Overview
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <ConsumptionSourceBreakdownChart
                theme={theme}
                loadLabel="House"
                timeframeLabel={summaryTimeframeLabel}
                segments={consumptionBreakdown.segments}
                total={consumptionBreakdown.total}
              />
              <BatteryUsageBreakdownChart
                theme={theme}
                timeframeLabel={summaryTimeframeLabel}
                segments={batteryUsageBreakdown.segments}
                total={batteryUsageBreakdown.total}
              />
              <SelfConsumptionRatioChart
                theme={theme}
                timeframeLabel={summaryTimeframeLabel}
                consumedValue={selfConsumptionStats.consumed}
                exportedValue={selfConsumptionStats.exported}
                total={selfConsumptionStats.total}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
