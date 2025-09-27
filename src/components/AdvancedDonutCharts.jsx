import PropTypes from "prop-types";
import { PieChart } from "@mui/x-charts/PieChart";
import { PieArc } from "@mui/x-charts/PieChart";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_DIMENSIONS = { width: 320, height: 240 };

const formatKwh = (value) => {
  if (Number.isNaN(value) || value === null || value === undefined) {
    return "0";
  }
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: value >= 10 ? 0 : 1,
    maximumFractionDigits: value >= 10 ? 0 : 1,
  });
  return formatter.format(value);
};

const formatPercentage = (value) => {
  if (!Number.isFinite(value)) return "0%";
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: value < 10 ? 1 : 0,
    maximumFractionDigits: value < 10 ? 1 : 0,
  });
  return `${formatter.format(value)}%`;
};

const hexToRgb = (color) => {
  if (typeof color !== "string") {
    return null;
  }
  let hex = color.trim();
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  if (hex.length !== 6) {
    return null;
  }
  const int = Number.parseInt(hex, 16);
  if (Number.isNaN(int)) {
    return null;
  }
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0"))
    .join("")}`;

const blendChannel = (value, target, amount) =>
  Math.round(value + (target - value) * Math.max(0, Math.min(1, amount)));

const createGradientStops = (color, mode = "light") => {
  const baseRgb = hexToRgb(color);
  if (!baseRgb) {
    return {
      startColor: color,
      endColor: color,
    };
  }

  const lightenAmount = mode === "dark" ? 0.18 : 0.28;
  const darkenAmount = mode === "dark" ? 0.32 : 0.24;

  const lighter = {
    r: blendChannel(baseRgb.r, 255, lightenAmount),
    g: blendChannel(baseRgb.g, 255, lightenAmount),
    b: blendChannel(baseRgb.b, 255, lightenAmount),
  };

  const darker = {
    r: blendChannel(baseRgb.r, 0, darkenAmount),
    g: blendChannel(baseRgb.g, 0, darkenAmount),
    b: blendChannel(baseRgb.b, 0, darkenAmount),
  };

  return {
    startColor: rgbToHex(lighter),
    endColor: rgbToHex(darker),
  };
};

const buildGradientConfig = (gradientId, baseColor, mode) => {
  const { startColor, endColor } = createGradientStops(baseColor, mode);
  const hasGradient = startColor !== endColor;

  return {
    id: gradientId,
    baseColor,
    startColor,
    endColor,
    cssGradient: hasGradient
      ? `linear-gradient(135deg, ${startColor}, ${endColor})`
      : startColor,
  };
};

const GradientPieArc = forwardRef(function GradientPieArc(props, ref) {
  const { gradients = {}, dataIndex, color, onSliceClick, ...rest } = props;
  const gradient = gradients[dataIndex];
  const fill = gradient ? `url(#${gradient.id})` : color;
  const { onClick, ...arcProps } = rest;

  const handleClick = (event) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      onSliceClick?.(event, dataIndex);
    }
  };

  return (
    <g>
      {gradient ? (
        <defs>
          <linearGradient id={gradient.id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient.startColor} />
            <stop offset="100%" stopColor={gradient.endColor} />
          </linearGradient>
        </defs>
      ) : null}
      <PieArc
        {...arcProps}
        ref={ref}
        color={fill}
        dataIndex={dataIndex}
        onClick={handleClick}
      />
    </g>
  );
});

const useResponsiveDimensions = (ratio = 0.68, minWidth = 240, maxWidth = 420) => {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState(DEFAULT_DIMENSIONS);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const computeDimensions = (width) => {
      const clampedWidth = Math.min(Math.max(width, minWidth), maxWidth);
      const height = clampedWidth * ratio;
      setDimensions({ width: clampedWidth, height });
    };

    computeDimensions(element.getBoundingClientRect().width || DEFAULT_DIMENSIONS.width);

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const contentWidth = entry.contentRect?.width || DEFAULT_DIMENSIONS.width;
          computeDimensions(contentWidth);
        }
      });
      resizeObserver.observe(element);
      return () => resizeObserver.disconnect();
    }

    return undefined;
  }, [ratio, minWidth, maxWidth]);

  return [ref, dimensions];
};

const AdvancedDonutChart = ({
  id,
  title,
  subtitle,
  totalValue,
  centerPrimary,
  centerSecondary,
  centerTertiary,
  data,
  theme,
  emptyMessage = "No data available for this period.",
  units = "kWh",
  legendColumns = 1,
}) => {
  const [containerRef, { width, height }] = useResponsiveDimensions();
  const [activeSlice, setActiveSlice] = useState(null);
  const filteredData = useMemo(
    () => (Array.isArray(data) ? data.filter((item) => (item?.value ?? 0) > 0) : []),
    [data]
  );

  const total = useMemo(
    () => filteredData.reduce((sum, item) => sum + (item.value ?? 0), 0),
    [filteredData]
  );

  const percentages = useMemo(
    () =>
      filteredData.map((item) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        return Number.isFinite(percentage) ? percentage : 0;
      }),
    [filteredData, total]
  );

  const outerRadius = Math.max(Math.min(width, height) / 2 - 12, 72);
  const innerRadius = outerRadius * 0.62;
  const fadedColor =
    theme === "dark" ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.18)";

  const gradientConfigs = useMemo(
    () =>
      filteredData.map((item, index) =>
        buildGradientConfig(
          `${id}-gradient-${index}`,
          item.legendColor ?? item.color,
          theme
        )
      ),
    [filteredData, id, theme]
  );

  const gradientMap = useMemo(
    () =>
      gradientConfigs.reduce((acc, config, index) => {
        acc[index] = config;
        return acc;
      }, {}),
    [gradientConfigs]
  );

  const handleSliceClick = useCallback(
    (event, dataIndex) => {
      if (!filteredData[dataIndex]) {
        setActiveSlice(null);
        return;
      }

      const slice = filteredData[dataIndex];
      const nativeEvent = event?.nativeEvent ?? {};
      const svg = event?.currentTarget?.ownerSVGElement ?? null;
      let x = width / 2;
      let y = height / 2;

      if (svg && typeof nativeEvent.clientX === "number" && typeof nativeEvent.clientY === "number") {
        const rect = svg.getBoundingClientRect();
        x = nativeEvent.clientX - rect.left;
        y = nativeEvent.clientY - rect.top;
      } else if (typeof nativeEvent.offsetX === "number" && typeof nativeEvent.offsetY === "number") {
        x = nativeEvent.offsetX;
        y = nativeEvent.offsetY;
      }

      setActiveSlice((previous) =>
        previous?.index === dataIndex
          ? null
          : {
              index: dataIndex,
              item: slice,
              percentage: percentages[dataIndex] ?? 0,
              position: { x, y },
            }
      );
    },
    [filteredData, height, percentages, width]
  );

  const tooltipPosition = useMemo(() => {
    if (!activeSlice) {
      return { left: 0, top: 0 };
    }

    const tooltipWidth = 200;
    const tooltipHeight = 120;
    const padding = 16;
    const baseX = activeSlice.position?.x ?? width / 2;
    const baseY = activeSlice.position?.y ?? height / 2;

    const maxLeft = Math.max(width - tooltipWidth, padding);
    const maxTop = Math.max(height - tooltipHeight, padding);

    return {
      left: Math.min(Math.max(baseX + 12, padding), maxLeft),
      top: Math.min(Math.max(baseY - tooltipHeight / 2, padding), maxTop),
    };
  }, [activeSlice, height, width]);

  const dismissSliceTooltip = useCallback(() => {
    setActiveSlice(null);
  }, []);

  useEffect(() => {
    if (!activeSlice) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      const element = containerRef.current;
      if (element && !element.contains(event.target)) {
        setActiveSlice(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveSlice(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSlice, containerRef]);

  useEffect(() => {
    if (!activeSlice) {
      return;
    }

    if (!filteredData[activeSlice.index]) {
      setActiveSlice(null);
    }
  }, [activeSlice, filteredData]);

  return (
    <div
      className="relative flex flex-col bg-background/50 dark:bg-background/40 border border-border/50 rounded-2xl p-4 shadow-sm"
      ref={containerRef}
      id={id}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-card-foreground tracking-wide">
            {title}
          </h4>
          {subtitle ? (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          ) : null}
        </div>
        {totalValue !== undefined ? (
          <div className="text-right">
            <span className="text-xs uppercase text-muted-foreground tracking-wide">
              Total
            </span>
            <div className="text-sm font-semibold text-card-foreground">
              {formatKwh(totalValue)} {units}
            </div>
          </div>
        ) : null}
      </div>

      {filteredData.length === 0 || total <= 0 ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <p className="text-sm text-muted-foreground text-center max-w-[200px]">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <>
          <div className="relative flex items-center justify-center">
            <PieChart
              width={width}
              height={height}
              margin={{ top: 12, bottom: 12, left: 12, right: 12 }}
              series={[
                {
                  data: filteredData.map((item, index) => ({
                    id: item.id ?? index,
                    label: item.label,
                    value: Number(item.value ?? 0),
                    color: gradientConfigs[index]?.startColor ?? item.color,
                  })),
                  innerRadius,
                  outerRadius,
                  paddingAngle: 0,
                  cornerRadius: 0,
                  startAngle: 90,
                  endAngle: 450,
                  highlightScope: { faded: "global", highlighted: "item" },
                  valueFormatter: ({ value, dataIndex }) => {
                    const pct = percentages[dataIndex] ?? 0;
                    return `${formatKwh(value)} ${units} (${formatPercentage(
                      pct
                    )})`;
                  },
                },
              ]}
              slots={{ pieArc: GradientPieArc }}
              slotProps={{
                legend: { hidden: true },
                pieArc: { gradients: gradientMap, onSliceClick: handleSliceClick },
              }}
              sx={{
                "& .MuiChartsTooltip-root": {
                  backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                  color: theme === "dark" ? "#f9fafb" : "#111827",
                  borderRadius: 3,
                //   border: `1px solid ${
                //     theme === "dark" ? "#374151" : "#e5e7eb"
                //   }`,
                  boxShadow:
                    theme === "dark"
                      ? "0 12px 24px -12px rgba(148, 163, 184, 0.35)"
                      : "0 12px 24px -12px rgba(15, 23, 42, 0.15)",
                },
                "& .MuiChartsLegend-root": {
                  display: "none",
                },
              }}
            />

            {activeSlice ? (
              <div
                className="absolute z-20 pointer-events-none"
                style={{ left: tooltipPosition.left, top: tooltipPosition.top }}
              >
                <div className="relative min-w-[180px] max-w-[220px] rounded-xl border border-border/60 bg-background/95 dark:bg-slate-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm pointer-events-auto">
                  <button
                    type="button"
                    aria-label="Close slice details"
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted/70 text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-muted"
                    onClick={(event) => {
                      event.stopPropagation();
                      dismissSliceTooltip();
                    }}
                  >
                    ×
                  </button>
                  <div className="flex items-center gap-2 pb-2">
                    <span
                      className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{
                        background:
                          gradientConfigs[activeSlice.index]?.cssGradient ??
                          activeSlice.item.legendColor ??
                          activeSlice.item.color,
                      }}
                    />
                    <span className="text-[11px] font-semibold text-card-foreground">
                      {activeSlice.item.label}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] leading-relaxed">
                    <div>
                      <span className="text-muted-foreground">Value:</span>{" "}
                      <span className="font-semibold text-card-foreground">
                        {formatKwh(activeSlice.item.value)} {units}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Share:</span>{" "}
                      <span className="font-semibold text-card-foreground">
                        {formatPercentage(activeSlice.percentage)}
                      </span>
                    </div>
                    {activeSlice.item.legendSubLabel ? (
                      <div className="text-muted-foreground/80">
                        {activeSlice.item.legendSubLabel}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center px-3 py-2 rounded-xl bg-background/80 dark:bg-background/70 border border-border/40 shadow-inner">
                {centerPrimary ? (
                  <div className="text-lg font-semibold text-card-foreground">
                    {centerPrimary}
                  </div>
                ) : null}
                {centerSecondary ? (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {centerSecondary}
                  </div>
                ) : null}
                {centerTertiary ? (
                  <div className="text-[11px] text-muted-foreground/80 mt-0.5">
                    {centerTertiary}
                  </div>
                ) : null}
              </div>
            </div> */}
          </div>

          <div
            className={`mt-5 grid gap-3 ${
              legendColumns === 2 ? "grid-cols-1" : "grid-cols-1"
            }`}
          >
            {filteredData.map((item, index) => (
              <div
                key={item.id ?? index}
                className="flex items-center justify-between rounded-xl border border-border/40 px-3 py-2 bg-background/60"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      background:
                        gradientConfigs[index]?.cssGradient ??
                        item.legendColor ??
                        item.color,
                    }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-card-foreground truncate">
                      {item.label}
                    </span>
                    {item.legendSubLabel ? (
                      <span className="text-[11px] text-muted-foreground truncate">
                        {item.legendSubLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-card-foreground">
                    {formatKwh(item.value)} {units}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatPercentage(percentages[index] ?? 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

AdvancedDonutChart.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  totalValue: PropTypes.number,
  centerPrimary: PropTypes.string,
  centerSecondary: PropTypes.string,
  centerTertiary: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      legendColor: PropTypes.string,
      legendSubLabel: PropTypes.string,
    })
  ).isRequired,
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
  emptyMessage: PropTypes.string,
  units: PropTypes.string,
  legendColumns: PropTypes.number,
};

export const ConsumptionSourceBreakdownChart = ({
  theme,
  loadLabel,
  timeframeLabel,
  segments,
  total,
}) => (
  <AdvancedDonutChart
    id="consumption-source-breakdown"
    title={`Consumption Source — ${loadLabel}`}
    subtitle={`${timeframeLabel} load profile`}
    totalValue={total}
    centerPrimary={`${formatKwh(total)} kWh`}
    centerSecondary="Total Consumption"
    centerTertiary={`for ${loadLabel}`}
    data={segments}
    theme={theme}
    units="kWh"
    legendColumns={2}
    emptyMessage="No consumption recorded for this load during the selected period."
  />
);

ConsumptionSourceBreakdownChart.propTypes = {
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
  loadLabel: PropTypes.string.isRequired,
  timeframeLabel: PropTypes.string.isRequired,
  segments: AdvancedDonutChart.propTypes.data,
  total: PropTypes.number.isRequired,
};

export const BatteryUsageBreakdownChart = ({
  theme,
  timeframeLabel,
  segments,
  total,
}) => (
  <AdvancedDonutChart
    id="battery-usage-breakdown"
    title="Battery Usage Breakdown"
    subtitle={`${timeframeLabel} discharge destinations`}
    totalValue={total}
    centerPrimary={`${formatKwh(total)} kWh`}
    centerSecondary="Battery Discharge"
    data={segments}
    theme={theme}
    units="kWh"
    legendColumns={2}
    emptyMessage="No battery discharge recorded for this timeframe."
  />
);

BatteryUsageBreakdownChart.propTypes = {
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
  timeframeLabel: PropTypes.string.isRequired,
  segments: AdvancedDonutChart.propTypes.data,
  total: PropTypes.number.isRequired,
};

export const SelfConsumptionRatioChart = ({
  theme,
  timeframeLabel,
  consumedValue,
  exportedValue,
  total,
}) => {
  const ratio = total > 0 ? Math.round((consumedValue / total) * 100) : 0;
  const data = useMemo(() => {
    if (total <= 0) return [];
    return [
      {
        id: "consumed",
        label: "Consumed Locally",
        value: consumedValue,
        color: theme === "dark" ? "#22c55e" : "#16a34a",
        legendColor: theme === "dark" ? "#22c55e" : "#16a34a",
      },
      {
        id: "exported",
        label: "Exported to Grid",
        value: exportedValue,
        color: theme === "dark" ? "#64748b" : "#94a3b8",
        legendColor: theme === "dark" ? "#64748b" : "#94a3b8",
      },
    ].filter((item) => item.value > 0);
  }, [consumedValue, exportedValue, theme, total]);

  return (
    <AdvancedDonutChart
      id="self-consumption-ratio"
      title="Self-Consumption Ratio"
      subtitle={`${timeframeLabel} solar generation`}
      totalValue={total}
      centerPrimary={`${ratio}%`}
      centerSecondary="Self Consumption"
      centerTertiary={`${formatKwh(total)} kWh generated`}
      data={data}
      theme={theme}
      units="kWh"
      emptyMessage="No solar generation recorded for this timeframe."
    />
  );
};

SelfConsumptionRatioChart.propTypes = {
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
  timeframeLabel: PropTypes.string.isRequired,
  consumedValue: PropTypes.number.isRequired,
  exportedValue: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};
