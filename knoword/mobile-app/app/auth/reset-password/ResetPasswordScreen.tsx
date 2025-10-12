import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
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
    <ScrollView style={styles.scroll}>
      <View style={styles.card}>
        <Text style={styles.title}>Crea una nueva contraseña</Text>

        <Text style={styles.label}>Nueva contraseña</Text>
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

        <Text style={[styles.label, { marginTop: 16 }]}>Confirmar contraseña</Text>
        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={(text) => setValue("confirmPassword", text)}
        />
        {errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword.message}</Text>
        )}

        {backendError && (
          <Text style={[styles.error, { textAlign: "center", marginTop: 16 }]}>
            {backendError}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!isValid || isSubmitting) && styles.disabledButton,
          ]}
          disabled={!isValid || isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Guardar nueva contraseña</Text>
          )}
        </TouchableOpacity>
      </View>

      {showErrorModal && submissionError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{submissionError}</Text>
          <TouchableOpacity
            style={styles.errorRetry}
            onPress={() => handleSubmit(onSubmit)()}
          >
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingHorizontal: 24,
    paddingVertical: 32,
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
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#374151",
    color: "#ffffff",
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
  primaryButton: {
    backgroundColor: "#e11d48",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  errorBox: {
    marginTop: 24,
    backgroundColor: "#7f1d1d",
    padding: 16,
    borderRadius: 8,
  },
  errorText: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
  errorRetry: {
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});