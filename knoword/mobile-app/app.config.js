import 'dotenv/config';

export default {
  expo: {
    name: "Knoword",
    slug: "alphaedu",
    version: "1.0.0",
    sdkVersion: "54.0.0",
    icon: "./assets/images/logo.png",
    android: {
      package: "com.knoword.app"
    },
    extra: {
      eas: {
        projectId: "b6cab36f-a45f-4f68-850c-3b08d2bd5f2b"
      },
      CLOUDINARY_CLOUD_NAME: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_PRESET: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    },
  },
};