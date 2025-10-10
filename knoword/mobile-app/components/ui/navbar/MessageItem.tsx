import React from "react";
import { View, Text, Image } from "react-native";

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  avatar: string;
  active?: boolean;
}

export function MessageItem({ message }: { message: Message }) {
  return (
    <View className="flex-row items-start p-4 border-b border-gray-700">
      {/* Avatar */}
      <View className="mr-3">
        <Image
          source={{ uri: message.avatar }}
          className="w-10 h-10 rounded-full"
          resizeMode="cover"
        />
      </View>

      {/* Contenido */}
      <View className="flex-1">
        <Text className="text-sm font-bold text-white">{message.sender}</Text>
        <Text className="text-sm font-light text-gray-200 mt-0.5">
          {message.message}
        </Text>
        <Text className="text-xs text-gray-400 mt-1">{message.time}</Text>
      </View>
    </View>
  );
}