import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors, Radius } from '../theme';

export type DurationValue = {
  days: number;
  hours: number;
  minutes: number;
};

type Props = {
  value: DurationValue;
  onChange: (next: DurationValue) => void;
};

function numberRange(maxInclusive: number) {
  const out: number[] = [];
  for (let i = 0; i <= maxInclusive; i += 1) out.push(i);
  return out;
}

export function DurationPicker({ value, onChange }: Props) {
  const days = numberRange(7);
  const hours = numberRange(23);
  const minutes = numberRange(59).filter((m) => m % 5 === 0);

  const itemStyle = Platform.OS === 'ios' ? styles.iosItem : undefined;

  return (
    <View style={styles.wrap}>
      <View style={styles.col}>
        <Text style={styles.label}>Days</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={value.days}
            onValueChange={(v) => onChange({ ...value, days: Number(v) })}
            itemStyle={itemStyle}
          >
            {days.map((d) => (
              <Picker.Item key={d} label={`${d}`} value={d} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.col}>
        <Text style={styles.label}>Hours</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={value.hours}
            onValueChange={(v) => onChange({ ...value, hours: Number(v) })}
            itemStyle={itemStyle}
          >
            {hours.map((h) => (
              <Picker.Item key={h} label={`${h}`} value={h} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.col}>
        <Text style={styles.label}>Minutes</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={value.minutes}
            onValueChange={(v) => onChange({ ...value, minutes: Number(v) })}
            itemStyle={itemStyle}
          >
            {minutes.map((m) => (
              <Picker.Item key={m} label={`${m}`} value={m} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 10,
  },
  col: { flex: 1 },
  label: {
    color: Colors.textDim,
    fontSize: 12,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  pickerWrap: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.stroke,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  iosItem: {
    height: 120,
    color: Colors.text,
  },
});


