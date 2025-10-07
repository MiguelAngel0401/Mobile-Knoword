export const uploadToCloudinary = async (): Promise<{ secure_url: string }> => {
  // Aquí deberías integrar tu lógica de selección de imagen y subida
  // Este es solo un mock para que compile sin errores
  return {
    secure_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  };
};