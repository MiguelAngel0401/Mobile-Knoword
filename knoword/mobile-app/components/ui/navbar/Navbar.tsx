import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SearchBar from "./SearchBar";
import NotificationsMenu from "./NotificationsMenu";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  // En React Native no existe usePathname de Next.js
  // Si usas React Navigation, puedes obtener la ruta con useRoute()
  const pathname = "/communities"; // <-- simulado, reemplaza con tu lógica de navegación

  return (
    <View className="p-4 flex-row items-center justify-between border-b border-gray-900 bg-black">
      {/* Logo */}
      <View className="flex-row items-center">
        <Text className="text-2xl font-bold text-white mr-8">KnoWord</Text>
      </View>

      {/* Barra de búsqueda */}
      <SearchBar />

      {/* Menús */}
      <View className="flex-row items-center space-x-4 ml-4">
        {pathname.includes("communities") && (
          <TouchableOpacity
            onPress={() => console.log("Ir a crear comunidad")}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            <Text className="text-sm text-white font-medium">
              Crear comunidad
            </Text>
          </TouchableOpacity>
        )}
        <NotificationsMenu />
        <ProfileMenu />
      </View>
    </View>
  );
}