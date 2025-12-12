import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SampleApps, AppCategory } from '../data/sampleApps';

export type LockType = 'soft' | 'hard';

export type DurationValue = {
  days: number;
  hours: number;
  minutes: number;
};

export type ActiveLock = {
  id: string;
  appIds: string[];
  lockType: LockType;
  startsAt: number; // ms epoch
  endsAt: number; // ms epoch
};

export type Schedule = {
  id: string;
  appIds: string[];
  startMinutes: number; // minutes from midnight
  endMinutes: number; // minutes from midnight
  days: number[]; // 0..6 Sun..Sat
  favorite: boolean;
};

export type StatsRange = 'today' | 'week' | 'month' | 'custom';

type UsagePoint = { label: string; hours: number };

export type AppUsage = {
  appId: string;
  minutesPerDay: number;
};

type State = {
  selectedAppIds: Record<string, boolean>;
  lastDuration: DurationValue;
  lockType: LockType;
  activeLock: ActiveLock | null;
  schedules: Schedule[];
  challengeDifficulty: number; // 1..5
  challengeStreak: number;
  statsRange: StatsRange;
  usageSeriesWeek: UsagePoint[];
  topApps: AppUsage[];

  setLockType: (t: LockType) => void;
  toggleApp: (appId: string) => void;
  setCategory: (category: AppCategory, selected: boolean) => void;
  setLastDuration: (d: DurationValue) => void;

  startLock: (p: { lockType: LockType; durationMs: number; appIds: string[] }) => void;
  clearExpiredLock: () => void;
  forceEndLock: () => void; // soft lock only, app-level convenience

  upsertSchedule: (s: Omit<Schedule, 'id'> & { id?: string }) => void;
  toggleScheduleFavorite: (id: string) => void;

  setStatsRange: (r: StatsRange) => void;
  quickSelectSingleApp: (appId: string) => void;

  recordChallengeResult: (success: boolean) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function minutesFromDate(d: Date) {
  return d.getHours() * 60 + d.getMinutes();
}

function seedWeekSeries(): UsagePoint[] {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // deterministic-ish: skew midweek higher, matches your screenshot vibe
  const values = [2.6, 4.2, 3.8, 5.6, 5.1, 3.3, 1.9];
  return labels.map((label, i) => ({ label, hours: values[i] ?? 0 }));
}

function seedTopApps(): AppUsage[] {
  return [
    { appId: 'tiktok', minutesPerDay: 240 },
    { appId: 'instagram', minutesPerDay: 180 },
    { appId: 'youtube', minutesPerDay: 120 },
    { appId: 'facebook', minutesPerDay: 60 },
  ];
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export const useAppStore = create<State>()(
  persist(
    (set, get) => ({
      selectedAppIds: Object.fromEntries(SampleApps.map((a) => [a.id, false])),
      lastDuration: { days: 0, hours: 2, minutes: 30 },
      lockType: 'soft',
      activeLock: null,
      schedules: [],
      challengeDifficulty: 2,
      challengeStreak: 0,
      statsRange: 'week',
      usageSeriesWeek: seedWeekSeries(),
      topApps: seedTopApps(),

      setLockType: (t) => set({ lockType: t }),
      toggleApp: (appId) =>
        set((s) => ({ selectedAppIds: { ...s.selectedAppIds, [appId]: !s.selectedAppIds[appId] } })),
      setCategory: (category, selected) =>
        set((s) => {
          const next = { ...s.selectedAppIds };
          for (const a of SampleApps) if (a.category === category) next[a.id] = selected;
          return { selectedAppIds: next };
        }),
      setLastDuration: (d) => set({ lastDuration: d }),

      startLock: ({ lockType, durationMs, appIds }) => {
        const now = Date.now();
        set({
          lockType,
          activeLock: {
            id: newId('lock'),
            appIds,
            lockType,
            startsAt: now,
            endsAt: now + durationMs,
          },
        });
      },
      clearExpiredLock: () => {
        const lock = get().activeLock;
        if (!lock) return;
        if (Date.now() >= lock.endsAt) set({ activeLock: null });
      },
      forceEndLock: () => set({ activeLock: null }),

      upsertSchedule: (s) =>
        set((state) => {
          const id = s.id ?? newId('sched');
          const next: Schedule = {
            id,
            appIds: s.appIds,
            startMinutes: s.startMinutes,
            endMinutes: s.endMinutes,
            days: s.days,
            favorite: s.favorite ?? false,
          };
          const existingIdx = state.schedules.findIndex((x) => x.id === id);
          if (existingIdx >= 0) {
            const copy = [...state.schedules];
            copy[existingIdx] = next;
            return { schedules: copy };
          }
          return { schedules: [next, ...state.schedules] };
        }),
      toggleScheduleFavorite: (id) =>
        set((s) => ({
          schedules: s.schedules.map((x) => (x.id === id ? { ...x, favorite: !x.favorite } : x)),
        })),

      setStatsRange: (r) => set({ statsRange: r }),
      quickSelectSingleApp: (appId) =>
        set(() => ({
          selectedAppIds: Object.fromEntries(SampleApps.map((a) => [a.id, a.id === appId])),
        })),

      recordChallengeResult: (success) =>
        set((s) => {
          if (!success) return { challengeStreak: 0, challengeDifficulty: clamp(s.challengeDifficulty - 1, 1, 5) };
          const streak = s.challengeStreak + 1;
          const bump = streak >= 3 ? 1 : 0;
          return {
            challengeStreak: bump ? 0 : streak,
            challengeDifficulty: clamp(s.challengeDifficulty + bump, 1, 5),
          };
        }),
    }),
    {
      name: 'focuslock_v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        selectedAppIds: s.selectedAppIds,
        lastDuration: s.lastDuration,
        lockType: s.lockType,
        activeLock: s.activeLock,
        schedules: s.schedules,
        challengeDifficulty: s.challengeDifficulty,
        challengeStreak: s.challengeStreak,
        statsRange: s.statsRange,
        usageSeriesWeek: s.usageSeriesWeek,
        topApps: s.topApps,
      }),
      onRehydrateStorage: () => (state) => {
        // Cleanup expired lock on app resume/load
        state?.clearExpiredLock();
      },
    }
  )
);

export function getSelectedAppIds(selected: Record<string, boolean>) {
  return Object.entries(selected)
    .filter(([, v]) => v)
    .map(([k]) => k);
}

export function durationToMs(d: DurationValue) {
  const minutes = d.days * 24 * 60 + d.hours * 60 + d.minutes;
  return minutes * 60 * 1000;
}

export function formatMinutes(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hh = `${h}`.padStart(2, '0');
  const mm = `${m}`.padStart(2, '0');
  return `${hh}:${mm}`;
}

export function minutesFromTime(date: Date) {
  return minutesFromDate(date);
}


