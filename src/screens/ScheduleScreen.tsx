import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { WeekdayPicker } from '../components/WeekdayPicker';
import { Colors, Radius, Spacing } from '../theme';
import { SampleApps } from '../data/sampleApps';
import { formatMinutes, getSelectedAppIds, minutesFromTime, useAppStore } from '../store/useAppStore';

function minutesToDate(mins: number) {
  const d = new Date();
  d.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
  return d;
}

export function ScheduleScreen() {
  const selectedAppIds = useAppStore((s) => s.selectedAppIds);
  const schedules = useAppStore((s) => s.schedules);
  const upsertSchedule = useAppStore((s) => s.upsertSchedule);
  const toggleScheduleFavorite = useAppStore((s) => s.toggleScheduleFavorite);

  const selectedIds = useMemo(() => getSelectedAppIds(selectedAppIds), [selectedAppIds]);
  const [startMins, setStartMins] = useState(15 * 60); // 3:00 PM
  const [endMins, setEndMins] = useState(17 * 60); // 5:00 PM
  const [days, setDays] = useState<number[]>([0, 1, 2, 3]);

  const [pickerOpen, setPickerOpen] = useState<'start' | 'end' | null>(null);

  const appLabel = selectedIds.length
    ? selectedIds.map((id) => SampleApps.find((a) => a.id === id)?.name ?? id).slice(0, 2).join(', ') + (selectedIds.length > 2 ? '…' : '')
    : 'Choose apps on Lock tab';

  function saveSchedule() {
    if (selectedIds.length === 0) return;
    upsertSchedule({
      appIds: selectedIds,
      startMinutes: startMins,
      endMinutes: endMins,
      days,
      favorite: false,
    });
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Schedule</Text>
        </View>

        <Text style={styles.sectionTitle}>Block Schedule</Text>
        {schedules.length === 0 ? (
          <GlassCard intensity={30}>
            <Text style={styles.emptyTitle}>No schedules yet</Text>
            <Text style={styles.emptyText}>Set a time range and pick days, then tap “Set Time”.</Text>
          </GlassCard>
        ) : (
          <View style={{ gap: 12 }}>
            {schedules.map((s) => (
              <View key={s.id} style={styles.scheduleRow}>
                <GlassCard style={{ flex: 1 }} intensity={34}>
                  <View style={styles.scheduleInner}>
                    <Text style={styles.scheduleName}>
                      {(s.appIds.map((id) => SampleApps.find((a) => a.id === id)?.name ?? id).slice(0, 1)[0] ?? 'Apps')}
                    </Text>
                    <Text style={styles.scheduleTime}>
                      {formatMinutes(s.startMinutes)} – {formatMinutes(s.endMinutes)}
                    </Text>
                  </View>
                </GlassCard>
                <Pressable
                  onPress={() => toggleScheduleFavorite(s.id)}
                  style={({ pressed }) => [styles.favBtn, pressed && { opacity: 0.8 }]}
                >
                  <Ionicons name={s.favorite ? 'star' : 'star-outline'} size={20} color={s.favorite ? Colors.blue : Colors.textDim} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 16 }} />
        <Text style={styles.sectionTitle}>Time</Text>
        <View style={styles.timeRow}>
          <GlassCard style={styles.timeBox} intensity={34}>
            <Text style={styles.timeLabel}>Start</Text>
            <Pressable onPress={() => setPickerOpen('start')} style={({ pressed }) => [styles.timeValueWrap, pressed && { opacity: 0.85 }]}>
              <Text style={styles.timeValue}>{formatMinutes(startMins)}</Text>
            </Pressable>
          </GlassCard>

          <View style={styles.vDivider} />

          <GlassCard style={styles.timeBox} intensity={34}>
            <Text style={styles.timeLabel}>End</Text>
            <Pressable onPress={() => setPickerOpen('end')} style={({ pressed }) => [styles.timeValueWrap, pressed && { opacity: 0.85 }]}>
              <Text style={styles.timeValue}>{formatMinutes(endMins)}</Text>
            </Pressable>
          </GlassCard>
        </View>

        <View style={{ height: 12 }} />
        <PrimaryButton label="Set Time" onPress={saveSchedule} disabled={selectedIds.length === 0} />

        <View style={{ height: 16 }} />
        <Text style={styles.sectionTitle}>Days</Text>
        <GlassCard intensity={32}>
          <WeekdayPicker activeDays={days} onChange={setDays} />
        </GlassCard>

        <View style={{ height: 16 }} />
        <GlassCard intensity={26}>
          <Text style={styles.hintTitle}>Selected Apps</Text>
          <Text style={styles.hintText}>{appLabel}</Text>
        </GlassCard>
      </ScrollView>

      <Modal visible={pickerOpen !== null} transparent animationType="fade" onRequestClose={() => setPickerOpen(null)}>
        <View style={styles.overlay}>
          <GlassCard intensity={64} style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{pickerOpen === 'start' ? 'Start Time' : 'End Time'}</Text>
              <Pressable onPress={() => setPickerOpen(null)} style={({ pressed }) => [styles.doneBtn, pressed && { opacity: 0.8 }]}>
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={minutesToDate(pickerOpen === 'start' ? startMins : endMins)}
              mode="time"
              display="spinner"
              onChange={(_, date) => {
                if (!date) return;
                const mins = minutesFromTime(date);
                if (pickerOpen === 'start') setStartMins(mins);
                else setEndMins(mins);
              }}
              themeVariant="dark"
            />
          </GlassCard>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Spacing.xl,
    paddingBottom: 110,
  },
  header: { marginBottom: 18 },
  headerTitle: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 10,
    color: Colors.textDim,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scheduleInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scheduleName: { color: Colors.text, fontWeight: '800', fontSize: 16 },
  scheduleTime: { color: Colors.blue, fontWeight: '800' },
  favBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { color: Colors.text, fontWeight: '900', marginBottom: 6 },
  emptyText: { color: Colors.textDim, lineHeight: 18 },

  timeRow: { flexDirection: 'row', alignItems: 'stretch', gap: 12 },
  timeBox: { flex: 1 },
  timeLabel: { color: Colors.textFaint, fontWeight: '800', marginBottom: 8 },
  timeValueWrap: { paddingVertical: 10 },
  timeValue: { color: Colors.text, fontSize: 28, fontWeight: '900', letterSpacing: 0.4, textAlign: 'center' },
  vDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 10 },

  hintTitle: { color: Colors.text, fontWeight: '900', marginBottom: 6 },
  hintText: { color: Colors.textDim, lineHeight: 18 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  pickerCard: { width: '100%', maxWidth: 520 },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  pickerTitle: { color: Colors.text, fontWeight: '900' },
  doneBtn: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: { color: Colors.blue, fontWeight: '900' },
});


