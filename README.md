# Shift Booking Application (React Native)

A production-ready React Native shift booking mobile application built with **Expo SDK 58** (React Native 0.88), **TypeScript**, and **TanStack React Query v5**, backed by a local Node.js/Hapi mock API.

This application strictly implements all requirements from the [Design Specification](./design-spec.pdf) with 100% pixel-faithful design tokens, zero-config dynamic multi-endpoint networking, timezone-aware date grouping, and global interval overlap collision detection.

---

## 📱 Features & Highlights

### 1. **My Shifts View**
- **Grouped by Date**: Displays all booked shifts grouped chronologically into *"Today"*, *"Tomorrow"*, or formatted dates (e.g., *"November 24"*).
- **Header Aggregation**: Real-time section header summary showing shift count and total hours (e.g., `2 shifts, 4 h`).
- **Cancellation Flow**: Allows cancelling booked shifts with an animated vector SVG spinner and optimistic cache invalidation.
- **Started Shifts Protection**: If a shift has already started (`currentTime >= startTime`), the action button is automatically disabled to prevent illegal operations.
- **Empty State**: Clear placeholder when no shifts have been booked yet.

### 2. **Available Shifts View**
- **City Filter Tabs**: Filter shifts between cities (`Helsinki`, `Tampere`, `Turku`) with live shift count badges (e.g., `Helsinki (14)`).
- **Date Grouping**: Shifts categorized cleanly under date headers.
- **Booking Flow**: Pill buttons with active states (`Book`, `Cancel`, `Disabled`, and custom rotating SVG spinner).
- **Global Overlap Detection**: Instant feedback on overlapping intervals ($[S_1, E_1) \cap [S_2, E_2) \neq \emptyset$). If a shift overlaps with any booked shift across any city, it dynamically shows the `Overlapping` badge and disables conflicting bookings.
- **Pull-to-Refresh**: Native pull-down gesture on both screens to refetch fresh data from the server.

### 3. **Architectural Engineering Highlights**
- **Zero-Config Dynamic Networking**: No hardcoded IP addresses. Automatically extracts the Metro bundler's LAN host IP via `NativeModules.SourceCode.scriptURL` on any Wi-Fi, hotspot, or office network. Seamlessly supports physical mobile phones, Android Studio emulators (`10.0.2.2`), and iOS/web (`localhost`).
- **Timezone Resilience**: Shifts located in Finland (`Helsinki`, `Tampere`, `Turku`) are formatted using `Intl.DateTimeFormat` with ISO date boundary alignment (`en-CA` calendar keys) to prevent date-boundary spillover regardless of developer location.
- **Node 24 + Hapi v17 Stream Deadlock Fix**: Resolved Node v24 payload parser hang on parameterless POST routes by configuring raw stream handling on the API server.
- **Dynamic UUID 404 Auto-Recovery**: Since the mock API generates random in-memory UUIDs on startup, client mutations automatically catch 404s and re-sync query cache transparently.

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Expo SDK | **~58.0.26** |
| **Runtime** | React Native | **0.88.1** |
| **Core Library** | React | **19.3.0** |
| **Language** | TypeScript (Strict mode) | **~5.9** |
| **State Management** | TanStack React Query | **^5.108.2** |
| **Navigation** | React Navigation (Bottom Tabs) | **^7.22.0** |
| **Vector Graphics** | react-native-svg (Animated vector loader) | **15.16.0** |
| **Date Manipulation** | date-fns & native Intl | **^4.4.0** |
| **Backend API** | Hapi.js v17 on Node.js | **v17.5.3** |

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18+ or v24+)
- npm or yarn
- Expo Go on your physical phone (or Android Studio Emulator)

---

### Step 1: Start the Mock API Server

```bash
# In the repository root directory
npm install
npm start
```
The mock server will listen at `http://0.0.0.0:8080/shifts`.

---

### Step 2: Start the React Native App

Open a new terminal window:

```bash
cd app
npm install
npx expo start
```

### Running on Devices:
- **On Physical Phone (Zero-Config)**: Scan the QR code in the terminal using **Expo Go** (Android) or **Camera** (iOS). The app automatically detects your computer's IP address over the shared Wi-Fi/Hotspot!
- **On Android Emulator**: Press `a` in the terminal to launch the app on the running emulator. Run `adb reverse tcp:8080 tcp:8080` to tunnel the mock API.
- **Custom IP (Optional)**: If you are behind a strict corporate proxy, you can optionally set `EXPO_PUBLIC_API_URL=http://<YOUR_IP>:8080` in a `.env` file.

---

## 📂 Project Structure

```
react-native-assignment/
├── api/                          # Mock Hapi API Server
│   ├── server.js                 # Server entry point (configured with 0.0.0.0 & stream payload)
│   └── shifts-mock-api/          # In-memory mock database & routes
├── app/                          # React Native Mobile App (Expo SDK 58)
│   ├── assets/                   # App icons & design assets
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts         # Dynamic zero-config host discovery & candidate URLs
│   │   │   └── shiftsApi.ts      # REST methods with multi-endpoint failover
│   │   ├── components/
│   │   │   ├── ActionButton.tsx  # Pill button (Book, Cancel, Disabled, SVG Spinner)
│   │   │   ├── CityFilterTabs.tsx# Helsinki, Tampere, Turku tab bar with live counts
│   │   │   ├── DateSectionHeader.tsx # Date header with count & duration aggregation
│   │   │   ├── NetworkBanner.tsx # Offline & connection retry banner
│   │   │   ├── ShiftCard.tsx     # 3-column shift row with badges & time formats
│   │   │   └── Spinner.tsx       # Exact vector SVG rotating loader
│   │   ├── constants/
│   │   │   └── colors.ts         # Design spec color constants
│   │   ├── navigation/
│   │   │   └── AppNavigator.tsx  # Bottom tab navigation setup
│   │   ├── screens/
│   │   │   ├── AvailableShiftsScreen.tsx # Available shifts with city tabs & overlap check
│   │   │   └── MyShiftsScreen.tsx        # Booked shifts view with started disable check
│   │   ├── types/
│   │   │   └── shift.ts          # Shift data models
│   │   └── utils/
│   │       ├── dateUtils.ts      # Timezone-resilient date grouping & hour aggregation
│   │       └── overlapUtils.ts   # Interval collision math algorithm
│   ├── App.tsx                   # QueryClientProvider & NavigationContainer
│   ├── app.json                  # Expo application configuration
│   └── package.json
└── README.md
```

---

## 📐 Design Spec Color Matrix

| Color Token | Hex Code | Usage |
|---|---|---|
| `primaryBlue` | `#004FB4` | Active tab text & underline |
| `primaryBlueDisabled` | `#CBD2E1` | Inactive tab text |
| `textDark` | `#4F6C92` | Shift times, section header titles |
| `textSubtle` | `#A4B8D3` | Shift location, aggregate time count |
| `successGreen` | `#16A64D` | Book button border & text, Book spinner |
| `successGreenDisabled` | `#55CB82` | Disabled book button border |
| `dangerRed` | `#E2006A` | Cancel button border & text, Cancel spinner |
| `dangerRedDisabled` | `#FE93B3` | Disabled cancel button border |
| `overlappingRed` | `#E2006A` | "Overlapping" status badge text |
| `backgroundLight` | `#F1F4F8` | Section header background |
| `borderLight` | `#E4EBF4` | Card separator lines |
| `white` | `#FFFFFF` | Background, button inner fill |

---

## 🧪 Edge Cases Handled

1. **Shift Overlaps Across Cities**:
   - The user cannot book shifts that overlap in time even if they take place in different cities.
   - Handled with global interval collision detection: `shift1.start < shift2.end && shift1.end > shift2.start`.
2. **Started Shifts**:
   - Shifts that have already started cannot be booked or cancelled (`currentTime >= startTime`). Action buttons automatically render in disabled state.
3. **Resilient Dynamic Network Handling**:
   - Zero hardcoded IP addresses. Works out of the box on physical devices, emulators, and local development tunnels.
4. **Timezone & Calendar Alignment**:
   - Shift times and calendar grouping are aligned using native `Intl` engines with ISO date keys (`YYYY-MM-DD`), preventing midnight shift bleeding.
5. **Server Reboot State Sync**:
   - Mock API generates dynamic UUIDs in memory. If the backend is rebooted while the app is active, client catches 404s gracefully, displays a sync notification, and triggers automatic query refetch.

---

## 👨‍💻 Author
- **Aditya Kumar Sah** (adityakumarsah8709@gmail.com)
