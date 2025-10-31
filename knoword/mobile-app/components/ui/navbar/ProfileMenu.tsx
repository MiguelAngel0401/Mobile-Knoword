import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { User } from "lucide-react-native";
import { logout } from "../../../../shared-core/src/services/auth/logout";
import privateApiClient from "../../../../shared-core/src/services/client/privateApiClient";
import { useRouter } from "expo-router";

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const logoutFromBackend = async () => {
    setIsOpen(false);
    
    await logout(privateApiClient);
    
    router.replace("/auth/login/LoginScreen");
  };

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={styles.userButton}
      >
        <User size={24} color="white" />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsOpen(false);
              router.push("/profile/me/Profile");
            }}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Ver perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsOpen(false);
              router.push("/profile/me/edit/ProfileEditorScreen");
            }}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={logoutFromBackend}
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
    top: 40,
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