import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../auth/login/LoginScreen";
import RegisterScreen from "../auth/register/RegisterScreen";
import ForgotPasswordScreen from "../auth/forgot-password/ForgotPasswordScreen";
import ConfirmAccountScreen from "../auth//confirm-account/ConfirmAccountScreen";
import { AuthStackParamList } from "@shared/types/navigation";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ConfirmAccount" component={ConfirmAccountScreen} />
    </Stack.Navigator>
  );
}