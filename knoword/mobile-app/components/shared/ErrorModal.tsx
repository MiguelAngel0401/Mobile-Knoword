import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

type ErrorModalProps = {
  message: string;
  onClose: () => void;
  onRetry: () => void;
};

export default function ErrorModal({ message, onClose, onRetry }: ErrorModalProps) {
  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Fondo oscuro */}
      <View className="flex-1 bg-black/50 justify-center items-center">
        {/* Contenedor del modal */}
        <View className="bg-gray-800 rounded-lg shadow-xl p-6 w-80">
          <Text className="text-2xl font-bold text-red-400 mb-4 text-center">
            ¡Upps! 😢
          </Text>

          <Text className="text-white mb-6 text-center">{message}</Text>

          {/* Botones */}
          <View className="flex-row justify-end space-x-4">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 bg-gray-600 rounded"
            >
              <Text className="text-white font-medium">Cerrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onRetry}
              className="px-4 py-2 bg-blue-600 rounded"
            >
              <Text className="text-white font-medium">Reintentar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}