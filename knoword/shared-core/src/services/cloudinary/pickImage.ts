import * as ImagePicker from "expo-image-picker";

export const pickImage = async (): Promise<string> => {
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

  if (result.canceled || !result.assets?.[0]?.uri) {
    throw new Error("Selección cancelada");
  }

  return result.assets[0].uri;
};