import React from 'react';
import { Modal, StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { Colors, Radius, Spacing } from '../theme';

/**
 * Lock Overlay Component
 * Displays a full-screen overlay when a blocked app is opened on Android
 * This sits above all other UI (including navigation)
 */
export type LockOverlayProps = {
  visible: boolean;
  appName: string;
  remainingTime: number; // milliseconds
  lockType: 'soft' | 'hard';
};

function formatRemaining(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function LockOverlay({ visible, appName, remainingTime, lockType }: LockOverlayProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="none"
      hardwareAccelerated
      statusBarTranslucent
      onRequestClose={() => {
        // Prevent closing on Android back button during Hard Lock
        if (lockType === 'hard' && Platform.OS === 'android') {
          return;
        }
      }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="lock-closed" size={64} color={Colors.blue} />
          <Text style={styles.title}>{lockType === 'hard' ? 'Hard Lock Active' : 'Soft Lock Active'}</Text>
          <Text style={styles.subtitle}>{appName} is blocked</Text>
          
          <GlassCard intensity={44} style={styles.timerCard}>
            <Text style={styles.timerLabel}>Time Remaining</Text>
            <Text style={styles.timerValue}>{formatRemaining(remainingTime)}</Text>
          </GlassCard>
          
          {lockType === 'hard' ? (
            <View style={styles.noteContainer}>
              <Ionicons name="alert-circle-outline" size={20} color={Colors.textDim} />
              <Text style={styles.noteText}>This is a Hard Lock. The timer must expire.</Text>
            </View>
          ) : (
            <View style={styles.noteContainer}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.blue} />
              <Text style={styles.noteText}>Solve the challenge in FocusLock to gain temporary access.</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060B14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textDim,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
  },
  timerCard: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  timerLabel: {
    color: Colors.textFaint,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  timerValue: {
    color: Colors.blue,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 1,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    maxWidth: 340,
  },
  noteText: {
    flex: 1,
    color: Colors.textDim,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
});





