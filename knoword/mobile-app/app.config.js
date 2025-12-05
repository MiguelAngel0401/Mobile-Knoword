import 'dotenv/config';

export default {
  expo: {
    name: "Knoword",
    slug: "alphaedu",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/logo.png",  // Usa el mismo logo
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
      package: "com.knoword.app",
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "CAMERA"
      ]
    },
    extra: {
      eas: {
        projectId: "b6cab36f-a45f-4f68-850c-3b08d2bd5f2b"
      },
      CLOUDINARY_CLOUD_NAME: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_PRESET: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      [
        "expo-image-picker",
        {
          "photosPermission": "La app necesita acceso a tus fotos para subir imágenes."
        }
      ]
    ]
  },
};