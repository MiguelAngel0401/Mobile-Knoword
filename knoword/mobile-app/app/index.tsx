import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";
import { getBackendUrl } from "@shared/config";
import { ROUTES } from "@/constants/routes";

export default function IndexScreen() {
  const [status, setStatus] = useState("Cargando...");
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // ← luego lo conectas con tu auth real

  useEffect(() => {
    fetch(`${getBackendUrl()}/ping`)
      .then((res) => (res.ok ? res.json() : Promise.reject("Respuesta no válida")))
      .then((data) => {
        if (data.status === "ok") {
          setStatus("✅ Conectado al backend con éxito");
        } else {
          setStatus(`⚠️ Respuesta inesperada: ${JSON.stringify(data)}`);
        }
        setReady(true);
      })
      .catch((err) => {
        console.error("Error al conectar con el backend:", err);
        setStatus("❌ Error de conexión");
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (ready && isAuthenticated) {
      router.replace(ROUTES.community as any);
    }
  }, [ready, isAuthenticated]);

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text style={styles.status}>{status}</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 
<Image
  source={require("../assets/images/logo.png")} // opcional
  style={styles.logo}
/> 
*/}


      <Text style={styles.title}>Bienvenido a la comunidad</Text>
      <Text style={styles.subtitle}>
        Aprende, comparte y crece junto a personas que aman el conocimiento.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push(ROUTES.register as any)}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push(ROUTES.login as any)}
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
  },
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#d1d5db",
    textAlign: "center",
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: "#e11d48",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: "#374151",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  status: {
    marginTop: 32,
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
});