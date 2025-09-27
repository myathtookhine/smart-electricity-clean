# Project Specs: Advanced Pie/Donut Chart Components

## Objective
To develop a series of single-purpose, premium donut charts designed to provide deep, actionable insights into energy flow. The charts should focus on key metrics that are meaningful and easy to understand at a glance.

## General Implementation & Best Practices
Apply these rules to all components developed in this project:

*   **Component-Based Architecture**: Each chart (A, B, and C) must be developed as a reusable, independent component.
*   **Donut Chart Design**: All charts must be rendered as donut charts, featuring a central space for displaying a key metric as text.
*   **Consistent Styling**: Maintain consistent styling across all components, including typography, spacing, and the use of dark backgrounds.
*   **Interactivity**: Implement a consistent hover/tap interaction for all charts. When a user interacts with a segment, it should highlight, and a tooltip should appear showing both the percentage and the kWh value.
*   **Data Synchronization**: Ensure the data used for these charts is synchronized with the primary dashboard's selected timeframe (e.g., Today, 7d, 30d).
*   **Scalability & Zero Values**: The design must gracefully handle scenarios where a data value is zero. For example, if there is no EV charging, that slice should not be rendered.
*   **Responsiveness**: All components must be designed to be responsive and display correctly on various screen sizes and orientations.
*   **Data Model**: The front-end will consume a JSON data structure that provides the necessary values for each chart's calculations.

---

## Component A: Consumption Source Breakdown

### Functionality & Data

*   **Purpose**: To display the energy sources (Solar, Battery, Grid) that contributed to the total consumption of a single, selected load (e.g., 'House' or 'EV').
*   **Data Source**: The chart is driven by data for a selected load over a given time period.
*   **Total Value Calculation**: The total for the pie chart is the sum of `Solar to Load` + `Battery to Load` + `Grid to Load`.
*   **Central Metric**: The text in the center of the donut chart must display the **Total Consumption (X kWh)** for the selected load.
*   **Segments**: The chart will have three distinct slices:
    1.  **Solar Contribution**: kWh supplied by solar.
    2.  **Battery Contribution**: kWh supplied by the battery.
    3.  **Grid Contribution**: kWh imported from the grid.

### Visual Rendering Rules

*   **Aesthetic**: The chart must have a premium, clean, and minimalist design.
*   **Color Palette**: Use a consistent color palette. Segments for generation (Solar, Battery) should use **warm tones**, while the Grid segment should use a **cool tone** to align with the main dashboard.
*   **Legend**: An external legend is required. It should list each segment with its corresponding color, label, and percentage of the total.

---

## Component B: Battery Usage Breakdown

### Functionality & Data

*   **Purpose**: To provide a clear story of where stored battery energy was sent.
*   **Data Source**: The total value for this chart is the sum of all battery discharge.
*   **Central Metric**: The central text must display the **Total Battery Discharge (X kWh)**.
*   **Segments**: The chart will have slices representing the destinations of the battery energy:
    1.  **To House**: Energy sent to the home.
    2.  **To Grid Export**: Energy exported to the grid.
    3.  **To EV Charging**: Energy used for EV charging.

### Visual Rendering Rules

*   **Aesthetic**: Maintain the same premium, minimalist donut chart style as Component A.
*   **Color Palette**: Segment colors should correspond to their destination. For example, use a **blue/cool tone** for "To House" and a **warm tone** for "To Grid Export".

---

## Component C: Self-Consumption Ratio

### Functionality & Data

*   **Purpose**: To provide a quick measure of how much solar generation the user consumed versus how much they exported. This is a key KPI for solar owners.
*   **Data Source**: The total for this chart is the **Total Solar Generation (X kWh)** for a given period.
*   **Central Metric**: The central text must display the **self-consumption percentage** (e.g., 85%).
*   **Segments**: The chart will have two slices:
    1.  **Consumed Locally**: Solar energy used directly by the house or EV.
    2.  **Exported to Grid**: Solar energy sent to the grid.

### Visual Rendering Rules

*   **Aesthetic**: Maintain the same premium donut chart style.
*   **Color Palette**: Use a single, distinct color for the "Consumed Locally" slice (e.g., green or a vibrant warm tone) to emphasize it as a "goal." Use a contrasting, neutral color for the "Exported to Grid" slice.