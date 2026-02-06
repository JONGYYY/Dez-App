const { withInfoPlist, withAndroidManifest } = require('@expo/config-plugins');

/**
 * Expo Config Plugin for FocusLock Native Permissions
 * Sets up FamilyControls (iOS) and UsageStats/Accessibility (Android)
 */
module.exports = function withFocusLockNativeModules(config) {
  // iOS: FamilyControls permissions
  config = withInfoPlist(config, (config) => {
    // Request FamilyControls entitlement
    if (!config.modResults.NSUserTrackingUsageDescription) {
      config.modResults.NSUserTrackingUsageDescription =
        'FocusLock needs access to manage app restrictions to help you stay focused.';
    }
    
    // FamilyControls framework requires specific entitlements
    // These will be added to the entitlements file during prebuild
    return config;
  });

  // Android: UsageStats and Accessibility permissions
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults.manifest;
    
    if (!androidManifest.application) {
      androidManifest.application = [{}];
    }
    
    const application = androidManifest.application[0];
    
    if (!application['uses-permission']) {
      application['uses-permission'] = [];
    }
    
    const permissions = application['uses-permission'];
    
    // UsageStats permission (Android 5.0+)
    if (!permissions.find((p) => p.$['android:name'] === 'android.permission.PACKAGE_USAGE_STATS')) {
      permissions.push({
        $: {
          'android:name': 'android.permission.PACKAGE_USAGE_STATS',
        },
      });
    }
    
    // Query package permission (Android 11+)
    if (!permissions.find((p) => p.$['android:name'] === 'android.permission.QUERY_ALL_PACKAGES')) {
      permissions.push({
        $: {
          'android:name': 'android.permission.QUERY_ALL_PACKAGES',
        },
      });
    }
    
    // Foreground service permission (for background blocking)
    if (!permissions.find((p) => p.$['android:name'] === 'android.permission.FOREGROUND_SERVICE')) {
      permissions.push({
        $: {
          'android:name': 'android.permission.FOREGROUND_SERVICE',
        },
      });
    }
    
    // System overlay permission (for lock overlay)
    if (!permissions.find((p) => p.$['android:name'] === 'android.permission.SYSTEM_ALERT_WINDOW')) {
      permissions.push({
        $: {
          'android:name': 'android.permission.SYSTEM_ALERT_WINDOW',
        },
      });
    }
    
    // Background restrictions bypass (for blocking)
    if (!permissions.find((p) => p.$['android:name'] === 'android.permission.WAKE_LOCK')) {
      permissions.push({
        $: {
          'android:name': 'android.permission.WAKE_LOCK',
        },
      });
    }
    
    return config;
  });

  return config;
};



