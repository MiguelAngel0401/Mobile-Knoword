import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@shared/validators/auth/login";
import { z } from "zod";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@shared/types/navigation";
import { useAuthStore } from "@shared/store/authStore";
import { useAxiosErrorHandler } from "@shared/hooks/useAxiosErrorHandler";
import { login } from "@shared/services/auth/login";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();
  const { handleAxiosError } = useAxiosErrorHandler();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate("Profile");
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setBackendError(null);
    setSubmissionError(null);

    try {
      await login(data);
      setIsAuthenticated(true);
      navigation.navigate("Profile");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setBackendError(error.response.data.message);
        setError("email", { type: "manual" });
        setError("password", { type: "manual" });
      } else {
        handleAxiosError(error);
        setSubmissionError("Ocurrió un error al iniciar sesión. Intenta más tarde.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-gray-900">
      <View className="bg-gray-800 rounded-lg shadow-lg p-6">
        <Text className="text-3xl font-bold text-white text-center mb-6">
          Inicia sesión en tu cuenta
        </Text>

        <Text className="text-gray-300 text-center mb-4">
          Aprende, comparte y crece junto a una comunidad que ama el conocimiento.
        </Text>

        <Text className="text-sm font-medium text-white mb-1">Correo Electrónico</Text>
        <TextInput
          className={`w-full border rounded-md py-2 px-3 text-white bg-gray-700 ${
            errors.email ? "border-red-500" : "border-gray-600"
          }`}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => setValue("email", text)}
        />
        {errors.email && (
          <Text className="text-red-500 font-light text-sm mt-2">{errors.email.message}</Text>
        )}

        <Text className="text-sm font-medium text-white mt-4 mb-1">Contraseña</Text>
        <TextInput
          className={`w-full border rounded-md py-2 px-3 text-white bg-gray-700 ${
            errors.password ? "border-red-500" : "border-gray-600"
          }`}
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={(text) => setValue("password", text)}
        />
        {errors.password && (
          <Text className="text-red-500 font-light text-sm mt-2">{errors.password.message}</Text>
        )}

        {backendError && (
          <Text className="text-red-500 font-medium text-md text-center mt-4">{backendError}</Text>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text className="text-primary hover:text-primary-hover text-sm text-center mt-4">
            ¿Olvidaste tu contraseña? Recupérala en segundos.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary-hover py-3 rounded-lg mt-6"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-center">Iniciar sesión</Text>
          )}
        </TouchableOpacity>

        {submissionError && (
          <Text className="text-red-500 font-medium text-sm text-center mt-4">
            {submissionError}
          </Text>
        )}
      </View>
    </View>
  );
}