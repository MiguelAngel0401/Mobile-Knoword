import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface InfoModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function InfoModal({ isOpen, message, onClose }: InfoModalProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Aviso</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 320,
    borderRadius: 12,
    backgroundColor: "#1f2937",
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  message: {
    color: "#D1D5DB",
  },
  button: {
    marginTop: 16,
    borderRadius: 6,
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});