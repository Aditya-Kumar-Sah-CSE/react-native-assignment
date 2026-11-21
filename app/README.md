# Shift Booking Application (React Native)

A production-grade mobile shift booking application built with **React Native (Expo SDK 52) + TypeScript**, connected to the provided Node.js mock API. Designed and implemented according to the [Wolt design specification](../react-native-assignment/design-spec.pdf).

---

## 🚀 Quick Start Guide

### 1. Start the Mock API Server
Open a terminal in the assignment backend directory and start the Hapi.js mock server:
```bash
cd D:\Assignment\react-native-assignment
npm install
npm start
```
The mock API will listen on `http://127.0.0.1:8080/shifts`.

### 2. Start the React Native App
In a second terminal, start the Expo development server:
```bash
cd D:\Assignment\ShiftBookingApp
npm run android
```
The Metro bundler will start and automatically launch the app inside the active Android emulator.

> **Note for Android Emulator**: Android emulators route loopback traffic through `http://10.0.2.2:8080`. The app automatically detects the platform and configures the base URL accordingly (`src/api/client.ts`).
> If testing on a physical Android device over USB, run:
> ```bash
> adb reverse tcp:8080 tcp:8080
> ```

---

## 📱 Features & Views Implemented

### 1. My Shifts Screen
* **Booked Shifts List**: Displays all shifts currently booked by the user (`booked === true`).
* **Date Grouping**: Shifts are grouped into chronological sections (`Today`, `Tomorrow`, `September 22`).
* **Header Summary**: Aggregates shift count and total accumulated hours for that day (`Today  2 shifts, 4 h`).
* **Cancellation**: Shifts can be cancelled with immediate feedback.
* **Started Shift Protection**: The "Cancel" button is visually disabled (`#CBD2E1`) and unclickable if the shift has already started (`Date.now() > startTime`), as specified in the design spec.

### 2. Available Shifts Screen
* **City Filter Tabs**: Horizontal tabs for `Helsinki`, `Tampere`, and `Turku` with dynamic badges showing total shifts available per city (`Helsinki (5)`).
* **Date Grouping**: Shifts for the selected city are grouped chronologically.
* **Status Badges**:
  * `"Booked"` (#4F6C92) for shifts already booked by the user.
  * `"Overlapping"` (#E2006A) for shifts that overlap with any currently booked shift.
* **Smart Actions**:
  * **Book**: Green pill button for available, non-overlapping shifts.
  * **Cancel**: Red pill button for booked shifts.
  * **Disabled**: Grey pill button for overlapping or already-started shifts.
* **Animated SVG Spinner**: Clicking Book or Cancel displays the official spinning vector artwork inside the button pill (replicated from `assets/spinner_green.svg` & `spinner_red.svg`).

### 3. Edge Cases & Resilience
* **Cross-Area Overlap Math**: Interval intersection algorithm:
  $$\text{A.startTime} < \text{B.endTime} \quad \land \quad \text{A.endTime} > \text{B.startTime}$$
  Evaluated globally across all cities to prevent a user from being booked in two places at the same time.
* **404 Auto-Recovery**: If the backend server restarts (which regenerates random UUIDs in memory), the app detects the 404 response, alerts the user, and automatically re-syncs the shift list.
* **Pull-to-Refresh**: Available on both screens using native `RefreshControl`.
* **Offline Network Banner**: Displays a persistent retry banner if the mock API server is unreachable.

---

## 🏗️ Architecture & Technology Choices

```
ShiftBookingApp/
├── src/
│   ├── api/
│   │   ├── client.ts              # Platform-aware BaseURL resolver (10.0.2.2 vs localhost)
│   │   └── shiftsApi.ts           # Typed API service (getShifts, bookShift, cancelShift)
│   ├── components/
│   │   ├── ActionButton.tsx       # Pill button: Book, Cancel, Disabled, SVG Spinner
│   │   ├── CityFilterTabs.tsx     # Helsinki (5) | Tampere (8) | Turku (5)
│   │   ├── DateSectionHeader.tsx  # Sticky header with count and hours summary
│   │   ├── ShiftCard.tsx          # 3-column row (Time, Status badge, Action button)
│   │   ├── Spinner.tsx            # Continuous SVG vector rotation
│   │   └── NetworkBanner.tsx      # Top offline error bar with retry button
│   ├── constants/
│   │   └── colors.ts              # Exact 12-color hex palette from design spec
│   ├── navigation/
│   │   └── AppNavigator.tsx       # React Navigation bottom tabs
│   ├── screens/
│   │   ├── MyShiftsScreen.tsx     # Booked shifts view with hour summaries
│   │   └── AvailableShiftsScreen.tsx # City filtered shifts view with overlap statuses
│   ├── types/
│   │   └── shift.ts               # Shift & section TypeScript interfaces
│   └── utils/
│       ├── dateUtils.ts           # Date formatting & duration calculations
│       └── overlapUtils.ts        # Pure interval overlap detection
```

### Why TanStack Query (React Query) over Redux?
* **Server State vs Client State**: Shifts are inherently remote, asynchronous server state. TanStack Query provides automated background caching, refetching, and window focus re-synchronization without boilerplate actions or reducers.
* **Per-Item Loading**: `useMutation` tracking enables item-level spinners without complex reducer flags.
* **Optimistic Updates**: Immediate UI feedback with automatic rollback on network failure.

---

## 🎨 Color Palette Reference (Page 3 of Design Spec)
* **Primary Brand Blue**: `#004FB4`
* **Dark Content Text**: `#4F6C92`
* **Muted Text / Subtitles**: `#A4B8D3`
* **Borders & Dividers**: `#CBD2E1`
* **Section Header Background**: `#F1F4F8`
* **Main Screen Background**: `#F7F8FB`
* **Primary Danger / Cancel**: `#E2006A`
* **Medium Pink**: `#FE93B3`
* **Light Pink Tint**: `#EED2DF`
* **Primary Success / Book**: `#16A64D`
* **Medium Green**: `#55CB82`
* **Light Green Tint**: `#CAEFD8`

