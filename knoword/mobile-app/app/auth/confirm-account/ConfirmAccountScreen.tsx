import React, { useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { AuthStackParamList } from "@shared/types/navigation";
import { useAxiosErrorHandler } from "../../../../shared-core/src/hooks/useAxiosErrorHandler";
import { confirmEmail } from "../../../../shared-core/src/services/auth/confirm";

export default function ConfirmAccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, "ConfirmAccount">>();
  const { token } = route.params;

  const { status, message, setStatus, setMessage, handleAxiosError } = useAxiosErrorHandler();
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current || !token) {
      if (!token && status === "loading") {
        setStatus("error");
        setMessage("Token de verificación no proporcionado.");
      }
      return;
    }

    hasVerified.current = true;

    const verifyAccount = async () => {
      setStatus("loading");
      setMessage("Verificando tu cuenta...");

      try {
        const response = await confirmEmail(token);
        setStatus("success");
        setMessage(response.message || "Cuenta verificada exitosamente.");
        setTimeout(() => {
          navigation.navigate("Login");
        }, 3000);
      } catch (error) {
        handleAxiosError(error);
      }
    };

    verifyAccount();
  }, [token]);

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 px-6">
      {status === "loading" && (
        <>
          <Text className="text-2xl font-semibold text-white mb-4 text-center">{message}</Text>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-gray-300 text-center">Por favor, espera un momento...</Text>
        </>
      )}

      {status === "success" && (
        <>
          <Text className="text-green-500 text-6xl mb-4">✅</Text>
          <Text className="text-3xl font-bold text-green-500 mb-4 text-center">{message}</Text>
          <Text className="text-gray-300 mb-6 text-center">
            Serás redirigido a la página de inicio de sesión en breve.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg"
          >
            <Text className="text-white text-center">Ir a Iniciar Sesión</Text>
          </TouchableOpacity>
        </>
      )}

      {status === "error" && (
        <>
          <Text className="text-red-500 text-6xl mb-4">❌</Text>
          <Text className="text-3xl font-bold text-red-500 mb-4 text-center">Error de Verificación</Text>
          <Text className="text-gray-300 mb-6 text-center">
            {message}. Vuelve a generar un enlace de verificación.
          </Text>
          <TouchableOpacity
           //onPress={() => navigation.navigate("Home")}
            className="bg-error hover:bg-error-hover text-white font-bold py-3 px-6 rounded-lg"
          >
            <Text className="text-white text-center">Volver a Inicio</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}