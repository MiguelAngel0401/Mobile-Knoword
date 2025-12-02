import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash/debounce";
import { Image as ImageIcon } from "lucide-react-native";

import { createCommunitySchema } from "../../../../../../shared-core/src/validators/community/createCommunity";
import {
    getCommunityById,
    updateCommunity,
    getTagRecommendations,
} from "@shared/services/community/communityServices";
import { uploadToCloudinary } from "../../../../../../shared-core/src/services/cloudinary/upload";
import CommunitySuccessModal from "../../../components/modals/CommunitySuccessModal";
import CommunityErrorModal from "../../../components/modals/CommuntyErrorModal";
import BottomTabs from "../../../../../src/components/profile/BottomTabs";
import { styles } from "./styles";

type EditCommunityPageData = z.infer<typeof createCommunitySchema>;

export default function EditCommunityScreen() {
    const { idCommunity } = useLocalSearchParams<{ idCommunity: string }>();
    const router = useRouter();

    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitCorrect, setIsSubmitCorrect] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [tagError, setTagError] = useState<string | null>(null);
    const maxTags = 5;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<EditCommunityPageData>({
        resolver: zodResolver(createCommunitySchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            description: "",
            banner: undefined,
            avatar: undefined,
            isPrivate: false,
            tags: [],
        },
    });

    useEffect(() => {
        register("name");
        register("description");
        register("banner");
        register("avatar");
        register("isPrivate");
        register("tags");
    }, [register]);

    const name = watch("name");
    const description = watch("description");
    const isPrivate = watch("isPrivate");
    const tags = watch("tags");
    const isFormValid =
        name.trim().length >= 4 &&
        description.trim().length >= 10 &&
        tags.length >= 3 &&
        !isUploadingBanner &&
        !isUploadingAvatar;

    // Cargar datos de la comunidad
    useEffect(() => {
        const loadCommunity = async () => {
            if (!idCommunity) return;

            try {
                setIsLoading(true);
                const data = await getCommunityById(idCommunity);

                setValue("name", data.name);
                setValue("description", data.description);
                setValue("isPrivate", data.isPrivate || false);

                const tagNames = data.tags.map((tag: any) => tag.name.toLowerCase());
                setValue("tags", tagNames);

                if (data.banner) {
                    setBannerPreview(data.banner);
                    setValue("banner", data.banner);
                }
                if (data.avatar) {
                    setAvatarPreview(data.avatar);
                    setValue("avatar", data.avatar);
                }
            } catch (error) {
                console.error("Error cargando comunidad:", error);
                setSubmissionError("No se pudo cargar la comunidad");
            } finally {
                setIsLoading(false);
            }
        };

        loadCommunity();
    }, [idCommunity]);

    const fetchTagSuggestions = useCallback(
        debounce(async (query: string) => {
            if (query.length < 3) {
                setSuggestions([]);
                setIsSearching(false);
                return;
            }
            setIsSearching(true);
            try {
                const response = await getTagRecommendations(query);
                const newSuggestions = response
                    .filter((s) => !tags.includes(s.name.toLowerCase()))
                    .map((s) => s.name);
                setSuggestions(newSuggestions);
            } catch (error) {
                console.error("Error fetching tag suggestions:", error);
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 800),
        [tags]
    );

    useEffect(() => {
        if (inputValue.trim().length >= 3) {
            fetchTagSuggestions(inputValue);
        } else {
            setSuggestions([]);
            setIsSearching(false);
        }
        return () => {
            fetchTagSuggestions.cancel();
        };
    }, [inputValue, fetchTagSuggestions]);

    const handleAddTag = (tag: string) => {
        const newTag = tag.trim().toLowerCase();

        if (!newTag) return;

        if (newTag.length < 3) {
            setTagError("Cada etiqueta debe tener al menos 3 caracteres.");
            setTimeout(() => setTagError(null), 3000);
            return;
        }

        if (tags.length >= maxTags) {
            setTagError(`Máximo ${maxTags} etiquetas permitidas.`);
            setTimeout(() => setTagError(null), 3000);
            return;
        }

        if (tags.includes(newTag)) {
            setTagError("Esta etiqueta ya ha sido agregada.");
            setTimeout(() => setTagError(null), 3000);
            return;
        }

        setValue("tags", [...tags, newTag], { shouldValidate: true });
        setInputValue("");
        setSuggestions([]);
        setTagError(null);
    };

    const handleTagRemove = (tagToRemove: string) => {
        setValue(
            "tags",
            tags.filter((t) => t !== tagToRemove),
            { shouldValidate: true }
        );
    };

    const openSystemImagePicker = async (type: "banner" | "avatar") => {
        const setPreview = type === "banner" ? setBannerPreview : setAvatarPreview;
        const setIsLoadingState = type === "banner" ? setIsUploadingBanner : setIsUploadingAvatar;

        try {
            setIsLoadingState(true);
            setSubmissionError(null);

            const cloudinaryResult = await uploadToCloudinary();
            const cloudinaryUrl = cloudinaryResult.secure_url;

            setPreview(cloudinaryUrl);
            setValue(type, cloudinaryUrl, { shouldValidate: true });
        } catch (error: any) {
            if (error.message === "USER_CANCELED") {
                console.log("Usuario canceló la selección de imagen");
                return;
            }

            console.error(`Error al subir la imagen de ${type}:`, error);
            setSubmissionError(`No se pudo subir la imagen de ${type}. Inténtalo de nuevo.`);
            setPreview(null);
            setValue(type, undefined, { shouldValidate: true });
        } finally {
            setIsLoadingState(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setIsSubmitCorrect(false);
        router.push(`/communities/community/${idCommunity}`);
    };

    const handleCloseErrorModal = () => {
        setSubmissionError(null);
        setIsSubmitting(false);
    };

    async function submitEditCommunityForm(data: EditCommunityPageData) {
        setIsSubmitting(true);
        setSubmissionError(null);

        try {
            const communityId = Number(idCommunity);
            if (isNaN(communityId)) {
                throw new Error("ID de comunidad inválido");
            }

            const payload: any = {
                name: data.name,
                description: data.description,
                isPrivate: data.isPrivate,
                tags: data.tags,
            };

            if (data.banner) payload.banner = data.banner;
            if (data.avatar) payload.avatar = data.avatar;

            await updateCommunity(communityId, payload);
            setIsSubmitCorrect(true);
        } catch (error: any) {
            console.error("Error al actualizar comunidad:", error);
            setSubmissionError(
                error.response?.data?.message ||
                error.message ||
                "Error al actualizar la comunidad. Por favor, inténtalo de nuevo."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7c3aed" />
                <Text style={styles.loadingText}>Cargando comunidad...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>Editar Comunidad</Text>

                    {/* Información básica */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Información de la comunidad</Text>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Título de la comunidad</Text>
                            <TextInput
                                placeholder="Ej. Matemáticas y física"
                                placeholderTextColor="#9CA3AF"
                                value={name}
                                onChangeText={(v) => {
                                    setValue("name", v, { shouldValidate: true });
                                }}
                                style={[styles.input, errors.name && styles.inputError]}
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Descripción de la comunidad</Text>
                            <TextInput
                                placeholder="Ej. Un lugar para discutir y aprender sobre matemáticas y física."
                                placeholderTextColor="#9CA3AF"
                                value={description}
                                multiline
                                numberOfLines={4}
                                onChangeText={(v) => {
                                    setValue("description", v, { shouldValidate: true });
                                }}
                                style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                            />
                            {errors.description && (
                                <Text style={styles.errorText}>{errors.description.message}</Text>
                            )}
                        </View>

                        <View style={styles.privacyContainer}>
                            <View style={styles.privacyHeader}>
                                <Text style={styles.label}>Privacidad de la comunidad</Text>
                                <TouchableOpacity
                                    onPress={() => setValue("isPrivate", !isPrivate, { shouldValidate: true })}
                                    style={[styles.toggle, isPrivate ? styles.toggleActive : styles.toggleInactive]}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.toggleThumb, isPrivate && styles.toggleThumbActive]} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.privacyInfo}>
                                {isPrivate ? (
                                    <Text style={styles.privacyTextPrivate}>
                                        Privada: Solo invitados pueden unirse
                                    </Text>
                                ) : (
                                    <Text style={styles.privacyTextPublic}>Pública: Cualquiera puede unirse</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Etiquetas */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Etiquetas</Text>
                        <Text style={styles.sectionDescription}>
                            Agrega al menos 3 etiquetas para ayudar a otros a encontrar tu comunidad.
                        </Text>

                        <View style={styles.tagsInputWrapper}>
                            <TextInput
                                placeholder="Escribe una etiqueta"
                                placeholderTextColor="#9CA3AF"
                                value={inputValue}
                                onChangeText={(text) => {
                                    setInputValue(text);
                                    setTagError(null);
                                }}
                                onSubmitEditing={() => {
                                    const trimmed = inputValue.trim();
                                    if (trimmed) {
                                        handleAddTag(trimmed);
                                    }
                                }}
                                returnKeyType="done"
                                blurOnSubmit={false}
                                style={styles.input}
                            />
                            {tagError && <Text style={styles.errorText}>{tagError}</Text>}
                            {errors.tags && <Text style={styles.errorText}>{errors.tags.message}</Text>}

                            {tags.length > 0 && (
                                <Text style={styles.tagCount}>
                                    {tags.length} de {maxTags} etiquetas
                                </Text>
                            )}
                        </View>

                        {isSearching && (
                            <View style={styles.searchingContainer}>
                                <ActivityIndicator color="#7c3aed" size="small" />
                                <Text style={styles.searchingText}>Buscando...</Text>
                            </View>
                        )}

                        {!isSearching && suggestions.length > 0 && (
                            <View style={styles.suggestionsContainer}>
                                <Text style={styles.suggestionsTitle}>Sugerencias:</Text>
                                <View style={styles.suggestionsWrapper}>
                                    {suggestions.slice(0, 8).map((tag) => (
                                        <TouchableOpacity
                                            key={tag}
                                            onPress={() => handleAddTag(tag)}
                                            style={styles.suggestion}
                                        >
                                            <Text style={styles.suggestionText}>{tag}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {tags.length > 0 && (
                            <View style={styles.selectedTagsContainer}>
                                {tags.map((tag) => (
                                    <View key={tag} style={styles.selectedTag}>
                                        <Text style={styles.selectedTagText}>{tag}</Text>
                                        <TouchableOpacity onPress={() => handleTagRemove(tag)}>
                                            <Text style={styles.removeTag}>✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Imágenes */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Imagen de cabecera</Text>
                        <Text style={styles.sectionDescription}>Recomendado: 1200 x 400 px (opcional)</Text>

                        <TouchableOpacity
                            onPress={() => openSystemImagePicker("banner")}
                            activeOpacity={0.8}
                            style={styles.bannerUpload}
                        >
                            {isUploadingBanner && (
                                <View style={styles.uploadingOverlay}>
                                    <ActivityIndicator color="#fff" size="large" />
                                    <Text style={styles.uploadingText}>Subiendo...</Text>
                                </View>
                            )}

                            {bannerPreview ? (
                                <Image source={{ uri: bannerPreview }} style={styles.bannerImage} resizeMode="cover" />
                            ) : (
                                !isUploadingBanner && (
                                    <View style={styles.uploadPlaceholder}>
                                        <ImageIcon size={40} color="#52525b" />
                                        <Text style={styles.uploadPlaceholderText}>Toca para subir</Text>
                                    </View>
                                )
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Avatar de la comunidad</Text>
                        <Text style={styles.sectionDescription}>Recomendado: 512 x 512 px (opcional)</Text>

                        <TouchableOpacity
                            onPress={() => openSystemImagePicker("avatar")}
                            activeOpacity={0.8}
                            style={styles.avatarUploadContainer}
                        >
                            <View style={styles.avatarBox}>
                                {isUploadingAvatar && (
                                    <View style={styles.uploadingOverlay}>
                                        <ActivityIndicator color="#fff" />
                                    </View>
                                )}

                                {avatarPreview && !isUploadingAvatar ? (
                                    <Image source={{ uri: avatarPreview }} style={styles.avatarImage} resizeMode="cover" />
                                ) : (
                                    !isUploadingAvatar && (
                                        <View style={styles.avatarPlaceholder}>
                                            <ImageIcon size={32} color="#52525b" />
                                        </View>
                                    )
                                )}
                            </View>
                            <Text style={styles.avatarUploadText}>Toca para subir avatar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Botones de acción */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
                            disabled={!isFormValid || isSubmitting}
                            onPress={handleSubmit(submitEditCommunityForm)}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>Guardar cambios</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Info de validación */}
                    {!isFormValid && (
                        <View style={styles.validationInfo}>
                            {name.trim().length < 4 && (
                                <Text style={styles.validationText}>• Falta el título de la comunidad (mínimo 4 caracteres)</Text>
                            )}
                            {description.trim().length < 10 && (
                                <Text style={styles.validationText}>• Falta la descripción</Text>
                            )}
                            {tags.length < 3 && (
                                <Text style={styles.validationText}>• Faltan {3 - tags.length} etiqueta(s)</Text>
                            )}
                        </View>
                    )}

                    {/* Modales */}
                    <CommunitySuccessModal
                        isOpen={isSubmitCorrect}
                        onClose={handleCloseSuccessModal}
                        message="La comunidad se ha actualizado con éxito."
                        communityId={idCommunity}
                    />

                    <CommunityErrorModal
                        isOpen={!!submissionError}
                        onClose={handleCloseErrorModal}
                        message={submissionError || ""}
                    />
                </ScrollView>
            </KeyboardAvoidingView>

            <BottomTabs />
        </View>
    );
}