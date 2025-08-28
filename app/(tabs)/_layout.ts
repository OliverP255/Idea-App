import 'react-native-gesture-handler';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from '../../src/styles/theme';

// Import screens
import CentralScreen from '../../src/screens/CentralScreen/CentralScreen';
import NotesListScreen from '../../src/screens/NotesListScreen/NotesListScreen';
import SettingsScreen from '../../src/screens/SettingsScreen/SettingsScreen';

const Tab = createBottomTabNavigator();

// Custom tab icon component for the central speak button
function CustomSpeakIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.centralIcon, focused && styles.centralIconFocused]}>
      <Ionicons 
        name="bulb" 
        size={28} 
        color={focused ? '#000' : '#666'} 
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NavigationContainer independent={true}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Notes') {
                iconName = 'document-text-outline';
              } else if (route.name === 'Speak') {
                return <CustomSpeakIcon focused={focused} />;
              } else if (route.name === 'Settings') {
                iconName = 'settings-outline';
              } else {
                iconName = 'home-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#6ee7b7',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: {
              backgroundColor: '#0f1724',
              borderTopColor: '#1a2332',
              height: 80,
              paddingBottom: 20,
              paddingTop: 10,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Notes" component={NotesListScreen} />
          <Tab.Screen 
            name="Speak" 
            component={CentralScreen}
            options={{
              tabBarLabel: '',
            }}
          />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  centralIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6ee7b7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#6ee7b7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centralIconFocused: {
    backgroundColor: '#34d399',
    shadowOpacity: 0.5,
  },
});