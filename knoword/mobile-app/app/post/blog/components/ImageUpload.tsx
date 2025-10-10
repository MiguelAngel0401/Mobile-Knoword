import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image as ImageIcon, Upload } from "lucide-react-native";
import { uploadToCloudinary } from "@shared/services/cloudinary/cloudinaryService";

// Si usas un editor tipo Tiptap RN wrapper, lo puedes pasar como prop
interface ImageUploadProps {
  editor?: any; // en RN no existe Tiptap oficial, pero puedes integrar un wrapper
}

export default function ImageUpload({ editor }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImagePick = async () => {
    try {
      // Pedir permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Se requieren permisos para acceder a la galería.");
        return;
      }

      // Abrir galería
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const asset = result.assets[0];

      // Validar tamaño máximo (5MB aprox)
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        alert("La imagen es demasiado grande. El tamaño máximo es 5MB.");
        return;
      }

      setIsUploading(true);

      // Subir a Cloudinary
      const imageUrl = await uploadToCloudinary(asset.uri);

      // Insertar en el editor si existe
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
        className={`p-2 rounded-md flex-row items-center justify-center ${
          isUploading
            ? "bg-gray-700"
            : "bg-transparent"
        }`}
      >
        {isUploading ? (
          <>
            <Upload size={18} color="#9CA3AF" className="mr-2" />
            <ActivityIndicator size="small" color="#9CA3AF" />
            <Text className="text-xs text-gray-400 ml-2">Subiendo...</Text>
          </>
        ) : (
          <ImageIcon size={20} color="#9CA3AF" />
        )}
      </TouchableOpacity>
    </View>
  );
}