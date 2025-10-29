import React, { useEffect } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";

interface JoinSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityName: string;
}

export default function JoinSuccessModal({
  isOpen,
  onClose,
  communityName,
}: JoinSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✓</Text>
          </View>

          <Text style={styles.title}>
            ¡Éxito!
          </Text>

          <Text style={styles.message}>
            Ahora eres miembro de{" "}
            <Text style={styles.communityName}>{communityName}</Text>.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    width: '100%',
    maxWidth: 384,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#064e3b',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    color: '#6ee7b7',
    fontSize: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  message: {
    color: '#d1d5db',
    textAlign: 'center',
  },
  communityName: {
    fontWeight: '600',
  },
});