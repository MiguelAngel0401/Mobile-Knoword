import 'dotenv/config';

export default {
  expo: {
    name: "AlphaEdu",
    slug: "alphaedu",
    version: "1.0.0",
    sdkVersion: "54.0.0",
    icon: "./assets/images/logo.png",
    extra: {
      CLOUDINARY_CLOUD_NAME: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_PRESET: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    },
  },
};