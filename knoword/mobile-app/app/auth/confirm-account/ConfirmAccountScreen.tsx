import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { AuthStackParamList } from "@shared/types/navigation";
import { useAxiosErrorHandler } from "../../../../shared-core/src/hooks/useAxiosErrorHandler";
import { confirmEmail } from "@shared/services/auth/confirm";

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
    <View style={styles.container}>
      {status === "loading" && (
        <>
          <Text style={styles.loadingTitle}>{message}</Text>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.subtext}>Por favor, espera un momento...</Text>
        </>
      )}

      {status === "success" && (
        <>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>{message}</Text>
          <Text style={styles.subtext}>
            Serás redirigido a la página de inicio de sesión en breve.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.primaryButton}
          >
            <Text style={styles.buttonText}>Ir a Iniciar Sesión</Text>
          </TouchableOpacity>
        </>
      )}

      {status === "error" && (
        <>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Error de Verificación</Text>
          <Text style={styles.subtext}>
            {message}. Vuelve a generar un enlace de verificación.
          </Text>
          <TouchableOpacity style={styles.errorButton}>
            <Text style={styles.buttonText}>Volver a Inicio</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  subtext: {
    marginTop: 16,
    color: "#d1d5db",
    textAlign: "center",
    fontSize: 14,
  },
  successIcon: {
    fontSize: 48,
    color: "#22c55e",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22c55e",
    marginBottom: 16,
    textAlign: "center",
  },
  errorIcon: {
    fontSize: 48,
    color: "#ef4444",
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ef4444",
    marginBottom: 16,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#e11d48",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
  },
  errorButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});