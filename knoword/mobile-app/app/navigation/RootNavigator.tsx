import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@shared/types/navigation";

//import HomeScreen from "../screens/HomeScreen";
import CommunityDetailScreen from "../communities/community/[idCommunity]/CommunityDetailScreen";
import CommunityByTagScreen from "../communities/[tag]/CommunityByTagScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      <Stack.Screen name="CommunityScreen" component={CommunityDetailScreen} />
      <Stack.Screen name="CommunityByTag" component={CommunityByTagScreen} />
    </Stack.Navigator>
  );
}