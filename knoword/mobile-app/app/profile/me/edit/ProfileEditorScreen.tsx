import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Alert,
    ScrollView,
    StyleSheet,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar } from "../../../../components/ui/userProfile/Avatar";
import { profileSchema } from "../../../../../shared-core/src/validators/users/index";
import { getMe, updateUserData } from "../../../../../shared-core/src/services/users/userServices";
import { User } from "../../../../../shared-core/src/types/users/user";
import client from "../../../lib/axios";
import ErrorMessageScreen from "../../../../components/shared/ErrorMessageScreen";

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

    const {
        handleSubmit,
        formState: { isDirty },
        setValue,
        getValues,
        reset,
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
        Alert.alert("Subir imagen", "Implementa expo-image-picker aquí");
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true);
        const updatedData = { ...data, avatar: getValues("avatar") };
        try {
            const updated = await updateUserData(client, updatedData);
            setUser(updated.user);
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Perfil</Text>

            <View style={styles.avatarSection}>
                <Avatar src={avatarPreview || "/default-avatar.jpeg"} size="lg" editable={isEditing} />
                {isEditing && (
                    <View style={styles.uploadSection}>
                        <TouchableOpacity
                            onPress={handleImageUpload}
                            disabled={isSubmitting}
                            style={styles.uploadButton}
                        >
                            <Text style={styles.uploadText}>
                                {isSubmitting ? "Subiendo..." : "Subir nueva imagen"}
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
                {renderField("Nombre Completo", "realName", user?.realName)}
                {renderField("Correo Electrónico", "email", user?.email)}
                {renderField("Nombre de usuario", "username", user?.username)}
                {renderField("Biografía", "bio", user?.bio ?? "", true)}

                {isEditing && (
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            disabled={!isDirty || isSubmitting}
                            style={[
                                styles.saveButton,
                                (!isDirty || isSubmitting) && styles.disabledButton,
                            ]}
                        >
                            <Text style={styles.saveText}>
                                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <Modal visible={isOpen} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Perfil Actualizado Con Éxito 🎉</Text>
                        <Text style={styles.modalText}>
                            Tu información de perfil se ha actualizado correctamente.
                        </Text>
                        <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Entendido, gracias</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );

    function renderField(
        label: string,
        key: keyof ProfileFormData,
        value?: string,
        multiline = false
    ) {
        return (
            <View style={styles.field}>
                <Text style={styles.label}>{label}</Text>
                {isEditing ? (
                    <TextInput
                        placeholder={label}
                        placeholderTextColor="#9CA3AF"
                        onChangeText={(text) => setValue(key, text, { shouldDirty: true })}
                        defaultValue={value}
                        multiline={multiline}
                        numberOfLines={multiline ? 4 : 1}
                        style={styles.input}
                    />
                ) : (
                    <Text style={styles.value}>{value}</Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: "#000",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 24,
    },
    avatarSection: {
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#374151",
        paddingBottom: 24,
        marginBottom: 24,
    },
    uploadSection: {
        marginTop: 16,
        alignItems: "center",
    },
    uploadButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    uploadText: {
        color: "#fff",
        fontWeight: "500",
    },
    hint: {
        color: "#9CA3AF",
        fontSize: 12,
        marginTop: 12,
        textAlign: "center",
    },
    error: {
        color: "#EF4444",
        marginTop: 8,
        fontSize: 14,
    },
    form: {
        marginBottom: 32,
    },
    field: {
        marginBottom: 16,
    },
    label: {
        color: "#9CA3AF",
        fontSize: 14,
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#1F2937",
        color: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#4B5563",
    },
    value: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    buttonRow: {
        marginTop: 24,
        alignItems: "flex-end",
    },
    saveButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: "#4B5563",
    },
    saveText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
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
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    modalButtonText: {
        color: "#fff",
        fontWeight: "500",
    },
});