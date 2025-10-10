import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Youtube } from "lucide-react-native";

interface YoutubeUploadProps {
  editor?: any; // en RN no hay tipado oficial de Tiptap, puedes usar any o tu wrapper
}

export default function YoutubeUpload({ editor }: YoutubeUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleSubmit = () => {
    if (!url || !editor) return;

    const start = startTime ? parseInt(startTime, 10) : 0;

    // En RN no existe setYoutubeVideo nativo, pero si tu editor lo soporta:
    editor?.commands?.setYoutubeVideo?.({
      src: url,
      start: isNaN(start) ? 0 : start,
    });

    setUrl("");
    setStartTime("");
    setIsOpen(false);
  };

  return (
    <View>
      {/* Botón para abrir modal */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="p-2 rounded-md"
      >
        <Youtube size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={isOpen} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-gray-800 rounded-lg p-6 w-80">
            <Text className="text-lg font-semibold text-white mb-4">
              Insertar video de YouTube
            </Text>

            {/* URL */}
            <View className="mb-4">
              <Text className="text-sm text-gray-300 mb-1">URL del video</Text>
              <TextInput
                value={url}
                onChangeText={setUrl}
                placeholder="https://www.youtube.com/watch?v=..."
                placeholderTextColor="#9CA3AF"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </View>

            {/* Tiempo de inicio */}
            <View className="mb-4">
              <Text className="text-sm text-gray-300 mb-1">
                Tiempo de inicio (opcional)
              </Text>
              <TextInput
                value={startTime}
                onChangeText={setStartTime}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              <Text className="mt-1 text-xs text-gray-400">
                Segundos después del inicio del video
              </Text>
            </View>

            {/* Botones */}
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                className="px-4 py-2"
              >
                <Text className="text-gray-300 font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="px-4 py-2 bg-blue-600 rounded-md"
              >
                <Text className="text-white font-semibold">Insertar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}