import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

type ErrorProps = {
  message: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function ErrorModal({ message, isOpen, onClose }: ErrorProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Fondo oscuro */}
      <View className="flex-1 bg-black/50 justify-center items-center">
        {/* Contenedor del modal */}
        <View className="bg-white rounded-lg p-6 w-80 shadow-lg">
          {/* Icono + mensaje */}
          <View className="flex-row items-center mb-4">
            <View className="h-12 w-12 rounded-full bg-red-100 justify-center items-center mr-3">
              <Text className="text-red-600 text-xl">!</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                Error de conexión
              </Text>
              <Text className="text-sm text-gray-600 mt-1">{message}</Text>
            </View>
          </View>

          {/* Botón de cierre */}
          <TouchableOpacity
            onPress={onClose}
            className="mt-2 px-4 py-2 bg-red-600 rounded-md"
          >
            <Text className="text-white font-medium text-center">Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}