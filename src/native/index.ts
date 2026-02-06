/**
 * Native Module Index
 * Placeholder for iOS and Android native module exports
 * 
 * iOS: FamilyControls, ManagedSettings, DeviceActivityCenter
 * Android: UsageStatsManager, AccessibilityService, Background Service
 */

import { NativeModules, Platform } from 'react-native';

// Native module interfaces (will be implemented as native modules)
export interface FocusLockNativeModule {
  // iOS FamilyControls
  requestFamilyControlsAuthorization(): Promise<{ authorized: boolean; error?: string }>;
  setApplicationBlocked(token: string, blocked: boolean): Promise<void>;
  getDeviceActivity(startDate: number, endDate: number): Promise<any[]>;
  
  // Android UsageStats
  checkUsageStatsPermission(): Promise<boolean>;
  requestUsageStatsPermission(): Promise<boolean>;
  getAppUsageStats(startTime: number, endTime: number): Promise<any[]>;
  
  // Android App Blocking
  startBlockingService(apps: string[]): Promise<void>;
  stopBlockingService(): Promise<void>;
  isBlockingActive(): Promise<boolean>;
}

// Try to get native module (will be undefined until native modules are implemented)
let FocusLockNative: FocusLockNativeModule | undefined;

try {
  if (Platform.OS === 'ios') {
    // @ts-ignore - Native module not yet implemented
    FocusLockNative = NativeModules.FocusLockIOS;
  } else if (Platform.OS === 'android') {
    // @ts-ignore - Native module not yet implemented
    FocusLockNative = NativeModules.FocusLockAndroid;
  }
} catch (error) {
  console.warn('Native modules not available:', error);
}

/**
 * Check if native modules are available
 */
export function isNativeModuleAvailable(): boolean {
  return FocusLockNative !== undefined;
}

/**
 * Get native module (throws if not available)
 */
export function getNativeModule(): FocusLockNativeModule {
  if (!FocusLockNative) {
    throw new Error('Native module not available. Run expo prebuild and implement native modules.');
  }
  return FocusLockNative;
}

// Export default module accessor
export default FocusLockNative;



