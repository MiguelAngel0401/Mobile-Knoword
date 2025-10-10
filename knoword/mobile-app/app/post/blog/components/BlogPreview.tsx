import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";

interface BlogPreviewProps {
  title: string;
  content: string;
}

export default function BlogPreview({ title, content }: BlogPreviewProps) {
  // Fecha simulada para la vista previa
  const previewDate = new Date();
  const { width } = useWindowDimensions();

  return (
    <View className="bg-gray-900 border border-gray-700 rounded-md p-6">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-white mb-2">
          {title || "Título del blog"}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-gray-400 text-sm">Por Autor del Blog</Text>
          <Text className="mx-2 text-gray-400">•</Text>
          <Text className="text-gray-400 text-sm">
            {previewDate.toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>

      {/* Contenido del blog */}
      <RenderHTML
        contentWidth={width}
        source={{
          html:
            content ||
            "<p>Contenido del blog aparecerá aquí...</p>",
        }}
        baseStyle={{ color: "white", fontSize: 14, lineHeight: 20 }}
      />
    </View>
  );
}