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
import { User, Grid } from "lucide-react-native";

export default function IndexScreen() {
  const [status, setStatus] = useState("Cargando...");
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Lógica de conexión al backend
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
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (ready && isAuthenticated) {
      router.replace("/communities/my/MyCommunityScreen");
    }
  }, [ready, isAuthenticated]);

  if (!ready) {
    return (
      <View style={styles.center}>
        <Image source={require("../assets/images/logo.png")} style={styles.logoLoader} />
        <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 20 }} />
        <Text style={styles.statusLoader}>{status}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        
        <View style={styles.header}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />
          <Text style={styles.mainTitle}>AlphaEdu</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Bienvenido a la comunidad</Text>
          <Text style={styles.subtitle}>
            Aprende, comparte y crece junto a personas que aman el conocimiento.
          </Text>
          <Text style={styles.status}>{status}</Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/auth/login/LoginScreen")}
        >
          <User color="#ef4444" size={24} />
          <Text style={[styles.tabText, { color: "#ef4444" }]}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/auth/register/RegisterScreen")}
        >
          <Grid color="#a1a1aa" size={24} />
          <Text style={styles.tabText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0E14", 
  },
  logoLoader: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 40,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  statusLoader: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    paddingHorizontal: 30,
  },

  container: {
    flex: 1,
    backgroundColor: "#0A0E14", 
    paddingHorizontal: 24,
  },
  contentWrapper: {
    flex: 1, 
    justifyContent: "flex-start", 
    alignItems: "center",
    paddingTop: 125, 
    paddingBottom: 20, 
  },
  header: {
    alignItems: "center",
    marginBottom: 40, 
  },
  logo: {
    width: 160, 
    height: 160,
    borderRadius: 80, 
    resizeMode: "cover",
    marginBottom: 10,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 1.5,
  },
  card: {
    backgroundColor: "#181E29", 
    borderRadius: 20,
    padding: 30,
    width: '100%', 
    maxWidth: 400, 
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 1,
    borderColor: "#2D3748",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#cbd5e1",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  status: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },

  bottomBar: {
    position: "absolute",
    bottom: 20, 
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 18,
    backgroundColor: "rgba(24, 30, 41, 0.95)", 
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#2D3748",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 18,
  },
  tabItem: {
    alignItems: "center",
    paddingHorizontal: 15,
  },
  tabText: {
    marginTop: 6,
    fontSize: 12,
    color: "#a1a1aa", 
    fontWeight: "600",
  },
});