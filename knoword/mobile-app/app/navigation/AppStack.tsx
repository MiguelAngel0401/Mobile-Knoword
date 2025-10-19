// apps/mobile/src/navigation/AppStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../profile/me/Profile"; // ✅ Debe ser Profile.tsx (no ProfileScreen.tsx)
import { AppStackParamList } from "@shared/types/navigation";

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  console.log("📱 AppStack renderizado");
  
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}