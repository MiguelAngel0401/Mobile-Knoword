export const uploadToCloudinary = async (uri: string): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary credentials are not set in .env.local");
  }

  const formData = new FormData();
  formData.append("file", {
    uri,
    name: "upload.jpg",
    type: "image/jpeg",
  } as any); // 👈 tipado forzado para evitar errores

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
    throw new Error(errorData.error.message || "Failed to upload to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url;
};