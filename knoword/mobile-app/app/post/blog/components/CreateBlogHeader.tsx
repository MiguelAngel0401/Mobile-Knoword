import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface CreateBlogHeaderProps {
  onSave: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  onTogglePreview: () => void;
  isPreviewMode: boolean;
}

export default function CreateBlogHeader({
  onSave,
  onCancel,
  onSubmit,
  onTogglePreview,
  isPreviewMode,
}: CreateBlogHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-2xl font-bold text-white">Crear nuevo blog</Text>

      <View className="flex-row items-center gap-3">
        {/* Cancelar */}
        <TouchableOpacity onPress={onCancel} activeOpacity={0.7}>
          <Text className="text-gray-400 font-medium">Cancelar</Text>
        </TouchableOpacity>

        {/* Vista previa / Editar */}
        <TouchableOpacity
          onPress={onTogglePreview}
          activeOpacity={0.7}
          className="flex-row items-center gap-2 px-4 py-2 border border-gray-600 rounded-md"
        >
          {isPreviewMode ? (
            <>
              <EyeOff size={18} color="white" />
              <Text className="text-white font-semibold">Editar</Text>
            </>
          ) : (
            <>
              <Eye size={18} color="white" />
              <Text className="text-white font-semibold">Vista previa</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Guardar borrador */}
        <TouchableOpacity
          onPress={onSave}
          activeOpacity={0.7}
          className="px-4 py-2 border border-blue-500 rounded-md"
        >
          <Text className="text-white font-semibold">Guardar borrador</Text>
        </TouchableOpacity>

        {/* Publicar */}
        <TouchableOpacity
          onPress={onSubmit}
          activeOpacity={0.7}
          className="px-4 py-2 bg-blue-600 rounded-md"
        >
          <Text className="text-white font-semibold">Publicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}