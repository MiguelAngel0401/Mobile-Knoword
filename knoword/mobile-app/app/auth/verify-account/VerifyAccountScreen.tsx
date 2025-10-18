import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function VerifyAccountScreen() {
  const { email } = useLocalSearchParams();

  const handleResend = () => {
    // Aquí puedes conectar con tu endpoint de reenvío si lo tienes
    Alert.alert("Correo reenviado", "Revisa nuevamente tu bandeja de entrada.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>¡Revisa tu correo!</Text>

        <Image
          source={require("../../../assets/images/email.png")}
          style={styles.image}
        />

        <Text style={styles.subtitle}>
          Te hemos enviado un enlace para verificar tu cuenta
          {email ? ` a ${email}` : ""}. Si no lo ves, revisa tu carpeta de spam.
        </Text>

        <View style={styles.row}>
          <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
            <Text style={styles.resendText}>Reenviar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace("/auth/login/LoginScreen")}
          >
            <Text style={styles.buttonText}>¡Ya confirmé!</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e11d48",
    textAlign: "center",
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginVertical: 24,
  },
  subtitle: {
    fontSize: 14,
    color: "#d1d5db",
    textAlign: "center",
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 16,
    marginTop: 32,
  },
  resendButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resendText: {
    color: "#1f2937",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#e11d48",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },
});