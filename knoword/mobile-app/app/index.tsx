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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IndexScreen() {
  const [status, setStatus] = useState("Cargando...");
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica conexión al backend
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

  // Verifica si hay token en AsyncStorage
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  // Redirige si está autenticado
  useEffect(() => {
    if (ready && isAuthenticated) {
      router.replace("/communities/my/MyCommunityScreen");
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
      {/* Logo opcional */}
      {/* <Image source={require("../assets/images/logo.png")} style={styles.logo} /> */}

      <Text style={styles.title}>Bienvenido a la comunidad</Text>
      <Text style={styles.subtitle}>
        Aprende, comparte y crece junto a personas que aman el conocimiento.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/auth/register/RegisterScreen")}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/auth/login/LoginScreen")}
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
    backgroundColor: "#2563eb",
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