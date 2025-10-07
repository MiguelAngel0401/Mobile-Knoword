import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "../mobile-app/app/navigation/AuthNavigator"; // ajusta el path
import { getBackendUrl } from "@shared/config";

export default function App() {
  const [status, setStatus] = useState("Cargando...");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch(`${getBackendUrl()}/ping`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setReady(true);
      })
      .catch(() => {
        setStatus("Error de conexión");
        setReady(true);
      });
  }, []);

  if (!ready) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Estado del backend: {status}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});