import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

interface CommunitySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  communityId?: string;
}

export default function CommunitySuccessModal({
  isOpen,
  onClose,
  message,
  communityId,
}: CommunitySuccessModalProps) {
  const router = useRouter();

  const handleGoToCommunity = () => {
    if (communityId) {
      // ✅ Navegación directa con string interpolado
      router.push(`/communities/community/${communityId}` as any);
    }
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
        className="flex-1 bg-black/70 justify-center items-center"
        onPress={onClose}
      >
        <View className="bg-gray-900 rounded-xl border border-gray-700 shadow-2xl w-80 overflow-hidden">
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <Text className="text-2xl font-bold text-green-400 text-center">
              ✅ Comunidad Creada
            </Text>
          </View>

          {/* Body */}
          <View className="px-6 pb-4">
            <Text className="text-gray-300 text-sm text-center leading-relaxed">
              {message || "Tu comunidad ha sido creada exitosamente."}
            </Text>
          </View>

          {/* Footer */}
          <View className="flex-col gap-3 px-6 pb-6 pt-4 bg-gray-800/50 border-t border-gray-700">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2.5 bg-blue-600 rounded-lg"
            >
              <Text className="text-white font-medium text-center">
                OK, lo he entendido
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoToCommunity}
              className="px-4 py-2.5 bg-purple-600 rounded-lg"
            >
              <Text className="text-white font-medium text-center">
                Muéstrame mi comunidad
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}