import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { leaveCommunity } from "@shared/services/community/communityServices";

interface LeaveCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityName: string;
  communityId: string;
}

export default function LeaveCommunityModal({
  isOpen,
  onClose,
  communityName,
  communityId,
}: LeaveCommunityModalProps) {
  const router = useRouter();
  const [communityNameInput, setCommunityNameInput] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCommunityName = (name: string) => {
    const confirmed = name.trim() === communityName.trim();
    setIsConfirmed(confirmed);
    setCommunityNameInput(name);
  };

  const handleLeave = async () => {
    if (!isConfirmed || isDeleting) return;

    setIsDeleting(true);
    try {
      await leaveCommunity(Number(communityId));
      setIsDeleting(false);
      setIsDeleted(true);

      setTimeout(() => {
        onClose();
        router.push("/communities/my" as any); // ✅ navegación corregida
      }, 3000);
    } catch (err) {
      console.error("Error al salir de la comunidad:", err);
      setIsDeleting(false);
      setError("Hubo un error al salir de la comunidad. Inténtalo de nuevo.");
    }
  };

  const handleCancel = () => {
    setCommunityNameInput("");
    setIsConfirmed(false);
    setIsDeleted(false);
    setIsDeleting(false);
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Pressable
        className="flex-1 bg-black/70 justify-center items-center"
        onPress={handleCancel}
      >
        <View className="bg-gray-900 rounded-xl border border-gray-700 shadow-2xl w-80 overflow-hidden">
          <View className="px-6 pt-6 pb-4">
            {!isDeleted ? (
              <>
                <Text className="text-xl font-bold text-red-400 text-center">
                  ⚠️ ¡Advertencia!
                </Text>
                <Text className="text-2xl font-bold text-white text-center mt-1">
                  ¿Deseas salir de esta comunidad?
                </Text>
              </>
            ) : (
              <Text className="text-2xl font-bold text-green-400 text-center">
                ✅ Has salido de la comunidad con éxito
              </Text>
            )}
          </View>

          <View className="px-6 pb-6">
            {!isDeleted ? (
              <>
                <Text className="text-gray-300 text-sm text-center mb-5">
                  Estás a punto de abandonar la comunidad{" "}
                  <Text className="font-semibold text-white">{communityName}</Text>.{" "}
                  Tus publicaciones y comentarios permanecerán visibles, pero ya no
                  podrás participar dentro de la comunidad.
                </Text>

                <View className="relative">
                  <TextInput
                    placeholder={`Escribe "${communityName}"`}
                    placeholderTextColor="#888"
                    value={communityNameInput}
                    onChangeText={validateCommunityName}
                    editable={!isDeleting}
                    className={`w-full px-4 py-3 rounded-lg border text-white ${
                      isConfirmed
                        ? "bg-green-900/30 border-green-600"
                        : communityNameInput && !isConfirmed
                        ? "bg-red-900/20 border-red-600"
                        : "bg-gray-800 border-gray-600"
                    }`}
                  />
                  {isConfirmed && (
                    <Text className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg">
                      ✅
                    </Text>
                  )}
                </View>

                {communityNameInput && !isConfirmed && (
                  <Text className="text-red-400 text-xs mt-2 text-center">
                    El nombre no coincide. Revisa mayúsculas y espacios.
                  </Text>
                )}
              </>
            ) : (
              <Text className="text-gray-200 text-center text-sm">
                Has salido de la comunidad{" "}
                <Text className="font-semibold">{communityName}</Text>{" "}
                correctamente.
              </Text>
            )}

            {error && <Text className="text-red-400 text-md mt-2">{error}</Text>}
          </View>

          <View className="flex-col gap-3 px-6 pb-6 pt-4 bg-gray-800/50 border-t border-gray-700">
            {!isDeleted ? (
              <>
                <TouchableOpacity
                  onPress={handleCancel}
                  disabled={isDeleting}
                  className="px-4 py-2.5 bg-gray-700 rounded-lg disabled:opacity-50"
                >
                  <Text className="text-white text-center font-medium">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLeave}
                  disabled={!isConfirmed || isDeleting}
                  className={`px-4 py-2.5 rounded-lg ${
                    isConfirmed && !isDeleting
                      ? "bg-red-600"
                      : "bg-red-900 opacity-60"
                  }`}
                >
                  <Text className="text-white text-center font-medium">
                    {isDeleting ? "Saliendo..." : "Salir de la comunidad"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={handleCancel}
                className="w-full px-4 py-2.5 bg-blue-600 rounded-lg"
              >
                <Text className="text-white text-center font-medium">Aceptar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}