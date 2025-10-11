import React from "react";
import { View } from "react-native";
import { Banner } from "../../../src/components/profile/Banner";

export default function ProfilePage() {
  return (
    <View className="flex-1 bg-black">
      <Banner />
    </View>
  );
}