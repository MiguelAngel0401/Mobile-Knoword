import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import SearchBar from "./SearchBar";
import { NotificationsMenu } from "./NotificationsMenu";
import { ProfileMenu } from "./ProfileMenu";

export default function Navbar() {
  const pathname = "/communities";

  return (
    <View style={styles.container}>
      {/* Sección izquierda: logo + búsqueda */}
      <View style={styles.leftSection}>
        <Text style={styles.logoText}>KnoWord</Text>
        <SearchBar />
      </View>

      {/* Sección derecha: menús */}
      <View style={styles.rightSection}>
        {pathname.includes("communities") && (
          <TouchableOpacity
            onPress={() => console.log("Ir a crear comunidad")}
            style={styles.createButton}
          >
            <Text style={styles.createButtonText}>Crear comunidad</Text>
          </TouchableOpacity>
        )}
        <NotificationsMenu />
        <ProfileMenu />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    backgroundColor: "black",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },
  createButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
});