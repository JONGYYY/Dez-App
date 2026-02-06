import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '../theme';

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

type Props = {
  activeDays: number[]; // 0..6, Sun..Sat
  onChange: (next: number[]) => void;
};

export function WeekdayPicker({ activeDays, onChange }: Props) {
  function toggleDay(idx: number) {
    const set = new Set(activeDays);
    if (set.has(idx)) set.delete(idx);
    else set.add(idx);
    onChange(Array.from(set).sort((a, b) => a - b));
  }

  return (
    <View style={styles.row}>
      {days.map((d, idx) => {
        const active = activeDays.includes(idx);
        return (
          <Pressable
            key={`${d}-${idx}`}
            onPress={() => toggleDay(idx)}
            style={({ pressed }) => [
              styles.day,
              active && styles.dayActive,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{d}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  day: {
    flex: 1,
    height: 38,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayActive: {
    borderColor: 'rgba(74,141,255,0.35)',
    backgroundColor: 'rgba(74,141,255,0.14)',
  },
  text: { color: Colors.textDim, fontWeight: '700' },
  textActive: { color: Colors.blue },
});


