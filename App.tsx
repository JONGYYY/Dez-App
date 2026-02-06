import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { Tabs } from './src/navigation/Tabs';
import { LockOverlay } from './src/components/LockOverlay';
import { useAppStore } from './src/store/useAppStore';
import { initializeAppBlocking, isBlockingActive } from './src/services/appBlockingService';

/**
 * Main App Component
 * 
 * Features:
 * - Lock overlay above navigation (Android app blocking)
 * - Hard Lock enforcement (back button disabled)
 * - Native blocking initialization
 */
export default function App() {
  const activeLock = useAppStore((s) => s.activeLock);
  const [blockingServiceActive, setBlockingServiceActive] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  
  // Initialize app blocking service on mount
  useEffect(() => {
    async function init() {
      try {
        const result = await initializeAppBlocking();
        if (result.success) {
          console.log('App blocking service initialized');
        } else {
          console.warn('App blocking initialization failed:', result.error);
        }
      } catch (error) {
        console.warn('Failed to initialize app blocking:', error);
      }
    }
    
    init();
  }, []);
  
  // Check blocking status periodically (Android)
  useEffect(() => {
    if (Platform.OS === 'android' && activeLock) {
      const interval = setInterval(async () => {
        try {
          const isActive = await isBlockingActive();
          setBlockingServiceActive(isActive);
          
          // Show overlay if blocking is active and app is blocked
          // In production, this would be triggered by native module when blocked app opens
          setOverlayVisible(isActive);
        } catch (error) {
          console.warn('Failed to check blocking status:', error);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      setOverlayVisible(false);
      setBlockingServiceActive(false);
    }
  }, [activeLock]);
  
  // Calculate remaining time for overlay
  const remainingTime = activeLock
    ? Math.max(0, activeLock.endsAt - Date.now())
    : 0;
  
  // Get app name for overlay (use first blocked app)
  const appName = activeLock?.appIds[0]
    ? activeLock.appIds
        .map((id) => {
          // Map to app name - in production would use native module to get current app
          const appMap: Record<string, string> = {
            tiktok: 'TikTok',
            instagram: 'Instagram',
            snapchat: 'Snapchat',
            facebook: 'Facebook',
            youtube: 'YouTube',
            reddit: 'Reddit',
          };
          return appMap[id] || id;
        })[0]
    : 'App';
  
  return (
    <>
      <StatusBar style="light" />
      <Tabs />
      
      {/* Lock Overlay - Renders above navigation for Android app blocking */}
      {activeLock && Platform.OS === 'android' && (
        <LockOverlay
          visible={overlayVisible}
          appName={appName}
          remainingTime={remainingTime}
          lockType={activeLock.lockType}
        />
      )}
    </>
  );
}
