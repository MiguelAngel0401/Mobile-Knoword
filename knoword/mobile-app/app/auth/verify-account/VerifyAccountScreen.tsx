import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@shared/types/navigation";

export default function VerifyAccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 px-6">
      <View className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <Text className="text-3xl font-bold text-primary text-center mb-4">
          ¡Revisa tu correo!
        </Text>

        <Image
          source={require("../../../assets/images/email.png")} // Asegúrate de tener esta imagen en tu carpeta de assets
          style={{ width: 100, height: 100, alignSelf: "center", marginVertical: 24 }}
        />

        <Text className="text-gray-300 text-center leading-relaxed">
          Te hemos enviado un enlace para verificar tu cuenta. Si no ves el correo, revisa tu carpeta de spam.
        </Text>

        <View className="flex-row justify-between gap-4 pt-4 mt-8">
          <TouchableOpacity className="flex-1 bg-gray-200 py-2 px-4 rounded-lg">
            <Text className="text-gray-800 font-medium text-center">Reenviar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-primary py-2 px-4 rounded-lg ml-4"
            onPress={() => navigation.navigate("Login")}
          >
            <Text className="text-white font-medium text-center">¡Lo he recibido!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}