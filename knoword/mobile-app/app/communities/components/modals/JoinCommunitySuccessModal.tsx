import React, { useEffect } from "react";
import { Modal, View, Text } from "react-native";

interface JoinSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityName: string;
}

export default function JoinSuccessModal({
  isOpen,
  onClose,
  communityName,
}: JoinSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Cierra automáticamente después de 3 segundos

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Fondo oscuro */}
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        {/* Contenedor del modal */}
        <View className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 items-center">
          {/* Icono de éxito */}
          <View className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <Text className="text-green-600 dark:text-green-300 text-3xl">✓</Text>
          </View>

          {/* Título */}
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            ¡Éxito!
          </Text>

          {/* Mensaje */}
          <Text className="text-gray-600 dark:text-gray-300 text-center">
            Ahora eres miembro de{" "}
            <Text className="font-semibold">{communityName}</Text>.
          </Text>
        </View>
      </View>
    </Modal>
  );
}