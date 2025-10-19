import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type ErrorModalProps = {
  message: string;
  onClose: () => void;
  onRetry: () => void;
};

export default function ErrorModal({ message, onClose, onRetry }: ErrorModalProps) {
  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>¡Upps! 😢</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
              <Text style={styles.buttonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "#1f2937",
    borderRadius: 8,
    padding: 24,
    width: 320,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F87171",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    color: "white",
    marginBottom: 24,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#4B5563",
    borderRadius: 6,
    marginRight: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#2563EB",
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
});