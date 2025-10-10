import React from "react";
import { View, Image, Text } from "react-native";

type AvatarProps = {
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
};

export function Avatar({ src, size = "md", editable = false }: AvatarProps) {
  const pixelSizes = {
    sm: 40,
    md: 80,
    lg: 120,
    xl: 200,
  };

  const avatarSize = pixelSizes[size] || pixelSizes.md;

  return (
    <View className="items-center">
      <Image
        source={{ uri: src || "https://via.placeholder.com/150" }}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        }}
        resizeMode="cover"
      />
      {editable && (
        <Text className="text-blue-500 text-sm mt-2">Editar</Text>
      )}
    </View>
  );
}