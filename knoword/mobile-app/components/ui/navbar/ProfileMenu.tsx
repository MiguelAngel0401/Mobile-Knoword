import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { User } from "lucide-react-native";
import privateApiClient from "@/services/client/privateApiClient";

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const logoutFromBackend = async () => {
    try {
      await privateApiClient.post(`/auth/logout`);
      console.log("Sesión cerrada");
      // Aquí puedes navegar a la pantalla de login con React Navigation
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View>
      {/* Botón de usuario */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="p-2 rounded-full bg-gray-800"
      >
        <User size={24} color="white" />
      </TouchableOpacity>

      {/* Modal del menú */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-60 bg-gray-900 rounded-md shadow-lg py-2">
            {/* Ver perfil */}
            <TouchableOpacity
              onPress={() => {
                console.log("Ir a /profile/me");
                setIsOpen(false);
              }}
              className="px-4 py-3"
            >
              <Text className="text-white text-sm">Ver perfil</Text>
            </TouchableOpacity>

            {/* Editar perfil */}
            <TouchableOpacity
              onPress={() => {
                console.log("Ir a /profile/me/edit");
                setIsOpen(false);
              }}
              className="px-4 py-3"
            >
              <Text className="text-white text-sm">Editar perfil</Text>
            </TouchableOpacity>

            {/* Cerrar sesión */}
            <TouchableOpacity
              onPress={() => {
                logoutFromBackend();
                setIsOpen(false);
              }}
              className="px-4 py-3 bg-red-600 rounded-b-md"
            >
              <Text className="text-white text-sm font-semibold">
                Cerrar Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}