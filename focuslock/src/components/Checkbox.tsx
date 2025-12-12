import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../theme';

type Props = {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export function Checkbox({ checked, onToggle, disabled }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      onPress={onToggle}
      disabled={disabled}
      style={({ pressed }) => [
        styles.box,
        checked && styles.boxChecked,
        disabled && styles.boxDisabled,
        pressed && !disabled && { opacity: 0.75 },
      ]}
    >
      {checked ? <Ionicons name="checkmark" size={16} color={Colors.text} /> : <View />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.strokeStrong,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    borderColor: Colors.blue,
    backgroundColor: 'rgba(74,141,255,0.22)',
  },
  boxDisabled: {
    opacity: 0.5,
  },
});


