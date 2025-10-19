import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { User } from "lucide-react-native";
import { logout } from "../../../../shared-core/src/services/auth/logout";
import privateApiClient from "../../../../shared-core/src/services/client/privateApiClient";

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const logoutFromBackend = async () => {
    try {
      await logout(privateApiClient); // ✅ cliente inyectado
      console.log("Sesión cerrada");
      // Aquí puedes navegar a la pantalla de login con React Navigation o router.replace("/auth/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View>
      {/* Botón de usuario */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={styles.userButton}
      >
        <User size={24} color="white" />
      </TouchableOpacity>

      {/* Modal del menú */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            {/* Ver perfil */}
            <TouchableOpacity
              onPress={() => {
                console.log("Ir a /profile/me");
                setIsOpen(false);
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Ver perfil</Text>
            </TouchableOpacity>

            {/* Editar perfil */}
            <TouchableOpacity
              onPress={() => {
                console.log("Ir a /profile/me/edit");
                setIsOpen(false);
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Editar perfil</Text>
            </TouchableOpacity>

            {/* Cerrar sesión */}
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
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  menuContainer: {
    width: 240,
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
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