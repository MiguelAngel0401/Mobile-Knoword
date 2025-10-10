import React from "react";
import { View, Text } from "react-native";
import { Users } from "lucide-react-native";

interface CommunityUpdate {
  id: number;
  title: string;
  date: string;
  description: string;
  active?: boolean;
}

export function CommunityUpdateItem({ update }: { update: CommunityUpdate }) {
  return (
    <View className="flex-row items-start p-4 border-b border-gray-700">
      {/* Icono */}
      <View className="mr-3">
        <View className="w-10 h-10 rounded-full bg-green-100 justify-center items-center">
          <Users size={24} color="#22C55E" />
        </View>
      </View>

      {/* Contenido */}
      <View className="flex-1">
        <Text className="text-sm font-medium text-white">{update.title}</Text>
        <Text className="text-xs text-gray-400 mt-0.5">{update.description}</Text>
        <Text className="text-xs text-gray-400 mt-1">{update.date}</Text>
      </View>
    </View>
  );
}