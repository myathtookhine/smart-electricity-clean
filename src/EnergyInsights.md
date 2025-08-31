The **Energy Insights page** is a redesigned and renamed version of the existing "Energy Summary" page, intended to provide a more modern and intuitive visualization of energy data. It focuses on simplifying energy insights, enhancing usability, and offering a cleaner user interface.

Here's a detailed breakdown of what will be included in the Energy Insights page:

### Chart to use
Check the link here https://mui.com/x/react-charts/lines/ and use properly for the Energy insight page.

### Page Renaming and Purpose
*   **Renamed Page** The page title will change from "Energy Summary" to **"Energy Insights"**.
*   **Purpose** Its main purpose is to simplify and modernize the energy insights visualization by combining grid import and export into a single graph line, introducing interactive filter icons, and ensuring better usability and clarity for homeowners on mobile.

### Main Graph Overhaul (1-Day View)
The primary focus of the Energy Insights page is the redesigned 1-day graph, which includes several key enhancements:

1.  **Dual-Directional Grid Line**:
    *   A **single red line** will represent both grid import and export.
    *   The **Y-axis** will be dual-directional: **positive values** will indicate **Grid Import**, and **negative values** will indicate **Grid Export**.
    *   Tooltips for this line will dynamically display the value (e.g., +1.2 kW or –0.6 kW), direction ("Import" or "Export"), and a timestamp.

2.  **Negative Y-Axis Support**:
    *   The graph will now support values below zero, allowing for a comprehensive view of energy flow.
    *   Y-axis labels will reflect this, showing values like –3, –2, –1, 0, +1, +2, +3, with dynamic scaling as needed.

3.  **Interactive Filter Icons**:
    *   Static data cards found in the previous version will be **replaced by interactive filter icons**.
    *   These icons represent **Grid (red), Solar Generation (yellow), Battery (blue), and EV Charger (green)**.
    *   Each icon functions as a **multi-select toggle**; tapping an icon will toggle the visibility of its corresponding line on the graph.
    *   Selected icons appear in full colour, while unselected ones are dimmed.
    *   Multi-selection is supported, and if no icons are selected, the graph will appear empty.
    *   By default, on the first load or after an update, **all icons will be selected, and all lines will be visible**.
    *   Tooltips will dynamically reflect only the data lines corresponding to the currently selected icons.

4.  **House Load Line**:
    *   A **single white line** will represent Household Consumption.
    *   It uses the same house icon as a filter toggle.
    *   Its tooltip will display the value (e.g., 1.2 kW) and timestamp.

5.  **Battery Line**:
    *   A **single blue line** will show both battery charging and discharging.
    *   On the Y-axis, **positive values** will represent **Battery Discharging**, and **negative values** will represent **Battery Charging**.
    *   Its tooltip will display the value (e.g., +1.2 kW or –0.6 kW), direction ("Discharge" or "Charge"), and timestamp.

### 7 Days, 30 Days & 1 Year Pie Chart Views
For these longer-term views, the **data cards will remain** and will not be replaced by icons. However, they will be updated with new data points and APIs for more accurate summaries:
*   **Grid Data Card:** Will show the total energy imported from the grid, including only positive grid readings.
*   **Solar Data Card:** Will change from "Solar Generation" to **"Solar Consumption"**, leveraging a new API from Vishnu.
*   **Battery Data Card:** Will be updated to show **"Total Battery Discharge to House Load"** instead of total battery power, also using a new API from Vishnu.
*   **EV Data Card:** Will utilize existing or updated EV tracking endpoints.
The pie chart figure logic will remain the same, showing a combined value of these data cards.

### User Interface and Experience
*   The page will feature a **clean, minimal dark-mode layout**.
*   It will present **one graph with fewer distractions**.
*   The bottom section will house the four filter icons.
*   The overall design will be consistent with Dura App styling, including fonts, colours, and button styles.

### System Logic
*   Backend data will be tagged for Grid (import or export), Solar (generation), Battery (charge/discharge), and EV (consumption).
*   The frontend will plot data based on user selections, with the red grid line accurately representing import (+Y) and export (–Y).
*   Tooltips will be dynamic, displaying information only for active lines.
*   The graph will refresh instantly when toggle changes are made.
*   First-time users will see all lines displayed by default.

Overall, the **Energy Insights page** aims to provide a more comprehensive, interactive, and visually clear understanding of energy flow within the Dura App.