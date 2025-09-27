Of course. Here are the specifications and tasks for the web UI development, extracted and formatted as a markdown file.

***

# Web UI Development Specifications: Energy Dashboard Redesign

This document outlines the specifications and tasks for the development of a new, premium energy data visualization dashboard. The primary goal is to replace the current bar-style chart with a Stacked Area Chart and Minimalist Card Tiles, ensuring correct handling of bi-directional energy flows.

## 1. Stacked Area Chart

### 1.1. Functionality & Data Handling

-   **[Task]** Implement a Stacked Area Chart for a high-level overview of energy flows.
-   **[Spec]** **Timeframe Toggles**:
    -   Must include horizontal toggles for "Today", "7d", "30d", and "1y".
    -   Switching between timeframes should trigger efficient data updates for both the chart and the card tiles.
-   **[Spec]** **Data Aggregation**:
    -   **Today/7d**: The chart should render raw or 5–15 minute granularity data.
    -   **30d/1y**: The chart must handle data downsampled by the backend to hourly or daily averages.
    -   The UI must smoothly handle up to 30 days of data (approx. 3,000 data points).

### 1.2. Visual Rendering Rules (Bi-directional Flows)

-   **[Task]** Implement strict rendering rules to visually distinguish between energy generation and consumption. This is a key acceptance criterion.
-   **[Spec]** **Generation (Inflow)**:
    -   Associated with **warm tones**.
    -   **Solar**: Always plotted as a positive value above the baseline.
    -   **Battery Discharge**: Plotted as a positive value above the baseline.
    -   **Grid Export**: Uniquely plotted as a **negative value below the baseline**.
-   **[Spec]** **Consumption (Outflow)**:
    -   Associated with **cool tones**.
    -   **House load**: Plotted as a positive value above the baseline.
    -   **EV charging**: Plotted as a positive value above the baseline.
    -   **Grid Import**: Plotted as a positive value above the baseline.
    -   **Battery Charge**: Plotted as a **negative value below the baseline**.

### 1.3. Interactivity

-   **[Task]** Implement interactive elements for the chart and legend.
-   **[Spec]** **Pill-Style Legend**:
    -   Use clickable, pill-shaped buttons with icons for Solar, Battery, Grid, House, and EV.
    -   Ensure icons and labels are used together so information is not conveyed by color alone.
-   **[Spec]** **Hover/Tap Highlight**:
    -   When a user hovers over or taps a series in the chart, that area should saturate to 100% opacity.
    -   All other series should fade to 30% opacity.
-   **[Spec]** **Tooltip**:
    -   On hover/tap, a tooltip must display the exact kWh values for all series at that specific timestamp.
    -   The tooltip should also show the percentage of the total for each series.

### 1.4. Aesthetics

-   **[Task]** Style the chart to meet the premium and modern design requirements.
-   **[Spec]** Use subtle vertical gradients on chart areas (lighter at the top, darker at the base).
-   **[Spec]** Use minimal gridlines, showing only the x and y axes.
-   **[Spec]** Use a clean, modern sans-serif font for all text.

## 2. Minimalist Card Tiles

### 2.1. Layout & Content

-   **[Task]** Create a fixed 2x2 grid of minimalist card tiles located below the Stacked Area Chart.
-   **[Task]** The grid will contain four cards: Solar, Battery, Grid, and a combined House/EV card.
-   **[Spec]** **Standard Card Content**:
    -   **Main Metric**: A large, bold number (e.g., `8.6 kWh`).
    -   **Micrograph**: A subtle, low-opacity sparkline graph in the background.
    -   **Context Text**: A secondary line of text providing an insight (e.g., "15% less than yesterday").
-   **[Spec]** **Interaction**: Tapping on any card must navigate the user to a source-specific detail view, which should consist of a filtered chart and timeframe toggles.

### 2.2. Special Card Implementations

-   **[Task]** Implement specific functionality for the Grid and Battery cards to handle their bi-directional nature.
-   **[Spec]** **Grid Card**:
    -   Display **Import (blue)** and **Export (orange)** metrics side-by-side.
    -   Implement a dual-color sparkline: Import values are plotted above the baseline, and Export values are plotted below.
    -   The secondary context line must show the net value (e.g., "Net Import: 3.2 kWh today").
-   **[Spec]** **Battery Card**:
    -   Display **Discharge (amber)** and **Charge (teal)** metrics.
    -   Include a **Radial SOC (State of Charge) gauge** (0–100%) in a corner of the card.
    -   Implement a dual-color sparkline to show the charge/discharge trend.

## 3. Performance & Error Handling

-   **[Task]** Ensure the dashboard is performant and handles data issues gracefully.
-   **[Spec]** **Real-Time Updates**: Data should refresh every 5–15 seconds when in a live mode.
-   **[Spec]** **Animations**: All UI transitions (timeframe switches, hovers, fades) must be smooth and complete in under 300ms.
-   **[Spec]** **Error Handling**:
    -   Implement a fallback UI for missing data, displaying a placeholder with the message: “No data available for this period”.
    -   When data is missing for a specific card, it should display `-- kWh` and its sparkline should be grayed-out.

## 4. Accessibility & Responsiveness

-   **[Task]** Ensure the UI is accessible and responsive across devices.
-   **[Spec]** All text and icons must meet minimum contrast ratios.
-   **[Spec]** Do not rely on color alone to convey information; all chart areas must have corresponding icons and labels in the legend.
-   **[Spec]** Ensure all touch targets (pills, cards) are large enough to meet mobile guidelines.
-   **[Spec]** The UI must be responsive across different screen sizes, for both portrait and landscape orientations.