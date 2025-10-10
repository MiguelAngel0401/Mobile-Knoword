import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertTriangle } from "lucide-react-native";

type ErrorMessageScreenProps = { error: string };

export default function ErrorMessageScreen({ error }: ErrorMessageScreenProps) {
  const handleRetry = () => {
    // En mobile no existe window.location.reload()
    // Aquí puedes implementar lógica de reintento (ej: volver a llamar a la API)
    console.log("Reintentar acción");
  };

  return (
    <View className="flex-1 items-center justify-center p-4 bg-black">
      <View className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-700 shadow-lg p-6 items-center space-y-4">
        {/* Icono */}
        <View className="bg-red-100 p-3 rounded-full">
          <AlertTriangle size={48} color="#EF4444" />
        </View>

        {/* Título */}
        <Text className="text-2xl font-bold text-gray-200 text-center">
          ¡Ups! Algo salió mal
        </Text>

        {/* Mensaje */}
        <Text className="text-gray-400 text-center">
          No pudimos conectar con el servidor. ¡Pero no te preocupes!{"\n"}
          Estamos trabajando para solucionarlo.
        </Text>

        {/* Error específico */}
        <Text className="text-sm text-red-400 font-medium text-center">
          {error}
        </Text>

        {/* Botón Reintentar */}
        <TouchableOpacity
          onPress={handleRetry}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-md"
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}