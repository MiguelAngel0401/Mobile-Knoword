import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Inicia sesión en tu cuenta</Text>
            <Text style={styles.subtitle}>
              Aprende, comparte y crece junto a una comunidad que ama el conocimiento.
            </Text>

            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text) => setValue("email", text)}
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}

            <Text style={[styles.label, { marginTop: 16 }]}>Contraseña</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoCapitalize="none"
              onChangeText={(text) => setValue("password", text)}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}

            {backendError && (
              <Text style={styles.backendError}>{backendError}</Text>
            )}

            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
              <Text style={styles.link}>
                ¿Olvidaste tu contraseña? Recupérala en segundos.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={styles.button}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>

            {submissionError && (
              <Text style={styles.backendError}>{submissionError}</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#d1d5db",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#374151",
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  error: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 6,
  },
  backendError: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
  link: {
    color: "#e11d48",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#e11d48",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});