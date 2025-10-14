import { Tabs } from 'expo-router';
import React from 'react';
import { View, useColorScheme } from 'react-native';

const Colors = {
  light: { tint: '#2f95dc' },
  dark: { tint: '#fff' },
};

const HapticTab = ({ children }: { children: React.ReactNode }) => {
  return children;
};

const IconSymbol = ({ size = 24, color = '#000', name = 'circle.fill', style }: any) => {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
        },
        style,
      ]}
    />
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}