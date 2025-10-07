import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../../../shared-core/src/validators/auth/forgot";
import { z } from "zod";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@shared/types/navigation";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log(data);
    // lógica para enviar la solicitud de recuperación
  };

  return (
    <View className="flex-1 justify-center px-6 bg-gray-900">
      <View className="bg-gray-800 rounded-lg shadow-lg p-6">
        <Text className="text-3xl font-bold text-white text-center mb-6">
          Restablece tu contraseña
        </Text>

        <Text className="text-gray-300 text-center mb-4">
          Ingresa tu correo electrónico para recibir un enlace de recuperación.
        </Text>

        <Text className="text-sm font-medium text-white mb-1">
          Correo Electrónico
        </Text>

        <TextInput
          className="w-full border border-gray-600 rounded-md py-2 px-3 text-white bg-gray-700"
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => setValue("email", text)}
        />

        {errors.email && (
          <Text className="text-red-500 font-light text-sm mt-2">
            {errors.email.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="w-full bg-primary hover:bg-primary-hover py-3 rounded-lg mt-6"
        >
          <Text className="text-white font-bold text-center">
            Enviar enlace de recuperación
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="mt-4"
        >
          <Text className="text-primary hover:text-primary-hover text-sm text-center">
            Volver al inicio de sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}