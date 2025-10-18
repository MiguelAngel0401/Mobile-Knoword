import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { getBackendUrl } from "@shared/config";

export default function ConfirmAccountScreen() {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!code) return Alert.alert("Código requerido", "Ingresa el código de verificación");

    setIsSubmitting(true);
    try {
      await axios.post(`${getBackendUrl()}/auth/confirm`, {
        email,
        code,
      });

      Alert.alert("✅ Cuenta verificada", "Ahora puedes iniciar sesión", [
        { text: "OK", onPress: () => router.replace("/auth/login/LoginScreen") },
      ]);
    } catch (error) {
      console.error("❌ Error al confirmar cuenta:", error);
      Alert.alert("Error", "Código inválido o expirado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar cuenta</Text>
      <Text style={styles.subtitle}>
        Ingresa el código enviado a <Text style={styles.email}>{email}</Text>
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Código de verificación"
        placeholderTextColor="#9CA3AF"
        value={code}
        onChangeText={setCode}
        autoCapitalize="none"
        keyboardType="default"
      />

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.disabled]}
        onPress={handleConfirm}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Verificando..." : "Confirmar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#d1d5db",
    marginBottom: 24,
    textAlign: "center",
  },
  email: {
    fontWeight: "bold",
    color: "#ffffff",
  },
  input: {
    backgroundColor: "#374151",
    color: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4b5563",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#e11d48",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});