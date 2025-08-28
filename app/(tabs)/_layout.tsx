import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../../src/styles/theme';


export default function RootLayout() {
return (
<ThemeProvider>
<Stack screenOptions={{ headerShown: false }} />
</ThemeProvider>
);
}