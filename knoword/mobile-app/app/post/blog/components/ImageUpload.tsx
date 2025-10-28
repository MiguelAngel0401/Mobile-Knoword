import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image as ImageIcon, Upload } from "lucide-react-native";
import { uploadToCloudinary } from "@shared/services/cloudinary/upload";

interface ImageUploadProps {
  editor?: any;
}

export default function ImageUpload({ editor }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Se requieren permisos para acceder a la galería.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const asset = result.assets[0];

      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        alert("La imagen es demasiado grande. El tamaño máximo es 5MB.");
        return;
      }

      setIsUploading(true);

      const imageUrl = await uploadToCloudinary();

      if (editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Error al subir la imagen. Por favor, inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handleImagePick}
        disabled={isUploading}
        activeOpacity={0.7}
        style={[
          styles.button,
          isUploading ? styles.buttonUploading : styles.buttonIdle,
        ]}
      >
        {isUploading ? (
          <View style={styles.uploadingContent}>
            <Upload size={18} color="#9CA3AF" style={styles.iconMarginRight} />
            <ActivityIndicator size="small" color="#9CA3AF" />
            <Text style={styles.uploadingText}>Subiendo...</Text>
          </View>
        ) : (
          <ImageIcon size={20} color="#9CA3AF" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIdle: {
    backgroundColor: "transparent",
  },
  buttonUploading: {
    backgroundColor: "#374151",
  },
  uploadingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconMarginRight: {
    marginRight: 8,
  },
  uploadingText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 8,
  },
});