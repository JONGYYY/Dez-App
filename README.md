# FocusLock MVP+

Dark, glassy phone-usage control app built with Expo React Native (Expo SDK 54). **Now with native blocking engine foundation and API integration!**

## 🚀 What's New (MVP+ Update)

### Core Implementation ✅
- **Expo Development Builds**: Migrated from Expo Go to custom development builds for native modules
- **API Integration**: SAT-level questions fetched from external API with local fallback
- **Native Blocking Engine**: Config plugins and service layer for iOS (FamilyControls) and Android (UsageStats/Overlay)
- **OS Screen Time Integration**: Stats screen pulls raw screen time data from OS APIs
- **Hard Lock Enforcement**: Back button disabled on Android during Hard Lock sessions

### Soft Lock MCQ Logic ✅
- **API-Fetched Questions**: SAT-level questions fetched via `fetchSATQuestions()` API
- **Loading/Error States**: Graceful handling of network failures with local question bank fallback
- **Temporary Access**: Correct answers grant time-defined temporary access (default: 15 minutes)
- **Timer Reset**: Incorrect answers reset/extend the lock timer

### Native Blocking Foundation ✅
- **iOS Placeholders**: FamilyControls, ManagedSettings, DeviceActivityCenter modules prepared
- **Android Overlay**: Lock overlay component that displays when blocked apps open
- **Background Service**: Structure for Android background monitoring service
- **Permission Management**: Config plugins handle all required permissions

## 📱 What's Implemented

### Lock Screen
- Category selection (Social/Games/Other) + per-app selection
- Duration picker (Days/Hours/Minutes) with persistence
- Soft/Hard lock toggle
- 3-second countdown before lock activates
- **API-fetched SAT questions** with loading states
- **Temporary access** after correct challenge completion
- **Hard Lock**: Back button disabled on Android

### Stats Screen
- **OS Screen Time Integration**: Pulls raw usage data from iOS/Android
- Time-range pills (Today/Week/Month/Custom)
- Bar chart visualization
- Top Apps list with OS data or fallback

### Schedule Screen
- Create recurring schedules (time range + weekdays)
- Favorite schedules
- Integration with lock system

### Technical Stack
- **Framework**: React Native (Expo SDK 54)
- **State Management**: Zustand with AsyncStorage persistence
- **Native Modules**: Config plugins for iOS/Android permissions
- **API Integration**: Question API with fallback to local bank

## 🔧 Setup & Development

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS: Xcode 14+ (for native builds)
- Android: Android Studio (for native builds)

### Installation

```bash
# Install dependencies
npm install

# For iOS native builds
npm run prebuild:ios
npx expo run:ios

# For Android native builds
npm run prebuild:android
npx expo run:android

# Development client
npm start --dev-client
```

### Native Module Development

See [NATIVE_MODULES.md](./NATIVE_MODULES.md) for detailed implementation guide for:
- iOS FamilyControls/ManagedSettings modules
- Android UsageStats/Accessibility modules
- Background services and overlays

## 📋 Configuration

### API Configuration

Set the SAT question API URL in `app.json`:

```json
{
  "expo": {
    "extra": {
      "questionApiUrl": "https://your-api.com/sat-questions"
    }
  }
}
```

Or via environment variable:
```bash
EXPO_PUBLIC_QUESTION_API_URL=https://your-api.com/sat-questions
```

### Permissions

Permissions are automatically configured via `app.plugin.js`:
- **iOS**: FamilyControls, DeviceActivity
- **Android**: PACKAGE_USAGE_STATS, SYSTEM_ALERT_WINDOW, FOREGROUND_SERVICE

## 🎯 Next Steps

1. **Implement Native Modules**: Complete iOS/Android native module implementations (see NATIVE_MODULES.md)
2. **API Integration**: Replace placeholder API URL with production SAT question API
3. **Testing**: Test on physical devices (native APIs not available in simulators)
4. **App Store Submission**: Prepare for iOS App Store review (FamilyControls requires special handling)

## ⚠️ Current Limitations

- **Native Modules**: Placeholder implementations - requires native Swift/Kotlin code
- **API**: Uses local question bank fallback until production API is configured
- **Testing**: Some features require physical devices (iOS FamilyControls, Android permissions)

## 📝 Architecture Notes

The app is structured to support native blocking without UI changes:
- **Service Layer**: `src/services/` contains blocking and screen time services
- **Native Modules**: `src/native/index.ts` provides interface for native modules
- **Config Plugins**: `app.plugin.js` configures permissions automatically
- **Fallback Logic**: Graceful degradation when native modules unavailable

See [NATIVE_MODULES.md](./NATIVE_MODULES.md) for implementation details.


