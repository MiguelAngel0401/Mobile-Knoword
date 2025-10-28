import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";

export const uploadToCloudinary = async (): Promise<{ secure_url: string }> => {
  const cloudName = Constants.expoConfig?.extra?.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = Constants.expoConfig?.extra?.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary credentials are not set in app.config.js");
  }

  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    throw new Error("Permiso denegado para acceder a la galería");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) {
    throw new Error("Selección cancelada");
  }

  const uri = result.assets[0].uri;
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: "upload.jpg",
    type: "image/jpeg",
  } as any);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Error al subir a Cloudinary");
  }

  return response.json(); // devuelve { secure_url, ... }
};