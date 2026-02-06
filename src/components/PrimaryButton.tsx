import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrap,
        disabled && styles.disabled,
        pressed && !disabled && { transform: [{ scale: 0.99 }], opacity: 0.95 },
      ]}
    >
      <LinearGradient
        colors={
          disabled
            ? ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']
            : ['rgba(74,141,255,0.30)', 'rgba(74,141,255,0.08)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.grad}
      >
        <View style={styles.inner}>
          <Text style={[styles.text, disabled && styles.textDisabled]}>{label}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.strokeStrong,
  },
  grad: {
    borderRadius: Radius.xl,
  },
  inner: {
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.blue,
    fontSize: 16,
    letterSpacing: 0.4,
    fontWeight: '700',
    textTransform: 'none',
  },
  disabled: {
    borderColor: Colors.stroke,
  },
  textDisabled: {
    color: Colors.textFaint,
    fontWeight: '600',
  },
});


