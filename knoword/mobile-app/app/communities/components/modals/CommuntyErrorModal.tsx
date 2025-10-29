import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function CommunityErrorModal({
  isOpen,
  onClose,
  message,
}: ErrorModalProps) {
  const router = useRouter();

  const handleGoToCommunities = () => {
    router.push("/communities/explore" as any);
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            Ha ocurrido un error
          </Text>

          <Text style={styles.message}>
            {message || "Algo salió mal. Por favor, inténtalo de nuevo."}
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.retryButton}
            >
              <Text style={styles.buttonText}>Reintentar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoToCommunities}
              style={styles.exploreButton}
            >
              <Text style={styles.buttonText}>
                Explorar comunidades
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    padding: 24,
    width: 320,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#e5e7eb',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    marginRight: 16,
  },
  exploreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#7c3aed',
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});