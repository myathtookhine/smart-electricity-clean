Generate UI code for a mobile app's Main Menu. The menu should display a list of top-level navigation items. For any top-level item that has nested screens, these nested screens should be displayed as sub-items. Each sub-item (nested screen) must have the text '(Coming soon!)' appended to its name. Ensure the UI is clean, intuitive, and uses standard list or navigation components appropriate for the framework. Do not include any functional implementation details for the screens themselves, only the menu structure and the 'coming soon' message where specified.

Here is a specification for the **Settings** menu page and its direct links, drawing on the provided sources:

## Specification: Settings Menu Page

The **Settings** menu item, accessible from the Main Menu serves as a central hub for users to manage their personal account information and view details about their registered devices. It is designed to empower users with self-service capabilities, reduce support queries, and ensure data security and compliance.

### 1. User Details
This section allows users to securely view and update their personal account information.

*   **Purpose**: To enable users to manage their personal data directly within the app, enhancing self-service and adhering to data protection standards.
*   **Navigation**: Accessed via `Menu > Settings > User Details`.
*   **Default State**: By default, the User Details page is read-only, displaying current information.
*   **Editable Fields**:
    *   **Full Name**
    *   **Email Address**: Changes to this field will trigger an **OTP (One-Time Password) verification** process for security.
    *   **Phone Number** (optional)
    *   **Physical Address** (Postcode, Region)
*   **Edit Mode**: Tapping an "Edit" button (either top-right or bottom) will switch the view to "Edit Mode," making fields editable inputs with inline validation.
*   **Email Change Flow**:
    1.  User updates their email in the Edit Details form.
    2.  A prompt informs the user that a verification code will be sent to their new email.
    3.  After clicking "Save," the new email is temporarily stored, an OTP is sent to the new email, and the user is prompted to enter the OTP code.
    4.  If the code is correct, the new email is committed to the account, and the old email address receives a security notification about the change.
    5.  If the code is incorrect, an inline error message is displayed, allowing for retry.
*   **Security Measures**:
    *   **Password re-entry or biometric verification** (if supported by the device) is required before allowing edits.
    *   All changes, especially email updates, are **logged for audit and support tracking**.
    *   Adherence to GDPR and secure data handling guidelines.
*   **UI/UX Cues**: Clear indicators for required fields, real-time feedback during code entry, and confirmation messages upon successful updates.

### 2. Additional Support
This section provides access to user guides and support resources.

*   **Purpose**: To improve user retention and minimize onboarding-related support issues by offering clear, helpful guidance and access to resources.
*   **Content**: Includes an "App User Guides" tab.
*   **App User Guides**:
    *   When users click on this tab, they should see all available language versions of the user guide.
    *   If the App Wizard pop-up was previously closed, users can still access the guides through this tab.

### 3. Account Settings
This expanded section allows users to view specific details, including serial numbers and model names, for their registered hardware components.

*   **Purpose**: To support better device traceability, user self-service, and support efficiency by providing access to hardware details.
*   **Content**: This section expands to include details for various devices, presented as individual menu items. These sub-sections follow a consistent structure and interaction style:
    *   **Battery Details**:
        *   Displays the device serial number, model name (if available), and optionally firmware version.
        *   Includes a "[Copy]" button next to the serial number for easy retrieval.
        *   Uses a battery icon.
    *   **Diverter Details**:
        *   Displays the device serial number, model name (if available), and optionally firmware version.
        *   Includes a "[Copy]" button next to the serial number.
        *   Uses a diverter icon (custom or stylized resistor/switch symbol).
    *   **Inverter Details**: (Implicitly mentioned as a reference for consistent design in)
        *   This section would display inverter serial number and model information, consistent with the other device detail pages.
    *   **Charger Details**: (Implicitly mentioned as a reference for consistent design in)
        *   This section would display charger serial number and model information, consistent with the other device detail pages.
*   **Availability**:
    *   Device details (serial number, model info) are shown only if the respective device is registered to the account.
    *   If a device is not registered, a "Device not registered" placeholder message is displayed.
    *   The entire section, or specific device details, are only shown to linked system owners or authorized installers.
*   **Interaction**: Tapping the "[Copy]" button next to a serial number copies the raw code to the clipboard.
*   **Logging**: Access attempts to serial numbers are logged for auditing purposes.
*   **Visual Consistency**: The design matches existing sections, using a black background, orange iconography, and white text, maintaining the Dura App's styling.