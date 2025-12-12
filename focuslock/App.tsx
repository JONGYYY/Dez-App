import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Tabs } from './src/navigation/Tabs';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs />
    </>
  );
}
