import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar } from "../../../../components/ui/userProfile/Avatar";
import { profileSchema } from "../../../../../shared-core/src/validators/users/index";
import { getMe, updateUserData } from "../../../../../shared-core/src/services/users/userServices";
import { User } from "../../../../../shared-core/src/types/users/user";
import { uploadToCloudinary } from "../../../../../shared-core/src/services/cloudinary/upload";
import client from "../../../lib/axios";
import ErrorMessageScreen from "../../../../components/shared/ErrorMessageScreen";
import BottomTabs from "../../../../src/components/profile/BottomTabs";

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [errorFetchingProfile, setErrorFetchingProfile] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    setValue,
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getMe(client);
        setUser(response.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setErrorFetchingProfile("No pudimos cargar tu perfil. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      reset({
        realName: user.realName || "",
        email: user.email || "",
        username: user.username || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user, reset]);

  const handleImageUpload = async () => {
    setIsUploadingImage(true);
    setSubmissionError(null);

    try {
      const cloudinaryResult = await uploadToCloudinary();
      const uploadedUrl = cloudinaryResult.secure_url;

      setAvatarPreview(uploadedUrl);
      setValue("avatar", uploadedUrl, { shouldDirty: true, shouldValidate: true });
    } catch (error: any) {
      console.error("Error subiendo imagen:", error);
      if (error.message !== "Selección cancelada") {
        setSubmissionError("No se pudo subir la imagen. Inténtalo de nuevo.");
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    const updatedData = { 
      realName: data.realName,
      email: data.email,
      username: data.username,
      bio: data.bio,
      avatar: avatarPreview || data.avatar || user?.avatar || ""
    };
    
    try {
      const updated = await updateUserData(client, updatedData);
      
      setUser(updated.user);
      setAvatarPreview(updated.user.avatar || null);
      
      reset({
        realName: updated.user.realName || "",
        email: updated.user.email || "",
        username: updated.user.username || "",
        bio: updated.user.bio || "",
        avatar: updated.user.avatar || "",
      });
      
      setIsEditing(false);
      setIsOpen(true);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setSubmissionError("No se pudo actualizar el perfil. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (errorFetchingProfile) {
    return <ErrorMessageScreen error={errorFetchingProfile} />;
  }

  function renderField(
    label: string,
    name: keyof ProfileFormData,
    multiline = false
  ) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={label}
                placeholderTextColor="#9CA3AF"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                style={[styles.input, multiline && styles.textArea]}
                textAlignVertical={multiline ? "top" : "center"}
              />
            )}
          />
        ) : (
          <Text style={styles.value}>{watch(name) || "No especificado"}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <KeyboardAvoidingView 
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>{isEditing ? "Editar Perfil" : "Perfil"}</Text>
            {!isEditing ? (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.editButton}>Editar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  reset();
                  setAvatarPreview(user?.avatar || null);
                  setIsEditing(false);
                  setSubmissionError(null);
                }}
              >
                <Text style={styles.cancelButton}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.avatarSection}>
            {isUploadingImage ? (
              <View style={styles.avatarLoading}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.uploadingText}>Subiendo imagen...</Text>
              </View>
            ) : (
              <Avatar
                src={avatarPreview || user?.avatar || ""}
                size="lg"
                editable={isEditing}
              />
            )}
            
            {isEditing && (
              <View style={styles.uploadSection}>
                <TouchableOpacity
                  onPress={handleImageUpload}
                  disabled={isSubmitting || isUploadingImage}
                  style={[
                    styles.uploadButton,
                    (isSubmitting || isUploadingImage) && styles.uploadButtonDisabled
                  ]}
                >
                  <Text style={styles.uploadText}>
                    {isUploadingImage ? "Subiendo..." : "Subir nueva imagen"}
                  </Text>
                </TouchableOpacity>
                {submissionError && <Text style={styles.error}>{submissionError}</Text>}
                <Text style={styles.hint}>
                  Recomendamos una imagen de al menos 800×800 pixeles.{"\n"}Formato JPG o PNG
                </Text>
              </View>
            )}
          </View>

          <View style={styles.form}>
            {renderField("Nombre Completo", "realName")}
            {renderField("Correo Electrónico", "email")}
            {renderField("Nombre de usuario", "username")}
            {renderField("Biografía", "bio", true)}

            {isEditing && (
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={!isDirty || isSubmitting || isUploadingImage}
                style={[
                  styles.saveButton,
                  (!isDirty || isSubmitting || isUploadingImage) && styles.disabledButton,
                ]}
              >
                <Text style={styles.saveText}>
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomTabs />

      <Modal visible={isOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Perfil Actualizado Con Éxito 🎉</Text>
            <Text style={styles.modalText}>
              Tu información de perfil se ha actualizado correctamente.
            </Text>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Entendido, gracias</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    padding: 24,
    paddingBottom: 120,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  editButton: {
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 16,
  },
  avatarSection: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    paddingBottom: 32,
    marginBottom: 32,
  },
  avatarLoading: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingText: {
    color: "#9CA3AF",
    marginTop: 8,
    fontSize: 14,
  },
  uploadSection: {
    marginTop: 20,
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  uploadButtonDisabled: {
    backgroundColor: "#4B5563",
    opacity: 0.5,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  hint: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  error: {
    color: "#EF4444",
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
  form: {
    marginBottom: 32,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    color: "#9CA3AF",
    fontSize: 15,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#1F2937",
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4B5563",
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
  },
  saveButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: "#4B5563",
    opacity: 0.5,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#1F2937",
    borderRadius: 16,
    padding: 24,
    width: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});