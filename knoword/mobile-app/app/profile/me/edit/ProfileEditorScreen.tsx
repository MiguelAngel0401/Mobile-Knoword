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
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar } from "../../../../components/ui/userProfile/Avatar";
import { Pencil } from "lucide-react-native";
import { profileSchema } from "../../../../../shared-core/src/validators/users/index";
import { uploadToCloudinary } from "../../../../../shared-core/src/services/cloudinary/cloudinaryService";
import { getMe, updateUserData } from "../../../../../shared-core/src/services/users/userServices";
import { User } from "../../../../../shared-core/src/types/users/user";
import client from "../../../lib/axios";
import ErrorMessageScreen from "../../../../components/shared/ErrorMessageScreen";

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileEditor() {
    const [loading, setLoading] = useState(false);
    const [errorFetchingProfile, setErrorFetchingProfile] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Modal confirmación
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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

    const handleEditClick = () => {
        if (isEditing && user) {
            reset({
                realName: user.realName || "",
                email: user.email || "",
                username: user.username || "",
                bio: user.bio || "",
                avatar: user.avatar || "",
            });
            setAvatarPreview(user.avatar || null);
            setSubmissionError(null);
        }
        setIsEditing((prev) => !prev);
    };

    const handleImageUpload = async () => {
        // Aquí deberías usar expo-image-picker en mobile
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
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (errorFetchingProfile) {
        return <ErrorMessageScreen error={errorFetchingProfile} />;
    }

    return (
        <ScrollView className="flex-1 bg-black px-6 py-8">
            <Text className="text-2xl font-semibold text-white mb-6">Editar Perfil</Text>

            {/* Avatar */}
            <View className="flex-col items-center border-b border-gray-700 pb-6 mb-6">
                <Avatar src={avatarPreview || "/default-avatar.jpeg"} size="lg" editable={isEditing} />
                {isEditing && (
                    <View className="mt-4 items-center">
                        <TouchableOpacity
                            onPress={handleImageUpload}
                            disabled={isUploadingAvatar}
                            className="px-4 py-2 bg-blue-600 rounded-lg"
                        >
                            <Text className="text-white font-medium">
                                {isUploadingAvatar ? "Subiendo..." : "Subir nueva imagen"}
                            </Text>
                        </TouchableOpacity>
                        {submissionError && <Text className="text-red-500 mt-2">{submissionError}</Text>}
                        <Text className="text-gray-400 text-xs mt-4 text-center">
                            Recomendamos una imagen de al menos 800×800 pixeles.{"\n"}Formato JPG o PNG
                        </Text>
                    </View>
                )}
            </View>
            {/* Formulario */}
            <View>
                {/* Nombre */}
                <View className="mb-4">
                    <Text className="text-gray-400 text-sm mb-2">Nombre Completo</Text>
                    {isEditing ? (
                        <TextInput
                            placeholder="Nombre completo"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={(text) => setValue("realName", text, { shouldDirty: true })}
                            defaultValue={user?.realName}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md text-white"
                        />
                    ) : (
                        <Text className="font-medium text-white">{user?.realName}</Text>
                    )}
                </View>

                {/* Email */}
                <View className="mb-4">
                    <Text className="text-gray-400 text-sm mb-2">Correo Electrónico</Text>
                    {isEditing ? (
                        <TextInput
                            placeholder="Correo electrónico"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={(text) => setValue("email", text, { shouldDirty: true })}
                            defaultValue={user?.email}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md text-white"
                        />
                    ) : (
                        <Text className="font-medium text-white">{user?.email}</Text>
                    )}
                </View>

                {/* Username */}
                <View className="mb-4">
                    <Text className="text-gray-400 text-sm mb-2">Nombre de usuario</Text>
                    {isEditing ? (
                        <TextInput
                            placeholder="Usuario"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={(text) => setValue("username", text, { shouldDirty: true })}
                            defaultValue={user?.username}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md text-white"
                        />
                    ) : (
                        <Text className="font-medium text-white">{user?.username}</Text>
                    )}
                </View>

                {/* Bio */}
                <View className="mb-4">
                    <Text className="text-lg font-semibold text-white mb-2">Biografía</Text>
                    {isEditing ? (
                        <TextInput
                            multiline
                            numberOfLines={4}
                            placeholder="Escribe tu biografía"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={(text) => setValue("bio", text, { shouldDirty: true })}
                            defaultValue={user?.bio ?? ""}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md text-white"
                        />
                    ) : (
                        <Text className="font-medium text-white">{user?.bio}</Text>
                    )}
                </View>

                {/* Botón Guardar */}
                {isEditing && (
                    <View className="mt-6 flex-row justify-end">
                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            disabled={!isDirty || isSubmitting}
                            className={`px-6 py-2 rounded-lg ${!isDirty || isSubmitting
                                    ? "bg-gray-600"
                                    : "bg-blue-600"
                                }`}
                        >
                            <Text className="text-white font-semibold">
                                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Modal de confirmación */}
            <Modal visible={isOpen} transparent animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <View className="bg-gray-900 rounded-2xl p-6 w-80">
                        <Text className="text-lg font-medium text-white mb-2">
                            Perfil Actualizado Con Éxito 🎉
                        </Text>
                        <Text className="text-sm text-gray-400 mb-4">
                            Tu información de perfil se ha actualizado correctamente.
                        </Text>
                        <TouchableOpacity
                            onPress={() => setIsOpen(false)}
                            className="px-4 py-2 bg-blue-600 rounded-md"
                        >
                            <Text className="text-white font-medium">Entendido, gracias</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}