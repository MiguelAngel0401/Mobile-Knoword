import { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
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
import { uploadToCloudinary } from "@shared/services/cloudinary/cloudinaryService";
import { Community, Tag, CommunityUpdateData,} from "../../../../../../shared-core/src/types/community";
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

    // ✅ Cargar comunidad
    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const data = await getCommunityById(idCommunity); // idCommunity es string
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

    // ✅ Tags
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

    // ✅ Upload imágenes
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
                const uri = result.assets[0].uri;
                const uploadedUrl = await uploadToCloudinary(uri);

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
    // ✅ Submit
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
      tags: selectedTags.map((tagName) => ({
        id: "", // relleno si el backend lo ignora
        name: tagName,
        createdAt: "", // relleno si el backend lo ignora
      })),
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

    // ✅ Handlers para modales
    const handleCloseSuccessModal = () => setIsSubmitCorrect(false);
    const handleCloseErrorModal = () => setSubmissionError(null);

    // ✅ Render
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (error) {
        return <ErrorMessageScreen error={error} />;
    }

    return (
        <ScrollView className="flex-1 bg-black px-4 pt-6">
            <Text className="text-white text-2xl font-bold mb-6">Editar Comunidad</Text>

            {/* Nombre */}
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-4"
                        placeholder="Título de la comunidad"
                        placeholderTextColor="#888"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            {errors.name && <Text className="text-red-500 text-sm mb-2">{errors.name.message}</Text>}

            {/* Descripción */}
            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-4"
                        placeholder="Descripción"
                        placeholderTextColor="#888"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            {errors.description && <Text className="text-red-500 text-sm mb-2">{errors.description.message}</Text>}

            {/* Etiquetas */}
            <Text className="text-white font-semibold mb-2">Etiquetas</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
                {selectedTags.map((tag) => (
                    <View key={tag} className="bg-blue-700 px-3 py-1 rounded-full flex-row items-center">
                        <Text className="text-white text-sm">{tag}</Text>
                        <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                            <Text className="text-red-300 ml-2 text-lg font-bold">×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {selectedTags.length < maxTags && (
                <>
                    <TextInput
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-2"
                        placeholder="Nueva etiqueta"
                        placeholderTextColor="#888"
                        value={inputValue}
                        onChangeText={setInputValue}
                        onSubmitEditing={() => handleAddTag(inputValue)}
                    />
                    {isSearching && <Text className="text-gray-400 italic">🔍 Buscando...</Text>}
                    {suggestions.length > 0 && !isSearching && (
                        <View className="flex-row flex-wrap gap-2 mt-2">
                            {suggestions.slice(0, 5).map((suggestion) => (
                                <TouchableOpacity
                                    key={suggestion}
                                    onPress={() => handleAddTag(suggestion)}
                                    className="bg-gray-700 px-3 py-1 rounded-full"
                                >
                                    <Text className="text-white text-sm">+ {suggestion}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </>
            )}

            {tagError && <Text className="text-red-500 text-sm mt-2">{tagError}</Text>}

            {/* Imágenes */}
            <View className="mt-6 space-y-6">
                {/* Banner */}
                <TouchableOpacity
                    className="border border-dashed border-zinc-600 rounded-lg p-6 items-center justify-center"
                    onPress={() => handleImageUpload("banner")}
                    disabled={isUploadingBanner}
                >
                    {isUploadingBanner ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : bannerPreview ? (
                        <Image
                            source={{ uri: bannerPreview }}
                            className="w-full h-32 rounded-md"
                            resizeMode="cover"
                        />
                    ) : (
                        <>
                            <Text className="text-white font-bold mb-1">Sube la cabecera</Text>
                            <Text className="text-sm text-zinc-400 text-center">
                                Pulsa aquí para elegir una imagen. Tamaño recomendado: 1840 x 560 px.
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Avatar */}
                <TouchableOpacity
                    className="flex-row items-center gap-4"
                    onPress={() => handleImageUpload("avatar")}
                    disabled={isUploadingAvatar}
                >
                    <View className="w-20 h-20 border border-dashed border-zinc-600 rounded-lg bg-gray-800 items-center justify-center">
                        {isUploadingAvatar ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : avatarPreview ? (
                            <Image
                                source={{ uri: avatarPreview }}
                                className="w-full h-full rounded-md"
                                resizeMode="cover"
                            />
                        ) : (
                            <Text className="text-zinc-400 text-sm">📷</Text>
                        )}
                    </View>

                    <View className="flex-1">
                        <Text className="text-white font-semibold mb-1">Sube un avatar</Text>
                        <Text className="text-sm text-zinc-400">
                            Formato cuadrado, tamaño recomendado: 512 px.
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Acciones */}
            <View className="flex-row justify-center gap-4 mt-8 mb-12">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="px-6 py-2 bg-gray-600 rounded-lg"
                >
                    <Text className="text-white font-semibold">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid || submitting}
                    className={`px-6 py-2 rounded-lg ${submitting || !isValid ? "bg-blue-500 opacity-50" : "bg-blue-500"
                        }`}
                >
                    <Text className="text-white font-semibold">
                        {submitting ? "Guardando..." : "Guardar cambios"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Modales */}
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