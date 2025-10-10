import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function CommunityErrorModal({
  isOpen,
  onClose,
  message,
}: ErrorModalProps) {
  const router = useRouter();

  const handleGoToCommunities = () => {
    // ✅ Navegación segura con string literal
    router.push("/communities/explore" as any);
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/60 justify-center items-center"
        onPress={onClose}
      >
        <View className="bg-gray-800 rounded-lg shadow-xl p-6 w-80">
          <Text className="text-2xl font-bold text-red-500 mb-4 text-center">
            Ha ocurrido un error
          </Text>

          <Text className="text-md text-gray-200 mb-6 text-center">
            {message || "Algo salió mal. Por favor, inténtalo de nuevo."}
          </Text>

          <View className="flex-row justify-center gap-4">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 bg-blue-600 rounded-lg"
            >
              <Text className="text-white font-semibold">Reintentar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoToCommunities}
              className="px-4 py-2 bg-purple-600 rounded-lg"
            >
              <Text className="text-white font-semibold">
                Explorar comunidades
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}