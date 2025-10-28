import 'dotenv/config';

export default {
  expo: {
    name: "MobileApp", // Puedes cambiarlo por el nombre que quieras mostrar
    slug: "mobile-app", // Debe coincidir con el nombre del proyecto en Expo
    version: "1.0.0",
    sdkVersion: "54.0.0",
    extra: {
      CLOUDINARY_CLOUD_NAME: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_PRESET: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    },
  },
};