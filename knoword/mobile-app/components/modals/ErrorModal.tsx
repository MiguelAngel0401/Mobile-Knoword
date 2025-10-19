import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type ErrorProps = {
  message: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function ErrorModal({ message, isOpen, onClose }: ErrorProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Fondo oscuro */}
      <View style={styles.overlay}>
        {/* Contenedor del modal */}
        <View style={styles.modalContainer}>
          {/* Icono + mensaje */}
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <Text style={styles.iconText}>!</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>Error de conexión</Text>
              <Text style={styles.subtitle}>{message}</Text>
            </View>
          </View>

          {/* Botón de cierre */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 24,
    width: 320,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrapper: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    color: "#DC2626",
    fontSize: 20,
    fontWeight: "700",
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 4, // mt-1
  },
  closeButton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#DC2626",
    borderRadius: 6,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },
});