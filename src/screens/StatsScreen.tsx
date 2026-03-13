import React, { useMemo, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { GlassCard } from '../components/GlassCard';
import { PillToggle } from '../components/PillToggle';
import { AppIcon } from '../components/AppIcon';
import { SvgBarChart } from '../components/SvgBarChart';
import { Colors, Radius, Spacing } from '../theme';
import { SampleApps } from '../data/sampleApps';
import { StatsRange, useAppStore, AppUsage } from '../store/useAppStore';
import { getScreenTimeData } from '../services/screenTimeService';

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
  const selectedAppIds = useAppStore((s) => s.selectedAppIds);
  
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [osScreenTimeData, setOsScreenTimeData] = useState<AppUsage[]>([]);
  
  // Fetch OS screen time data when range or selected apps change
  useEffect(() => {
    let cancelled = false;
    
    async function loadData() {
      setIsLoadingStats(true);
      try {
        const selectedIds = Object.entries(selectedAppIds)
          .filter(([, selected]) => selected)
          .map(([appId]) => appId);
        
        if (selectedIds.length === 0) {
          if (!cancelled) {
            setOsScreenTimeData([]);
            setIsLoadingStats(false);
          }
          return;
        }
        
        // Calculate date range based on selected range
        const endDate = new Date();
        const startDate = new Date();
        
        if (range === 'today') {
          startDate.setHours(0, 0, 0, 0);
        } else if (range === 'week') {
          startDate.setDate(endDate.getDate() - 7);
        } else if (range === 'month') {
          startDate.setDate(endDate.getDate() - 30);
        }
        
        const screenTimeData = await getScreenTimeData({
          appIds: selectedIds,
          startDate,
          endDate,
        });
        
        if (cancelled) return;
        
        // Convert to AppUsage format
        const usageMap = new Map<string, number>();
        
        screenTimeData.forEach((data) => {
          const existing = usageMap.get(data.appId) || 0;
          usageMap.set(data.appId, existing + data.minutes);
        });
        
        // Calculate average per day
        const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        
        const appUsage: AppUsage[] = Array.from(usageMap.entries()).map(([appId, totalMinutes]) => ({
          appId,
          minutesPerDay: totalMinutes / days,
        }));
        
        // Sort by usage descending
        appUsage.sort((a, b) => b.minutesPerDay - a.minutesPerDay);
        
        setOsScreenTimeData(appUsage);
      } catch (error) {
        console.warn('Failed to load OS screen time data:', error);
        // Fallback to existing topApps from store
        if (!cancelled) {
          setOsScreenTimeData([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingStats(false);
        }
      }
    }
    
    loadData();
    
    return () => {
      cancelled = true;
    };
  }, [range, selectedAppIds]);

  const series = useMemo(() => {
    // If we have OS data, use it; otherwise fallback to mock data
    if (osScreenTimeData.length > 0 && range === 'week') {
      // Convert daily OS data to weekly series
      const totalMinutes = osScreenTimeData.reduce((sum, app) => sum + app.minutesPerDay, 0);
      const avgHoursPerDay = totalMinutes / 60;
      // Distribute across week (simplified - in production would use actual daily breakdown)
      const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return labels.map((label) => ({ label, hours: avgHoursPerDay }));
    }
    
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
  }, [range, weekSeries, osScreenTimeData]);

  const totalHours = useMemo(() => {
    if (osScreenTimeData.length > 0) {
      const totalMinutes = osScreenTimeData.reduce((sum, app) => sum + app.minutesPerDay, 0);
      return (totalMinutes * (range === 'today' ? 1 : range === 'week' ? 7 : 30)) / 60;
    }
    return series.reduce((sum, p) => sum + p.hours, 0);
  }, [series, osScreenTimeData, range]);
  
  const headline = `${Math.round(totalHours)} hours wasted`;
  
  // Use OS data if available, otherwise fallback to store data
  const displayedApps = osScreenTimeData.length > 0 ? osScreenTimeData : topApps;

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
          <SvgBarChart data={series} height={240} />
        </GlassCard>

        <View style={{ height: 16 }} />
        <GlassCard intensity={34}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Top Apps</Text>
            {isLoadingStats && <ActivityIndicator size="small" color={Colors.blue} />}
          </View>
          <View style={styles.list}>
            {displayedApps.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  {isLoadingStats
                    ? 'Loading screen time data...'
                    : 'No usage data available. Select apps to track on the Lock tab.'}
                </Text>
              </View>
            ) : (
              displayedApps.map((t) => {
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
            }))}
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
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  sectionHeader: { color: Colors.text, fontWeight: '900', fontSize: 16 },
  list: { gap: 12 },
  emptyState: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.textDim,
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 20,
  },
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


