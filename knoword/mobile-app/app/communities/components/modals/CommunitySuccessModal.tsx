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

interface CommunitySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  communityId?: string;
}

export default function CommunitySuccessModal({
  isOpen,
  onClose,
  message,
  communityId,
}: CommunitySuccessModalProps) {
  const router = useRouter();

  const handleGoToCommunity = () => {
    if (communityId) {
      router.push(`/communities/community/${communityId}` as any);
    }
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>✅ Comunidad Creada</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.bodyText}>
              {message || "Tu comunidad ha sido creada exitosamente."}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.buttonBlue}>
              <Text style={styles.buttonText}>OK, lo he entendido</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGoToCommunity} style={styles.buttonPurple}>
              <Text style={styles.buttonText}>Muéstrame mi comunidad</Text>
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
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#374151",
    width: 320,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34d399",
    textAlign: "center",
  },
  body: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  bodyText: {
    color: "#d1d5db",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "column",
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: "rgba(31,41,55,0.5)",
    borderTopWidth: 1,
    borderColor: "#374151",
  },
  buttonBlue: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonPurple: {
    backgroundColor: "#7c3aed",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },
});