import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { GlassCard } from '../components/GlassCard';
import { Colors, Radius, Spacing } from '../theme';

type PricingTier = 'core' | 'pro' | 'hardcore';

type Props = {
  navigation: any;
};

export function PricingScreen({ navigation }: Props) {
  const [selectedTier, setSelectedTier] = React.useState<PricingTier>('core');

  const handleUpgrade = (tier: PricingTier) => {
    // TODO: Implement in-app purchase flow
    console.log('Upgrade to:', tier);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Upgrade FocusLock</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.subtitle}>Choose your commitment level</Text>

        {/* Core - Free */}
        <GlassCard style={styles.tierCard} intensity={34}>
          <View style={styles.tierHeader}>
            <Text style={styles.tierBadge}>Free forever</Text>
          </View>
          <Text style={styles.tierName}>Core</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>$0</Text>
          </View>
          <Text style={styles.tierDesc}>The baseline. Real blocking, no tricks.</Text>

          <View style={styles.divider} />

          <Text style={styles.featuresTitle}>INCLUDED</Text>
          <Feature icon="checkmark" text="Soft lock with SAT challenge" />
          <Feature icon="checkmark" text="Hard lock (back button disabled)" />
          <Feature icon="checkmark" text="Category & per-app blocking" />
          <Feature icon="checkmark" text="Basic daily stats" />
          <Feature icon="checkmark" text="3 saved schedules" />

          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.tierBtn, styles.tierBtnOutline, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.tierBtnTextOutline}>Current plan</Text>
          </Pressable>
        </GlassCard>

        {/* Pro */}
        <GlassCard style={[styles.tierCard, styles.tierCardPopular]} intensity={44}>
          <View style={styles.tierHeader}>
            <Text style={[styles.tierBadge, styles.tierBadgePopular]}>Most popular</Text>
          </View>
          <Text style={styles.tierName}>Pro</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>$4.99</Text>
            <Text style={styles.priceUnit}>/mo · $39/yr</Text>
          </View>
          <Text style={styles.tierDesc}>For serious focus. Deeper blocking and real insight.</Text>

          <View style={styles.divider} />

          <Text style={styles.featuresTitle}>EVERYTHING IN CORE, PLUS</Text>
          <Feature icon="checkmark" text="Streak tracking + weekly report" color={Colors.blue} />
          <Feature icon="checkmark" text="Adaptive difficulty (harder Qs over time)" color={Colors.blue} />
          <Feature icon="checkmark" text="Unlock delay (adds 5–30 min cool-down)" color={Colors.blue} />
          <Feature icon="checkmark" text="Unlimited schedules + templates" color={Colors.blue} />
          <Feature icon="checkmark" text="iCloud sync across devices" color={Colors.blue} />
          <Feature icon="checkmark" text="Deep focus mode (all notifications off)" color={Colors.blue} />
          <Feature icon="checkmark" text="Goal setting with progress graph" color={Colors.blue} />

          <Pressable
            onPress={() => handleUpgrade('pro')}
            style={({ pressed }) => [styles.tierBtn, styles.tierBtnPrimary, pressed && { opacity: 0.95 }]}
          >
            <Text style={styles.tierBtnTextPrimary}>Upgrade to Pro →</Text>
          </Pressable>
        </GlassCard>

        {/* Hardcore */}
        <GlassCard style={styles.tierCard} intensity={34}>
          <View style={styles.tierHeader}>
            <Text style={[styles.tierBadge, styles.tierBadgeHardcore]}>For the committed</Text>
          </View>
          <Text style={styles.tierName}>Hardcore</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>$9.99</Text>
            <Text style={styles.priceUnit}>/mo · $79/yr</Text>
          </View>
          <Text style={styles.tierDesc}>You cannot break this. Accountability built in.</Text>

          <View style={styles.divider} />

          <Text style={styles.featuresTitle}>EVERYTHING IN PRO, PLUS</Text>
          <Feature icon="shield-checkmark" text="Accountability partner (shares your stats)" color={Colors.danger} />
          <Feature icon="shield-checkmark" text="Commitment contracts (you set a penalty)" color={Colors.danger} />
          <Feature icon="shield-checkmark" text="Lockout override requires partner PIN" color={Colors.danger} />
          <Feature icon="shield-checkmark" text="Emergency unlock cooldown (24 hrs)" color={Colors.danger} />
          <Feature icon="shield-checkmark" text="App-level time budgets with hard cap" color={Colors.danger} />
          <Feature icon="shield-checkmark" text="Weekly accountability digest (email)" color={Colors.danger} />

          <Pressable
            onPress={() => handleUpgrade('hardcore')}
            style={({ pressed }) => [styles.tierBtn, styles.tierBtnDanger, pressed && { opacity: 0.95 }]}
          >
            <Text style={styles.tierBtnTextDanger}>Go Hardcore →</Text>
          </Pressable>
        </GlassCard>

        {/* Family Plan */}
        <GlassCard style={styles.familyCard} intensity={28}>
          <View style={styles.familyHeader}>
            <Ionicons name="people" size={20} color={Colors.blue} />
            <Text style={styles.familyTitle}>Family plan</Text>
            <Text style={styles.familyPrice}>$12.99/mo</Text>
          </View>
          <Text style={styles.familyDesc}>
            Pro features for up to 5 members. Parental controls with parent-only PIN overrides. Shared family screen time dashboard.
          </Text>
        </GlassCard>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

function Feature({ icon, text, color = Colors.text }: { icon: string; text: string; color?: string }) {
  return (
    <View style={styles.feature}>
      <Ionicons name={icon as any} size={16} color={color} />
      <Text style={[styles.featureText, { color }]}>{text}</Text>
    </View>
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
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textDim,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  tierCard: {
    marginBottom: 20,
    padding: 20,
  },
  tierCardPopular: {
    borderWidth: 2,
    borderColor: 'rgba(74,141,255,0.5)',
  },
  tierHeader: {
    marginBottom: 12,
  },
  tierBadge: {
    color: Colors.textDim,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tierBadgePopular: {
    color: Colors.blue,
  },
  tierBadgeHardcore: {
    color: '#FFB84D',
  },
  tierName: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  price: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: '900',
  },
  priceUnit: {
    color: Colors.textDim,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  tierDesc: {
    color: Colors.textDim,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 16,
  },
  featuresTitle: {
    color: Colors.textFaint,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  tierBtn: {
    marginTop: 20,
    height: 52,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierBtnOutline: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tierBtnPrimary: {
    backgroundColor: 'rgba(74,141,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(74,141,255,0.5)',
  },
  tierBtnDanger: {
    backgroundColor: 'rgba(255,77,77,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(255,77,77,0.4)',
  },
  tierBtnTextOutline: {
    color: Colors.textDim,
    fontSize: 16,
    fontWeight: '800',
  },
  tierBtnTextPrimary: {
    color: Colors.blue,
    fontSize: 16,
    fontWeight: '800',
  },
  tierBtnTextDanger: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: '800',
  },
  familyCard: {
    padding: 16,
  },
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  familyTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  familyPrice: {
    color: Colors.textDim,
    fontSize: 14,
    fontWeight: '700',
  },
  familyDesc: {
    color: Colors.textDim,
    fontSize: 13,
    lineHeight: 18,
  },
});
