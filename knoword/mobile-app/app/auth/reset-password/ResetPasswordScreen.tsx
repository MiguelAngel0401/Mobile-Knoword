import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@shared/validators/auth/reset";
import { z } from "zod";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { AuthStackParamList } from "@shared/types/navigation";
import { useAxiosErrorHandler } from "@shared/hooks/useAxiosErrorHandler";
import axios from "axios";
import publicApiClient from "@shared/services/client/publicApiClient";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, "ResetPassword">>();
  const { uid, token } = route.params;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [areParamsValid, setAreParamsValid] = useState(false);

  const {
    handleSubmit,
    watch,
    trigger,
    clearErrors,
    formState: { errors, isValid },
    setValue,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const { handleAxiosError } = useAxiosErrorHandler();

  useEffect(() => {
    if (!uid || !token) {
      setBackendError("Parece que tu enlace no es válido. Solicita uno nuevo.");
      setAreParamsValid(false);
    } else {
      setAreParamsValid(true);
    }
  }, [uid, token]);

  useEffect(() => {
    if (password !== confirmPassword) {
      trigger("confirmPassword");
    } else {
      clearErrors("confirmPassword");
    }
  }, [password, confirmPassword]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!uid || !token) {
      setBackendError("Parece que tu enlace no es válido. Solicita uno nuevo.");
      return;
    }

    setIsSubmitting(true);
    setBackendError(null);
    setSubmissionError(null);
    setShowErrorModal(false);

    try {
      await publicApiClient.post("http://localhost:8000/api/password-reset/confirm/", {
        password: data.password,
        uid,
        token,
      });
      navigation.navigate("Login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setBackendError(error.response.data.error);
      } else {
        handleAxiosError(error);
        setSubmissionError(
          "Hubo un problema al conectar con el servidor. Intenta de nuevo."
        );
        setShowErrorModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900 px-6 py-8">
      <View className="bg-gray-800 rounded-lg shadow-lg p-6">
        <Text className="text-3xl font-bold text-white text-center mb-6">
          Crea una nueva contraseña
        </Text>

        <Text className="text-white mb-1">Nueva contraseña</Text>
        <TextInput
          className="bg-gray-700 text-white rounded-md px-3 py-2"
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={(text) => setValue("password", text)}
        />
        {errors.password && (
          <Text className="text-red-500 text-sm mt-2">{errors.password.message}</Text>
        )}

        <Text className="text-white mt-4 mb-1">Confirmar contraseña</Text>
        <TextInput
          className="bg-gray-700 text-white rounded-md px-3 py-2"
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={(text) => setValue("confirmPassword", text)}
        />
        {errors.confirmPassword && (
          <Text className="text-red-500 text-sm mt-2">{errors.confirmPassword.message}</Text>
        )}

        {backendError && (
          <Text className="text-red-500 text-sm text-center mt-4">{backendError}</Text>
        )}

        <TouchableOpacity
          className="bg-primary py-3 rounded-lg mt-6 disabled:opacity-50"
          disabled={!isValid || isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-center font-bold">Guardar nueva contraseña</Text>
          )}
        </TouchableOpacity>
      </View>

      {showErrorModal && submissionError && (
        <View className="mt-6 bg-red-900 p-4 rounded-lg">
          <Text className="text-white text-center mb-2">{submissionError}</Text>
          <TouchableOpacity
            className="bg-red-600 py-2 px-4 rounded-lg"
            onPress={() => handleSubmit(onSubmit)()}
          >
            <Text className="text-white text-center font-bold">Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}