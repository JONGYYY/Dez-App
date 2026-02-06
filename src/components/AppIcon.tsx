import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme';

type Props = {
  label: string;
  color: string;
  size?: number;
};

export function AppIcon({ label, color, size = 40 }: Props) {
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: Math.round(size * 0.26) }]}>
      <View style={[styles.inner, { backgroundColor: color }]} />
      <Text style={styles.text}>{label.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  inner: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.55,
  },
  text: {
    color: Colors.text,
    fontWeight: '800',
  },
});


