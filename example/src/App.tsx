import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native-ustyle';

export default function App() {
  return (
    <View fy="red" bw={2} bg="yellow" p={90} mx={20}>
      <Text c="blue">Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
