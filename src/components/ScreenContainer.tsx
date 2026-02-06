import React from 'react';
import { SafeAreaView, StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';

type Props = ViewProps & {
  children: React.ReactNode;
};

export function ScreenContainer({ children, style, ...rest }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[Colors.bg0, Colors.bg1]} style={styles.bg} />
      <View {...rest} style={[styles.content, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg0 },
  bg: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1 },
});


