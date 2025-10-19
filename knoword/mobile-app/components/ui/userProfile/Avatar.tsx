import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

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
    <View style={styles.container}>
      <Image
        source={{ uri: src || "https://via.placeholder.com/150" }}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        }}
        resizeMode="cover"
      />
      {editable && <Text style={styles.editText}>Editar</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center", // items-center
  },
  editText: {
    color: "#3B82F6", // text-blue-500
    fontSize: 14, // text-sm
    marginTop: 8, // mt-2
  },
});