import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';
import { LockScreen } from '../screens/LockScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';

export type RootTabsParamList = {
  Lock: { preselectAppId?: string } | undefined;
  Stats: undefined;
  Schedule: undefined;
};

const Tab = createBottomTabNavigator<RootTabsParamList>();

function TabBarBackground() {
  if (Platform.OS === 'web') return <View style={styles.bgFallback} />;
  return <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />;
}

export function Tabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Lock"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.blue,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
          tabBarStyle: styles.tabBar,
          tabBarBackground: () => <TabBarBackground />,
          tabBarIcon: ({ color, focused, size }) => {
            const s = size ?? 22;
            if (route.name === 'Lock') return <Ionicons name={focused ? 'lock-closed' : 'lock-closed-outline'} size={s} color={color} />;
            if (route.name === 'Stats') return <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={s} color={color} />;
            return <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={s} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Lock" component={LockScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 14,
    height: 62,
    borderRadius: 22,
    borderTopWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  bgFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,18,34,0.92)',
  },
});


