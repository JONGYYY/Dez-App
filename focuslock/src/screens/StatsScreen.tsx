import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { GlassCard } from '../components/GlassCard';
import { PillToggle } from '../components/PillToggle';
import { AppIcon } from '../components/AppIcon';
import { Colors, Radius, Spacing } from '../theme';
import { SampleApps } from '../data/sampleApps';
import { StatsRange, useAppStore } from '../store/useAppStore';

function formatRangeLabel(range: StatsRange) {
  if (range === 'today') return 'Today';
  if (range === 'week') return 'Last 7 days';
  if (range === 'month') return 'Last 30 days';
  return 'Custom';
}

export function StatsScreen({ navigation }: any) {
  const range = useAppStore((s) => s.statsRange);
  const setRange = useAppStore((s) => s.setStatsRange);
  const weekSeries = useAppStore((s) => s.usageSeriesWeek);
  const topApps = useAppStore((s) => s.topApps);

  const series = useMemo(() => {
    if (range === 'week') return weekSeries;
    if (range === 'today') return [{ label: 'Today', hours: Math.max(0.6, weekSeries[new Date().getDay()]?.hours ?? 2.2) }];
    if (range === 'month') {
      // MVP: synthesize 30 days from week pattern
      const base = weekSeries.map((p) => p.hours);
      const out: { label: string; hours: number }[] = [];
      for (let i = 1; i <= 30; i += 1) out.push({ label: `${i}`, hours: base[i % base.length] ?? 2.0 });
      return out;
    }
    return weekSeries;
  }, [range, weekSeries]);

  const totalHours = useMemo(() => series.reduce((sum, p) => sum + p.hours, 0), [series]);
  const headline = `${Math.round(totalHours)} hours wasted`;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Statistics</Text>
        </View>

        <GlassCard intensity={36}>
          <Text style={styles.big}>{headline}</Text>
          <Text style={styles.sub}>{formatRangeLabel(range)}</Text>
        </GlassCard>

        <View style={{ height: 14 }} />
        <PillToggle
          value={range}
          options={[
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'custom', label: 'Custom' },
          ]}
          onChange={(v) => setRange(v as StatsRange)}
        />

        <View style={{ height: 14 }} />
        <GlassCard intensity={34}>
          <VictoryChart
            theme={VictoryTheme.material}
            height={240}
            padding={{ top: 20, bottom: 40, left: 46, right: 16 }}
            domainPadding={{ x: 16 }}
          >
            <VictoryAxis
              style={{
                axis: { stroke: 'rgba(255,255,255,0.12)' },
                tickLabels: { fill: 'rgba(255,255,255,0.55)', fontSize: 10 },
                grid: { stroke: 'rgba(255,255,255,0.06)' },
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: 'rgba(255,255,255,0.12)' },
                tickLabels: { fill: 'rgba(255,255,255,0.55)', fontSize: 10 },
                grid: { stroke: 'rgba(255,255,255,0.06)' },
              }}
            />
            <VictoryBar
              data={series}
              x="label"
              y="hours"
              style={{
                data: { fill: Colors.blue, opacity: 0.85 },
              }}
              cornerRadius={{ top: 6, bottom: 0 }}
              barWidth={14}
            />
          </VictoryChart>
        </GlassCard>

        <View style={{ height: 16 }} />
        <GlassCard intensity={34}>
          <Text style={styles.sectionHeader}>Top Apps</Text>
          <View style={styles.list}>
            {topApps.map((t) => {
              const app = SampleApps.find((a) => a.id === t.appId);
              const name = app?.name ?? t.appId;
              const usageText = `${Math.round(t.minutesPerDay / 60)}h/day`;
              return (
                <View key={t.appId} style={styles.row}>
                  <View style={styles.left}>
                    <AppIcon label={name} color={app?.color ?? '#666'} size={40} />
                    <View>
                      <Text style={styles.name}>{name}</Text>
                      <Text style={styles.usage}>{usageText}</Text>
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <Pressable
                      onPress={() => navigation.navigate('Lock', { preselectAppId: t.appId })}
                      style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.8 }]}
                    >
                      <Ionicons name="lock-closed-outline" size={18} color={Colors.blue} />
                    </Pressable>
                    <Pressable
                      onPress={() => {}}
                      style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.8 }]}
                    >
                      <Ionicons name="pencil" size={18} color={Colors.textDim} />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: Spacing.xl, paddingBottom: 110 },
  header: { marginBottom: 18 },
  headerTitle: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  big: { color: Colors.blue, fontWeight: '900', fontSize: 28, letterSpacing: 0.2 },
  sub: { marginTop: 6, color: Colors.textFaint, fontWeight: '800' },
  sectionHeader: { color: Colors.text, fontWeight: '900', fontSize: 16, marginBottom: 10 },
  list: { gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { color: Colors.text, fontWeight: '800' },
  usage: { color: Colors.textFaint, marginTop: 2, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


