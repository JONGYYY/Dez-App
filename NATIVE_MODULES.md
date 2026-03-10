# Native Modules Implementation Guide

This document outlines the native module implementations required for FocusLock to function as a complete app blocking solution.

## Architecture Overview

FocusLock uses Expo Development Builds with custom native modules for:
- **iOS**: FamilyControls framework for app blocking
- **Android**: UsageStats + Accessibility Service for app blocking

## iOS Implementation

### Required Modules

1. **FamilyControls Module** (`ios/FocusLock/FamilyControlsModule.swift`)
   - Request FamilyControls authorization
   - Get SelectionToken from FamilyActivityPicker
   - Block/unblock apps using ManagedSettings

2. **DeviceActivity Module** (`ios/FocusLock/DeviceActivityModule.swift`)
   - Monitor app usage via DeviceActivityCenter
   - Query usage data for Stats screen

### Setup Steps

1. Add entitlements:
   ```xml
   <key>com.apple.developer.family-controls</key>
   <true/>
   <key>com.apple.token</key>
   <dict/>
   ```

2. Link frameworks in Xcode:
   - FamilyControls.framework
   - ManagedSettings.framework
   - DeviceActivity.framework

3. Implement modules following Expo module protocol:
   ```swift
   import ExpoModulesCore
   import FamilyControls
   
   public class FamilyControlsModule: Module {
     public func definition() -> ModuleDefinition {
       // Implementation here
     }
   }
   ```

## Android Implementation

### Required Modules

1. **UsageStats Module** (`android/app/src/main/java/com/focuslock/UsageStatsModule.kt`)
   - Check/request PACKAGE_USAGE_STATS permission
   - Query UsageStatsManager for app usage data
   - Map FocusLock app IDs to package names

2. **AppBlocking Service** (`android/app/src/main/java/com/focuslock/AppBlockingService.kt`)
   - Background service to detect foreground app
   - Show overlay when blocked app opens
   - Intercept app launches

3. **Accessibility Module** (optional, for advanced blocking)
   - AccessibilityService to detect app launches
   - More reliable than polling UsageStats

### Setup Steps

1. Add permissions in `AndroidManifest.xml` (already configured via plugin)

2. Implement foreground service:
   ```kotlin
   class AppBlockingService : Service() {
     override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
       // Monitor foreground app and show overlay
     }
   }
   ```

3. Register service in manifest:
   ```xml
   <service android:name=".AppBlockingService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="dataSync" />
   ```

## Current Status

✅ **Config Plugins**: Configured for iOS and Android permissions
✅ **Service Layer**: TypeScript interfaces for native modules
✅ **Fallback Logic**: App gracefully degrades when native modules unavailable

⏳ **Next Steps**:
1. Implement iOS native modules
2. Implement Android native modules
3. Test on physical devices (native APIs not available in simulator)
4. Submit for App Store/Play Store review (especially iOS FamilyControls)

## Testing

### iOS
- Requires physical device (FamilyControls not available in simulator)
- Requires Family Sharing setup
- Subject to App Store review

### Android
- Can test in emulator (UsageStats available)
- Requires manual permission grant (Settings > Apps > Special Access)
- System Overlay permission requires user action

## API Integration

The SAT question API should follow this structure:

```typescript
GET /sat-questions?difficulty=3&count=5

Response:
{
  "questions": [
    {
      "id": "q-123",
      "type": "math",
      "difficulty": 3,
      "prompt": "If 2x + 5 = 13, what is x?",
      "choices": ["3", "4", "5", "6"],
      "answerIndex": 1
    }
  ]
}
```

The app will fallback to local questions if the API is unavailable.





