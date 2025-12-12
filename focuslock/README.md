# FocusLock (MVP)

Dark, glassy phone-usage control app (UI + flows) built with Expo React Native.

## What’s implemented (v1 UI/MVP)
- **Bottom tabs**: Lock (🔒), Stats (📊), Daily Schedule (📅)
- **Lock screen**:
  - Category selection (Social/Games/Other) + per-app selection
  - Duration wheel (Days/Hours/Minutes) with persistence
  - Soft/Hard lock toggle
  - 3-second “commit” countdown before lock activates
  - **Soft Lock challenge preview** (SAT/ACT-style multiple choice questions)
  - **Hard Lock**: no override (in-app UI behavior)
- **Schedule screen**:
  - Create recurring schedules (time range + weekdays) using selected apps
  - Favorite schedules
- **Stats screen**:
  - Time-range pills (Today/Week/Month/Custom)
  - Bar chart + Top Apps list with quick-lock shortcut
- **Persistence**: Zustand + AsyncStorage

## What’s NOT in MVP (requires native OS permissions)
True app blocking (intercepting launches and preventing app access) needs:
- **iOS**: Screen Time / FamilyControls (ManagedSettings)
- **Android**: UsageStats + Accessibility Service (or Device Admin / owner modes)

This repo is structured so a native “Blocking Engine” can be added next without changing the UI.

## Run locally

```bash
cd focuslock
npm install
npm run ios
```

You can also run:

```bash
npm run android
npm run web
```


