import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { GlassCard } from '../components/GlassCard';
import { Checkbox } from '../components/Checkbox';
import { PrimaryButton } from '../components/PrimaryButton';
import { PillToggle } from '../components/PillToggle';
import { DurationPicker, DurationValue } from '../components/DurationPicker';
import { AppIcon } from '../components/AppIcon';
import { Colors, Radius, Spacing } from '../theme';
import { CategoryLabels, SampleApps, AppCategory } from '../data/sampleApps';
import { durationToMs, getSelectedAppIds, LockType, useAppStore } from '../store/useAppStore';
import { generateChallengeQuestions } from '../challenges/generateQuestions';

type CategoryKey = AppCategory;

function formatRemaining(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}

export function LockScreen({ route, navigation }: any) {
  const selectedAppIds = useAppStore((s) => s.selectedAppIds);
  const setCategory = useAppStore((s) => s.setCategory);
  const toggleApp = useAppStore((s) => s.toggleApp);
  const lockType = useAppStore((s) => s.lockType);
  const setLockType = useAppStore((s) => s.setLockType);
  const lastDuration = useAppStore((s) => s.lastDuration);
  const setLastDuration = useAppStore((s) => s.setLastDuration);
  const startLock = useAppStore((s) => s.startLock);
  const activeLock = useAppStore((s) => s.activeLock);
  const clearExpiredLock = useAppStore((s) => s.clearExpiredLock);
  const forceEndLock = useAppStore((s) => s.forceEndLock);
  const challengeDifficulty = useAppStore((s) => s.challengeDifficulty);
  const recordChallengeResult = useAppStore((s) => s.recordChallengeResult);
  const quickSelectSingleApp = useAppStore((s) => s.quickSelectSingleApp);

  const [expanded, setExpanded] = useState<CategoryKey | null>('social');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [challengeVisible, setChallengeVisible] = useState(false);
  const [challengeQuestions, setChallengeQuestions] = useState(() =>
    generateChallengeQuestions({ difficulty: 2, count: 5 })
  );
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, number | null>>({});

  const selectedIds = useMemo(() => getSelectedAppIds(selectedAppIds), [selectedAppIds]);
  const durationMs = useMemo(() => durationToMs(lastDuration), [lastDuration]);
  const lockEnabled = selectedIds.length > 0 && durationMs > 0 && !activeLock;

  React.useEffect(() => {
    clearExpiredLock();
  }, [clearExpiredLock]);

  React.useEffect(() => {
    const preselect = route?.params?.preselectAppId as string | undefined;
    if (preselect) {
      quickSelectSingleApp(preselect);
      navigation.setParams({ preselectAppId: undefined });
    }
  }, [route?.params?.preselectAppId, quickSelectSingleApp, navigation]);

  function categoryAllSelected(category: AppCategory) {
    const apps = SampleApps.filter((a) => a.category === category);
    return apps.length > 0 && apps.every((a) => selectedAppIds[a.id]);
  }

  function categorySomeSelected(category: AppCategory) {
    const apps = SampleApps.filter((a) => a.category === category);
    return apps.some((a) => selectedAppIds[a.id]) && !apps.every((a) => selectedAppIds[a.id]);
  }

  function startAfterDelay(chosenType: LockType) {
    let t = 3;
    setCountdown(t);
    const interval = setInterval(() => {
      t -= 1;
      setCountdown(t);
      if (t <= 0) {
        clearInterval(interval);
        setCountdown(null);
        startLock({ lockType: chosenType, durationMs, appIds: selectedIds });
      }
    }, 1000);
  }

  function onPressLock() {
    if (!lockEnabled) return;
    if (lockType === 'hard') {
      Alert.alert('Hard Lock', 'No override. Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: () => startAfterDelay('hard') },
      ]);
      return;
    }
    startAfterDelay('soft');
  }

  function openChallengePreview() {
    const count = Math.min(10, 5 + Math.max(0, (challengeDifficulty - 1) * 2));
    setChallengeAnswers({});
    setChallengeQuestions(generateChallengeQuestions({ difficulty: challengeDifficulty, count }));
    setChallengeVisible(true);
  }

  function submitChallenge() {
    const allAnswered = challengeQuestions.every((q) => typeof challengeAnswers[q.id] === 'number');
    if (!allAnswered) {
      Alert.alert('Incomplete', 'Answer every question.');
      return;
    }
    const success = challengeQuestions.every((q) => challengeAnswers[q.id] === q.answerIndex);
    recordChallengeResult(success);
    setChallengeVisible(false);
    if (!success) Alert.alert('Failed', 'Back to Lock.');
    else Alert.alert('Pass', 'Soft Lock override would open the app (MVP preview).');
  }

  const remainingMs = activeLock ? Math.max(0, activeLock.endsAt - Date.now()) : 0;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="lock-closed" size={18} color={Colors.text} />
          <Text style={styles.headerTitle}>Lock</Text>
        </View>

        {activeLock ? (
          <GlassCard style={styles.activeCard} intensity={44}>
            <View style={styles.activeRow}>
              <Text style={styles.activeTitle}>{activeLock.lockType === 'hard' ? 'Hard Lock Active' : 'Soft Lock Active'}</Text>
              <Ionicons name="timer-outline" size={18} color={Colors.textDim} />
            </View>
            <Text style={styles.activeSub}>{formatRemaining(remainingMs)} remaining</Text>
            <Text style={styles.activeApps}>
              {activeLock.appIds
                .map((id) => SampleApps.find((a) => a.id === id)?.name ?? id)
                .slice(0, 4)
                .join(', ')}
              {activeLock.appIds.length > 4 ? '…' : ''}
            </Text>

            {activeLock.lockType === 'soft' ? (
              <View style={styles.activeActions}>
                <Pressable onPress={openChallengePreview} style={({ pressed }) => [styles.smallAction, pressed && { opacity: 0.8 }]}>
                  <Ionicons name="school-outline" size={16} color={Colors.blue} />
                  <Text style={styles.smallActionText}>Preview Challenge</Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    Alert.alert('End Soft Lock?', 'This is only available inside the app (MVP convenience).', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'End', style: 'destructive', onPress: () => forceEndLock() },
                    ])
                  }
                  style={({ pressed }) => [styles.smallAction, pressed && { opacity: 0.8 }]}
                >
                  <Ionicons name="stop-circle-outline" size={16} color={Colors.textDim} />
                  <Text style={[styles.smallActionText, { color: Colors.textDim }]}>End</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.hardNote}>No override. Timer must expire.</Text>
            )}
          </GlassCard>
        ) : null}

        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryRow}>
          {(Object.keys(CategoryLabels) as AppCategory[]).map((c) => {
            const meta = CategoryLabels[c];
            const all = categoryAllSelected(c);
            const some = categorySomeSelected(c);
            const isExpanded = expanded === c;
            return (
              <Pressable
                key={c}
                onPress={() => setExpanded(isExpanded ? null : c)}
                style={({ pressed }) => [styles.cat, isExpanded && styles.catActive, pressed && { opacity: 0.85 }]}
              >
                <View style={styles.catTop}>
                  <Ionicons name={meta.icon as any} size={16} color={isExpanded ? Colors.blue : Colors.textDim} />
                  <Checkbox
                    checked={all}
                    onToggle={() => setCategory(c, !all)}
                    disabled={!!activeLock}
                  />
                </View>
                <Text style={[styles.catLabel, isExpanded && { color: Colors.blue }]}>{meta.label}</Text>
                {some ? <View style={styles.indeterminateDot} /> : null}
              </Pressable>
            );
          })}
        </View>

        {expanded ? (
          <GlassCard style={styles.dropdown} intensity={38}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>{CategoryLabels[expanded].label}</Text>
              <View style={styles.dropdownHeaderRight}>
                <Text style={styles.dropdownHint}>Select</Text>
                <Checkbox
                  checked={categoryAllSelected(expanded)}
                  onToggle={() => setCategory(expanded, !categoryAllSelected(expanded))}
                  disabled={!!activeLock}
                />
              </View>
            </View>
            <View style={styles.divider} />
            {SampleApps.filter((a) => a.category === expanded).map((a) => (
              <Pressable
                key={a.id}
                onPress={() => !activeLock && toggleApp(a.id)}
                style={({ pressed }) => [styles.appRow, pressed && !activeLock && { opacity: 0.85 }]}
              >
                <View style={styles.appLeft}>
                  <AppIcon label={a.name} color={a.color} size={36} />
                  <Text style={styles.appName}>{a.name}</Text>
                </View>
                <Checkbox checked={!!selectedAppIds[a.id]} onToggle={() => toggleApp(a.id)} disabled={!!activeLock} />
              </Pressable>
            ))}
          </GlassCard>
        ) : null}

        <Text style={styles.sectionTitle}>Timer</Text>
        <GlassCard intensity={34}>
          <DurationPicker value={lastDuration as DurationValue} onChange={(d) => !activeLock && setLastDuration(d)} />
        </GlassCard>

        <View style={{ height: 14 }} />
        <PrimaryButton label="Lock Apps" onPress={onPressLock} disabled={!lockEnabled || !!countdown} />

        <View style={styles.lockTypeRow}>
          <PillToggle
            value={lockType}
            options={[
              { value: 'soft', label: 'Soft Lock' },
              { value: 'hard', label: 'Hard Lock' },
            ]}
            onChange={(v) => !activeLock && setLockType(v)}
          />
        </View>

        <GlassCard style={styles.setupCard} intensity={26}>
          <Text style={styles.setupTitle}>MVP Note</Text>
          <Text style={styles.setupText}>
            True app blocking needs OS permissions (Screen Time on iOS, Usage Access + Accessibility on Android). This MVP focuses on the full flow + UI and will guide setup when native blockers are added.
          </Text>
        </GlassCard>
      </ScrollView>

      <Modal visible={countdown !== null} transparent animationType="fade" onRequestClose={() => {}}>
        <View style={styles.overlay}>
          <GlassCard intensity={60} style={styles.countdownCard}>
            <Text style={styles.countdownTitle}>Locking…</Text>
            <Text style={styles.countdownNum}>{countdown}</Text>
            <Text style={styles.countdownSub}>Don’t blink.</Text>
          </GlassCard>
        </View>
      </Modal>

      <Modal visible={challengeVisible} transparent animationType="slide" onRequestClose={() => setChallengeVisible(false)}>
        <View style={styles.overlay}>
          <GlassCard intensity={64} style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeTitle}>Soft Lock Challenge</Text>
              <Pressable onPress={() => setChallengeVisible(false)} style={({ pressed }) => [styles.xBtn, pressed && { opacity: 0.8 }]}>
                <Ionicons name="close" size={18} color={Colors.textDim} />
              </Pressable>
            </View>
            <Text style={styles.challengeSub}>Answer all correctly.</Text>

            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {challengeQuestions.map((q, idx) => (
                <View key={q.id} style={styles.qBlock}>
                  <Text style={styles.qTitle}>{idx + 1}. {q.prompt}</Text>
                  {q.choices.map((c, i) => {
                    const picked = challengeAnswers[q.id] === i;
                    return (
                      <Pressable
                        key={`${q.id}-${i}`}
                        onPress={() => setChallengeAnswers((s) => ({ ...s, [q.id]: i }))}
                        style={({ pressed }) => [
                          styles.choice,
                          picked && styles.choicePicked,
                          pressed && { opacity: 0.85 },
                        ]}
                      >
                        <Text style={[styles.choiceText, picked && { color: Colors.text }]}>{c}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </ScrollView>

            <View style={{ height: 12 }} />
            <PrimaryButton label="Submit" onPress={submitChallenge} disabled={false} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 10,
    color: Colors.textDim,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cat: {
    flex: 1,
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  catActive: {
    borderColor: 'rgba(74,141,255,0.35)',
    backgroundColor: 'rgba(74,141,255,0.10)',
  },
  catTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  catLabel: {
    color: Colors.textDim,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  indeterminateDot: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.blue,
    opacity: 0.6,
  },
  dropdown: {
    marginTop: 12,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dropdownTitle: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  dropdownHint: { color: Colors.textFaint, fontWeight: '700', letterSpacing: 0.2 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: 10 },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  appLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  appName: { color: Colors.text, fontWeight: '700' },
  lockTypeRow: { marginTop: 12 },
  setupCard: { marginTop: 16 },
  setupTitle: {
    color: Colors.text,
    fontWeight: '800',
    marginBottom: 6,
  },
  setupText: { color: Colors.textDim, lineHeight: 18 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  countdownCard: { width: '100%', maxWidth: 420, alignItems: 'center' },
  countdownTitle: { color: Colors.text, fontWeight: '800', fontSize: 16 },
  countdownNum: { color: Colors.blue, fontWeight: '900', fontSize: 52, marginTop: 8 },
  countdownSub: { color: Colors.textDim, marginTop: 6, fontWeight: '700' },

  activeCard: { marginBottom: 16 },
  activeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  activeTitle: { color: Colors.text, fontWeight: '900', fontSize: 16 },
  activeSub: { color: Colors.blue, marginTop: 6, fontWeight: '800' },
  activeApps: { color: Colors.textDim, marginTop: 6 },
  hardNote: { marginTop: 10, color: Colors.textFaint, fontWeight: '700' },
  activeActions: { marginTop: 12, flexDirection: 'row', gap: 10 },
  smallAction: {
    flex: 1,
    height: 42,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  smallActionText: { color: Colors.blue, fontWeight: '800' },

  challengeCard: { width: '100%', maxWidth: 520 },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  challengeTitle: { color: Colors.text, fontWeight: '900', fontSize: 16 },
  challengeSub: { color: Colors.textDim, marginTop: 6, marginBottom: 10, fontWeight: '700' },
  xBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qBlock: { marginBottom: 14 },
  qTitle: { color: Colors.text, fontWeight: '800', marginBottom: 8, lineHeight: 18 },
  choice: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 8,
  },
  choicePicked: {
    borderColor: 'rgba(74,141,255,0.35)',
    backgroundColor: 'rgba(74,141,255,0.14)',
  },
  choiceText: { color: Colors.textDim, fontWeight: '700' },
});


