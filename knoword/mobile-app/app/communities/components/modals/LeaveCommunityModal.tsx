import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { leaveCommunity } from "@shared/services/community/communityServices";

interface LeaveCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityName: string;
  communityId: string;
}

export default function LeaveCommunityModal({
  isOpen,
  onClose,
  communityName,
  communityId,
}: LeaveCommunityModalProps) {
  const router = useRouter();
  const [communityNameInput, setCommunityNameInput] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCommunityName = (name: string) => {
    const confirmed = name.trim() === communityName.trim();
    setIsConfirmed(confirmed);
    setCommunityNameInput(name);
  };

  const handleLeave = async () => {
    if (!isConfirmed || isDeleting) return;

    setIsDeleting(true);
    try {
      await leaveCommunity(Number(communityId));
      setIsDeleting(false);
      setIsDeleted(true);

      setTimeout(() => {
        onClose();
        router.push("/communities/my" as any);
      }, 3000);
    } catch (err) {
      console.error("Error al salir de la comunidad:", err);
      setIsDeleting(false);
      setError("Hubo un error al salir de la comunidad. Inténtalo de nuevo.");
    }
  };

  const handleCancel = () => {
    setCommunityNameInput("");
    setIsConfirmed(false);
    setIsDeleted(false);
    setIsDeleting(false);
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Pressable
        style={styles.overlay}
        onPress={handleCancel}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            {!isDeleted ? (
              <>
                <Text style={styles.warningText}>
                  ⚠️ ¡Advertencia!
                </Text>
                <Text style={styles.title}>
                  ¿Deseas salir de esta comunidad?
                </Text>
              </>
            ) : (
              <Text style={styles.successTitle}>
                ✅ Has salido de la comunidad con éxito
              </Text>
            )}
          </View>

          <View style={styles.content}>
            {!isDeleted ? (
              <>
                <Text style={styles.description}>
                  Estás a punto de abandonar la comunidad{" "}
                  <Text style={styles.communityName}>{communityName}</Text>.{" "}
                  Tus publicaciones y comentarios permanecerán visibles, pero ya no
                  podrás participar dentro de la comunidad.
                </Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder={`Escribe "${communityName}"`}
                    placeholderTextColor="#888"
                    value={communityNameInput}
                    onChangeText={validateCommunityName}
                    editable={!isDeleting}
                    style={[
                      styles.input,
                      isConfirmed && styles.inputSuccess,
                      communityNameInput && !isConfirmed && styles.inputError,
                    ]}
                  />
                  {isConfirmed && (
                    <Text style={styles.checkmark}>✅</Text>
                  )}
                </View>

                {communityNameInput && !isConfirmed && (
                  <Text style={styles.validationError}>
                    El nombre no coincide. Revisa mayúsculas y espacios.
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.deletedMessage}>
                Has salido de la comunidad{" "}
                <Text style={styles.communityNameBold}>{communityName}</Text>{" "}
                correctamente.
              </Text>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <View style={styles.footer}>
            {!isDeleted ? (
              <>
                <TouchableOpacity
                  onPress={handleCancel}
                  disabled={isDeleting}
                  style={[styles.cancelButton, isDeleting && styles.buttonDisabled]}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLeave}
                  disabled={!isConfirmed || isDeleting}
                  style={[
                    styles.leaveButton,
                    (!isConfirmed || isDeleting) && styles.leaveButtonDisabled
                  ]}
                >
                  <Text style={styles.buttonText}>
                    {isDeleting ? "Saliendo..." : "Salir de la comunidad"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.acceptButton}
              >
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
    width: 320,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  warningText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f87171',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 4,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ade80',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  description: {
    color: '#d1d5db',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  communityName: {
    fontWeight: '600',
    color: '#ffffff',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    color: '#ffffff',
    backgroundColor: '#1f2937',
    borderColor: '#4b5563',
  },
  inputSuccess: {
    backgroundColor: 'rgba(6, 78, 59, 0.3)',
    borderColor: '#16a34a',
  },
  inputError: {
    backgroundColor: 'rgba(127, 29, 29, 0.2)',
    borderColor: '#dc2626',
  },
  checkmark: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
    color: '#22c55e',
    fontSize: 18,
  },
  validationError: {
    color: '#f87171',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  deletedMessage: {
    color: '#e5e7eb',
    textAlign: 'center',
    fontSize: 14,
  },
  communityNameBold: {
    fontWeight: '600',
  },
  errorText: {
    color: '#f87171',
    fontSize: 16,
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#374151',
    borderRadius: 8,
    marginBottom: 12,
  },
  leaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#dc2626',
  },
  leaveButtonDisabled: {
    backgroundColor: '#7f1d1d',
    opacity: 0.6,
  },
  acceptButton: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
});