# FocusLock - Current State (from GitHub)

## 📁 Project Structure

The app is now at the **root level** (not in a `focuslock/` subfolder):

```
/Users/jonathanshan/Dez App/
├── App.tsx                    # Main app with LockOverlay integration
├── app.json                   # Expo config
├── app.plugin.js              # Native permissions config plugin
├── package.json               # Dependencies (includes expo-dev-client)
├── NATIVE_MODULES.md          # Implementation guide for native modules
├── README.md                  # Full MVP+ documentation
│
├── src/
│   ├── components/            # UI components (GlassCard, PrimaryButton, etc.)
│   ├── screens/               # Lock, Stats, Schedule screens
│   ├── navigation/            # Bottom tabs navigation
│   ├── store/
│   │   ├── useAppStore.ts     # Main app state (selections, schedules, stats)
│   │   └── useLockStore.ts    # Lock state with API integration
│   ├── services/
│   │   ├── questionApi.ts     # SAT question API with fallback
│   │   ├── appBlockingService.ts  # Native blocking service layer
│   │   └── screenTimeService.ts   # OS screen time integration
│   ├── native/
│   │   └── index.ts           # Native module interfaces
│   ├── challenges/            # Question bank + generation
│   ├── data/                  # Sample apps data
│   └── theme/                 # Design tokens
```

## ✅ What's Implemented (MVP+)

### 1. **Expo Development Builds** (not Expo Go)
- `expo-dev-client` installed
- Config plugin for native permissions
- Ready for custom native modules

### 2. **API Integration for Soft Lock**
- `src/services/questionApi.ts` - Fetches SAT questions from external API
- Graceful fallback to local question bank
- Loading/error states in `useLockStore.ts`
- Configurable via `EXPO_PUBLIC_QUESTION_API_URL` env variable

### 3. **Native Blocking Foundation**
- **Config Plugin** (`app.plugin.js`):
  - iOS: FamilyControls permissions
  - Android: UsageStats, System Overlay, Foreground Service permissions
- **Service Layer** (`src/services/appBlockingService.ts`):
  - Placeholder functions for iOS/Android blocking
  - Ready for native module implementation
- **Lock Overlay** (`src/components/LockOverlay.tsx`):
  - Renders above navigation when blocked app opens
  - Supports Soft Lock (MCQ challenge) and Hard Lock (no override)

### 4. **Hard Lock Enforcement**
- Back button disabled on Android during Hard Lock
- No escape hatches in UI
- Timer must expire for access

### 5. **OS Screen Time Integration**
- `src/services/screenTimeService.ts` - Interfaces for iOS/Android usage data
- Stats screen pulls from native modules (with fallback)
- Filters by "time wasting" apps

## 🔧 How to Run

### Install Dependencies
```bash
cd "/Users/jonathanshan/Dez App"
npm install
```

### Development (Expo Go - limited features)
```bash
npm start
```

### Build Custom Dev Client (for native modules)
```bash
# iOS
npx expo prebuild --platform ios --clean
npx expo run:ios

# Android
npx expo prebuild --platform android --clean
npx expo run:android
```

## 📋 Next Steps (Native Implementation)

See `NATIVE_MODULES.md` for detailed guide on:

1. **iOS Native Modules**:
   - FamilyControls authorization
   - ManagedSettings for app blocking
   - DeviceActivity for usage monitoring

2. **Android Native Modules**:
   - UsageStats for foreground app detection
   - Background service for monitoring
   - System overlay for lock screen

3. **API Configuration**:
   - Set production SAT question API URL
   - Configure API key/authentication

## 🎯 Key Files to Review

1. **`App.tsx`** - Main entry with LockOverlay integration
2. **`src/store/useLockStore.ts`** - Lock state with API integration
3. **`src/services/questionApi.ts`** - Question fetching with fallback
4. **`src/services/appBlockingService.ts`** - Native blocking interface
5. **`app.plugin.js`** - Permissions configuration
6. **`NATIVE_MODULES.md`** - Implementation guide

## 📊 Current Limitations

- Native modules are **placeholder implementations**
- Requires Swift/Kotlin code for actual blocking
- API uses fallback until production endpoint configured
- Some features require physical devices (not simulators)

## 🔄 Sync Status

Your local workspace is now synced with GitHub at commit:
- **8e6f966** - "fix: android build - patch dev-menu, dev-launcher, manifest"

All the functional MVP scaffolding is in place and ready for native module implementation!
