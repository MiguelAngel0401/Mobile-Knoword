import React, { useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

type AvatarProps = {
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
};

export function Avatar({ src, size = "md", editable = false }: AvatarProps) {
  const [localUri, setLocalUri] = useState<string | null>(src || null);

  const pixelSizes = {
    sm: 40,
    md: 80,
    lg: 120,
    xl: 200,
  };

  const avatarSize = pixelSizes[size] || pixelSizes.md;

  // 👉 Función para abrir la galería
  const pickImage = async () => {
    // Pedir permisos
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Necesitas dar permiso para acceder a tus fotos.");
      return;
    }

    // Abrir galería
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // recorte
      aspect: [1, 1], // cuadrado
      quality: 0.8,
    });

    if (!result.canceled) {
      setLocalUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity disabled={!editable} onPress={pickImage}>
        <Image
          source={{ uri: localUri || "https://via.placeholder.com/150" }}
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      {editable && <Text style={styles.editText}>Editar</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  editText: {
    color: "#3B82F6",
    fontSize: 14,
    marginTop: 8,
  },
});