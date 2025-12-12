import React from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Radius, Shadow } from '../theme';

type Props = ViewProps & {
  intensity?: number;
};

export function GlassCard({ style, children, intensity = 34, ...rest }: Props) {
  if (Platform.OS === 'web') {
    return (
      <View
        {...rest}
        style={[styles.fallback, style]}
      >
        {children}
      </View>
    );
  }

  return (
    <View {...rest} style={[styles.outer, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFillObject} />
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.stroke,
    ...Shadow.soft,
  },
  inner: {
    padding: 14,
  },
  fallback: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.stroke,
    padding: 14,
    ...Shadow.soft,
  },
});


