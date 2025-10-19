import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AlertTriangle } from "lucide-react-native";

type ErrorMessageScreenProps = { error: string };

export default function ErrorMessageScreen({ error }: ErrorMessageScreenProps) {
  const handleRetry = () => {
    console.log("Reintentar acción");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <AlertTriangle size={48} color="#EF4444" />
        </View>

        <Text style={styles.title}>¡Ups! Algo salió mal</Text>

        <Text style={styles.message}>
          No pudimos conectar con el servidor. ¡Pero no te preocupes!{"\n"}
          Estamos trabajando para solucionarlo.
        </Text>

        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#111827",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    padding: 24,
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 9999,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E5E7EB",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#F87171",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#2563EB",
    borderRadius: 6,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
});