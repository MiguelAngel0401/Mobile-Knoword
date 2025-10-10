import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface PostActionComponentProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

export default function PostActionComponent({
  icon,
  label,
  onPress,
}: PostActionComponentProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 bg-gray-900 rounded-xl shadow-lg p-4 items-center justify-center"
    >
      <View className="mb-2">{icon}</View>
      <Text className="text-sm text-center text-white">{label}</Text>
    </TouchableOpacity>
  );
}