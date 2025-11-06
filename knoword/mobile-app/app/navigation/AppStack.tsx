// apps/mobile/src/navigation/AppStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../profile/me/Profile";
import { AppStackParamList } from "@shared/types/navigation";

// Comunidades
import ExploreCommunityScreen from "../communities/explore/ExploreCommuntyScreen";
import MemberCommunityScreen from "../communities/member/MemberCommunityScreen";
import MyCommunityScreen from "../communities/my/MyCommunityScreen";
import CreateCommunityScreen from "../communities/create/CreateCommunitytScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {

  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />

      {/* Comunidades */}
      <Stack.Screen name="ExploreCommunities" component={ExploreCommunityScreen} />
      <Stack.Screen name="MemberCommunities" component={MemberCommunityScreen} />
      <Stack.Screen name="MyCommunities" component={MyCommunityScreen} />
      <Stack.Screen name="CreateCommunity" component={CreateCommunityScreen} />
    </Stack.Navigator>
  );
}