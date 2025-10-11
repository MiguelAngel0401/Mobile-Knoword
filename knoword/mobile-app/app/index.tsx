import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import { router } from "expo-router";
import { getBackendUrl } from "@shared/config";
import { ROUTES } from "@/constants/routes"; // ← nuevo import

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
    if (ready) {
      const targetRoute = isAuthenticated ? ROUTES.community : ROUTES.login;
      router.replace(targetRoute as any); // ✅ navegación segura con rutas centralizadas
    }
  }, [ready, isAuthenticated]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>{status}</Text>
      {!ready && <ActivityIndicator size="large" />}
      {ready && (
        <Button
          title="Forzar ir a comunidades"
          onPress={() => router.push(ROUTES.community as any)} // ✅ limpio y centralizado
        />
      )}
    </View>
  );
}