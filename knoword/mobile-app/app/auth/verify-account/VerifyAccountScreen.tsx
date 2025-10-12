import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@shared/types/navigation";

export default function VerifyAccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>¡Revisa tu correo!</Text>

        <Image
          source={require("../../../assets/images/email.png")}
          style={styles.image}
        />

        <Text style={styles.subtitle}>
          Te hemos enviado un enlace para verificar tu cuenta. Si no ves el correo, revisa tu carpeta de spam.
        </Text>

        <View style={styles.row}>
          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendText}>Reenviar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>¡Lo he recibido!</Text>
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