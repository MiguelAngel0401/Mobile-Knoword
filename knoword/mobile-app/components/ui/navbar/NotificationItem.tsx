import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Trophy, Users } from "lucide-react-native";

interface Notification {
  id: number;
  type: "achievement" | "rank" | "achievement-knoword";
  title: string;
  date: string;
  points?: string;
  actionText?: string;
  active?: boolean;
}

export function NotificationItem({ notification }: { notification: Notification }) {
  const renderIcon = () => {
    switch (notification.type) {
      case "achievement":
        return (
          <View className="w-10 h-10 rounded-full bg-blue-100 justify-center items-center">
            <Trophy size={24} color="#3B82F6" />
          </View>
        );
      case "rank":
        return (
          <View className="w-10 h-10 rounded-full bg-pink-100 justify-center items-center">
            {/* Puedes reemplazar este SVG por un ícono de lucide-react-native */}
            <Text className="text-pink-500 font-bold">★</Text>
          </View>
        );
      case "achievement-knoword":
        return (
          <View className="w-10 h-10 rounded-full bg-purple-100 justify-center items-center">
            <Users size={24} color="#A855F7" />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-row items-start p-4 border-b border-gray-700">
      {/* Icono */}
      <View className="mr-3">{renderIcon()}</View>

      {/* Contenido */}
      <View className="flex-1">
        <Text className="text-sm font-medium text-white">{notification.title}</Text>

        {notification.points && (
          <Text className="text-xs text-gray-400 mt-0.5">
            <Text className="font-bold text-green-500">{notification.points}</Text>{" "}
            añadidos a tu cuenta.
          </Text>
        )}

        <Text className="text-xs text-gray-500 mt-1">{notification.date}</Text>

        {notification.actionText && (
          <TouchableOpacity
            onPress={() => console.log("Acción:", notification.actionText)}
            className="mt-2 px-4 py-1.5 bg-blue-600 rounded-full"
          >
            <Text className="text-white text-xs font-semibold text-center">
              {notification.actionText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}