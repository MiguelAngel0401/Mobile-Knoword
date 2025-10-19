import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuthStore } from "@shared/store/authStore";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

export default function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}