import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface InfoModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function InfoModal({ isOpen, message, onClose }: InfoModalProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Fondo oscuro */}
      <View className="flex-1 bg-black/70 justify-center items-center">
        {/* Contenedor del modal */}
        <View className="w-80 rounded-xl bg-gray-800 p-6 shadow-xl">
          <Text className="text-xl font-bold text-white mb-2">Aviso</Text>
          <Text className="text-gray-300">{message}</Text>

          <TouchableOpacity
            onPress={onClose}
            className="mt-4 rounded bg-blue-600 px-4 py-2"
          >
            <Text className="text-white text-sm font-medium text-center">
              Entendido
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}