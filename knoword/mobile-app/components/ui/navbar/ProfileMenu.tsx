import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { User } from "lucide-react-native";
import { logout } from "../../../../shared-core/src/services/auth/logout";
import privateApiClient from "../../../../shared-core/src/services/client/privateApiClient";

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const logoutFromBackend = async () => {
    try {
      await logout(privateApiClient);
      console.log("Sesión cerrada");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={{ position: "relative" }}>
      {/* Botón de usuario */}
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={styles.userButton}
      >
        <User size={24} color="white" />
      </TouchableOpacity>

      {/* Menú desplegable */}
      {isOpen && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            onPress={() => {
              console.log("Ir a /profile/me");
              setIsOpen(false);
            }}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Ver perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log("Ir a /profile/me/edit");
              setIsOpen(false);
            }}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              logoutFromBackend();
              setIsOpen(false);
            }}
            style={[styles.menuItem, styles.logoutButton]}
          >
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  userButton: {
    padding: 8,
    borderRadius: 9999,
    backgroundColor: "#1f2937",
    alignSelf: "flex-start",
  },
  menuContainer: {
    position: "absolute",
    top: 40, // justo debajo del ícono
    right: 0,
    width: 200,
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 100,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    color: "white",
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});