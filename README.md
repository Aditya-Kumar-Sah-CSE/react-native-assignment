# Shift Booking Application (React Native)

A production-ready React Native shift booking mobile application built with **Expo SDK 52**, **TypeScript**, and **TanStack React Query**, backed by a local Node.js/Hapi mock API.

This application strictly implements all requirements from the [Design Specification](./design-spec.pdf) with 100% pixel-faithful design tokens, resilient offline/failover networking, real-time date grouping, and global interval overlap detection.

---

## 📱 Features & Highlights

### 1. **My Shifts View**
- **Grouped by Date**: Displays all booked shifts grouped chronologically into *"Today"*, *"Tomorrow"*, or formatted dates (e.g., *"November 24"*).
- **Header Aggregation**: Real-time section header summary showing shift count and total hours (e.g., `2 shifts, 4 h`).
- **Cancellation Flow**: Allows cancelling booked shifts with animated vector SVG spinner and optimistic cache invalidation.
- **Started Shifts Rule**: If a shift has already started (`currentTime >= startTime`), the cancel button is cleanly disabled to prevent illegal operations.
- **Empty State**: Clear placeholder when no shifts have been booked yet.

### 2. **Available Shifts View**
- **City Filter Tabs**: Filter shifts between cities (`Helsinki`, `Tampere`, `Turku`) with live shift count badges (e.g., `Helsinki (14)`).
- **Date Grouping**: Shifts categorized cleanly under date headers.
- **Booking Flow**: Pill buttons with active states (`Book`, `Cancel`, `Disabled`, and custom rotating SVG spinner).
- **Global Overlap Detection**: Instant feedback on overlapping intervals ($[S_1, E_1) \cap [S_2, E_2) \neq \emptyset$). If a shift overlaps with any booked shift across any city, it dynamically shows the `Overlapping` badge and disables conflicting bookings.
- **Pull-to-Refresh**: Native pull-down gesture on both screens to refetch fresh data from the server.

### 3. **Architectural Engineering Highlights**
- **Multi-Endpoint Networking Fallback**: Intelligently switches between dynamic Metro LAN IP (`10.164.242.247`), Android Emulator loopback (`10.0.2.2`), and `localhost` (adb reverse). Works seamlessly on physical mobile phones, Android Studio emulators, and iOS simulators.
- **Node 24 + Hapi v17 Stream Deadlock Fix**: Resolved Node v24 payload parser hang on parameterless POST routes by configuring raw stream handling on the API server.
- **Dynamic UUID 404 Auto-Recovery**: Since the mock API generates random in-memory UUIDs on startup, client mutations automatically catch 404s and re-sync query cache transparently without user frustration.

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology |
|---|---|
| **Framework** | Expo SDK 52 / React Native 0.88 |
| **Language** | TypeScript (Strict mode) |
| **State Management** | TanStack React Query v5 |
| **Navigation** | React Navigation v7 (Bottom Tabs) |
| **Vector Graphics** | react-native-svg (Animated SVG spinner) |
| **Date Manipulation** | date-fns v4 |
| **Backend API** | Hapi.js v17 on Node.js |

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18+ or v24+)
- npm or yarn
- Expo Go on your physical phone (or Android Studio Emulator)

---

### Step 1: Start the Mock API Server

```bash
# In the root repository directory
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
- **On Physical Phone**: Scan the QR code shown in terminal using the **Expo Go** app (Android) or **Camera** (iOS). *Ensure phone and PC are on the same Wi-Fi/Hotspot network.*
- **On Android Emulator**: Press `a` in the terminal to open the app on the running emulator. (Ensure port reverse: `adb reverse tcp:8080 tcp:8080`).

---

## 📂 Project Structure

```
react-native-assignment/
├── api/                          # Mock Hapi API Server
│   ├── server.js                 # Server entry point (configured with 0.0.0.0 & stream payload)
│   └── shifts-mock-api/          # In-memory mock database & routes
├── app/                          # React Native Mobile App
│   ├── assets/                   # App icons & design assets
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts         # Multi-endpoint host resolution & candidate URLs
│   │   │   └── shiftsApi.ts      # REST methods (getShifts, bookShift, cancelShift)
│   │   ├── components/
│   │   │   ├── ActionButton.tsx  # Pill button (Book, Cancel, Disabled, SVG Spinner)
│   │   │   ├── CityFilterTabs.tsx# Helsinki, Tampere, Turku tab bar with counts
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
│   │       ├── dateUtils.ts      # "Today", "Tomorrow", "2 shifts, 4 h" aggregation
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
3. **Resilient Network Handling**:
   - If Wi-Fi changes or emulator network routing drops, user receives a clean non-intrusive `NetworkBanner` with a one-tap `Retry` button and pull-to-refresh.
4. **Server Reboot State Sync**:
   - Mock API generates dynamic UUIDs in memory. If the backend is rebooted while the app is active, client catches 404s gracefully, displays a sync notification, and triggers automatic query refetch.

---

## 👨‍💻 Author
- **Aditya Kumar Sah** (adityakumarsah8709@gmail.com)
