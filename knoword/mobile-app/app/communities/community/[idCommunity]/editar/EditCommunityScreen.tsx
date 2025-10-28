import { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
    StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { z } from "zod";
import debounce from "lodash/debounce";
import * as ImagePicker from "expo-image-picker";

import { createCommunitySchema } from "../../../../../../shared-core/src/validators/community/createCommunity";
import {
    getCommunityById,
    updateCommunity,
    getTagRecommendations,
} from "@shared/services/community/communityServices";
import { uploadToCloudinary } from "../../../../../../shared-core/src/services/cloudinary/upload";
import { Community, Tag, CommunityUpdateData, } from "../../../../../../shared-core/src/types/community";
import ErrorMessageScreen from "../../../../../components/shared/ErrorMessageScreen";
import CommunitySuccessModal from "../../../components/modals/CommunitySuccessModal";
import CommunityErrorModal from "../../../components/modals/CommuntyErrorModal";


type FormData = z.infer<typeof createCommunitySchema>;

export default function EditCommunityScreen() {
    const { idCommunity } = useLocalSearchParams<{ idCommunity: string }>();
    const router = useRouter();

    const [community, setCommunity] = useState<Community | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isSubmitCorrect, setIsSubmitCorrect] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tagError, setTagError] = useState<string | null>(null);
    const maxTags = 5;

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(createCommunitySchema),
        mode: "onBlur",
    });

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const data = await getCommunityById(idCommunity);
                setCommunity(data);
                setValue("name", data.name);
                setValue("description", data.description);
                if (data.banner) {
                    setBannerPreview(data.banner);
                    setValue("banner", data.banner);
                }
                if (data.avatar) {
                    setAvatarPreview(data.avatar);
                    setValue("avatar", data.avatar);
                }
                setSelectedTags(data.tags.map((tag: Tag) => tag.name.toLowerCase()));
            } catch (err) {
                setError("No se pudo cargar la comunidad.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (idCommunity) fetchCommunity();
    }, [idCommunity]);

    const handleAddTag = (tag: string) => {
        const newTag = tag.trim().toLowerCase();
        if (!newTag) return;
        if (selectedTags.includes(newTag)) {
            setTagError("La etiqueta ya está seleccionada.");
            return;
        }
        if (selectedTags.length >= maxTags) {
            setTagError(`Solo puedes agregar hasta ${maxTags} etiquetas.`);
            return;
        }
        setSelectedTags((prev) => [...prev, newTag]);
        setInputValue("");
        setSuggestions([]);
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    };

    const fetchTagSuggestions = useCallback(
        debounce(async (query: string) => {
            setTagError(null);
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }
            setIsSearching(true);
            try {
                const response = await getTagRecommendations(query) as Tag[];
                const newSuggestions = response
                    .filter((s) => !selectedTags.includes(s.name.toLowerCase()))
                    .map((s) => s.name);
                setSuggestions(newSuggestions);
            } catch (err) {
                console.error(err);
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 300),
        [selectedTags]
    );

    useEffect(() => {
        fetchTagSuggestions(inputValue);
        return () => {
            fetchTagSuggestions.cancel();
        };
    }, [inputValue]);

    const handleImageUpload = async (type: "banner" | "avatar") => {
        try {
            if (type === "banner") setIsUploadingBanner(true);
            if (type === "avatar") setIsUploadingAvatar(true);

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.9,
            });

            if (!result.canceled) {
                const result = await uploadToCloudinary();
                const uploadedUrl = result.secure_url;

                if (type === "banner") {
                    setBannerPreview(uploadedUrl);
                    setValue("banner", uploadedUrl);
                } else {
                    setAvatarPreview(uploadedUrl);
                    setValue("avatar", uploadedUrl);
                }
            }
        } catch (err) {
            console.error("Error subiendo imagen", err);
        } finally {
            if (type === "banner") setIsUploadingBanner(false);
            if (type === "avatar") setIsUploadingAvatar(false);
        }
    };

    const onSubmit = async (values: FormData) => {
        try {
            setSubmitting(true);
            setSubmissionError(null);

            const id = Number(community?.id ?? idCommunity);
            if (Number.isNaN(id)) {
                setSubmissionError("ID de comunidad inválido");
                return;
            }

            const payload: CommunityUpdateData = {
                ...values,
                tags: selectedTags,
            };

            await updateCommunity(id, payload);
            setIsSubmitCorrect(true);
        } catch (err) {
            console.error(err);
            setSubmissionError("No se pudo actualizar la comunidad.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseSuccessModal = () => setIsSubmitCorrect(false);
    const handleCloseErrorModal = () => setSubmissionError(null);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (error) {
        return <ErrorMessageScreen error={error} />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Editar Comunidad</Text>

            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Título de la comunidad"
                        placeholderTextColor="#888"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Descripción"
                        placeholderTextColor="#888"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

            <Text style={styles.sectionTitle}>Etiquetas</Text>
            <View style={styles.tagsContainer}>
                {selectedTags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                        <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                            <Text style={styles.tagRemove}>×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {selectedTags.length < maxTags && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Nueva etiqueta"
                        placeholderTextColor="#888"
                        value={inputValue}
                        onChangeText={setInputValue}
                        onSubmitEditing={() => handleAddTag(inputValue)}
                    />
                    {isSearching && <Text style={styles.searchingText}>🔍 Buscando...</Text>}
                    {suggestions.length > 0 && !isSearching && (
                        <View style={styles.suggestionsContainer}>
                            {suggestions.slice(0, 5).map((suggestion) => (
                                <TouchableOpacity
                                    key={suggestion}
                                    onPress={() => handleAddTag(suggestion)}
                                    style={styles.suggestion}
                                >
                                    <Text style={styles.suggestionText}>+ {suggestion}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </>
            )}

            {tagError && <Text style={styles.tagErrorText}>{tagError}</Text>}

            <View style={styles.imagesSection}>
                <TouchableOpacity
                    style={styles.bannerUpload}
                    onPress={() => handleImageUpload("banner")}
                    disabled={isUploadingBanner}
                >
                    {isUploadingBanner ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : bannerPreview ? (
                        <Image
                            source={{ uri: bannerPreview }}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <>
                            <Text style={styles.uploadTitle}>Sube la cabecera</Text>
                            <Text style={styles.uploadDescription}>
                                Pulsa aquí para elegir una imagen. Tamaño recomendado: 1840 x 560 px.
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.avatarUpload}
                    onPress={() => handleImageUpload("avatar")}
                    disabled={isUploadingAvatar}
                >
                    <View style={styles.avatarBox}>
                        {isUploadingAvatar ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : avatarPreview ? (
                            <Image
                                source={{ uri: avatarPreview }}
                                style={styles.avatarImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <Text style={styles.avatarPlaceholder}>📷</Text>
                        )}
                    </View>

                    <View style={styles.avatarInfo}>
                        <Text style={styles.avatarTitle}>Sube un avatar</Text>
                        <Text style={styles.avatarDescription}>
                            Formato cuadrado, tamaño recomendado: 512 px.
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.cancelButton}
                >
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid || submitting}
                    style={[
                        styles.submitButton,
                        (!isValid || submitting) && styles.submitButtonDisabled
                    ]}
                >
                    <Text style={styles.buttonText}>
                        {submitting ? "Guardando..." : "Guardar cambios"}
                    </Text>
                </TouchableOpacity>
            </View>

            <CommunitySuccessModal
                isOpen={isSubmitCorrect}
                onClose={handleCloseSuccessModal}
                message="La comunidad se ha actualizado correctamente."
                communityId={idCommunity}
            />

            <CommunityErrorModal
                isOpen={!!submissionError}
                onClose={handleCloseErrorModal}
                message={submissionError || undefined}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    title: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#1f2937',
        color: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        marginBottom: 8,
    },
    sectionTitle: {
        color: '#ffffff',
        fontWeight: '600',
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    tag: {
        backgroundColor: '#1d4ed8',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color: '#ffffff',
        fontSize: 14,
    },
    tagRemove: {
        color: '#fca5a5',
        marginLeft: 8,
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchingText: {
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    suggestionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    suggestion: {
        backgroundColor: '#374151',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    suggestionText: {
        color: '#ffffff',
        fontSize: 14,
    },
    tagErrorText: {
        color: '#ef4444',
        fontSize: 14,
        marginTop: 8,
    },
    imagesSection: {
        marginTop: 24,
    },
    bannerUpload: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#52525b',
        borderRadius: 8,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    bannerImage: {
        width: '100%',
        height: 128,
        borderRadius: 6,
    },
    uploadTitle: {
        color: '#ffffff',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    uploadDescription: {
        fontSize: 14,
        color: '#a1a1aa',
        textAlign: 'center',
    },
    avatarUpload: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarBox: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#52525b',
        borderRadius: 8,
        backgroundColor: '#1f2937',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
    },
    avatarPlaceholder: {
        color: '#a1a1aa',
        fontSize: 14,
    },
    avatarInfo: {
        flex: 1,
    },
    avatarTitle: {
        color: '#ffffff',
        fontWeight: '600',
        marginBottom: 4,
    },
    avatarDescription: {
        fontSize: 14,
        color: '#a1a1aa',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
        marginBottom: 48,
    },
    cancelButton: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        backgroundColor: '#4b5563',
        borderRadius: 8,
        marginRight: 16,
    },
    submitButton: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
});