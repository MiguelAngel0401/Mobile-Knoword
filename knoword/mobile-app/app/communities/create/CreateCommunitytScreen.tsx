import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash/debounce";
import { Image as ImageIcon } from "lucide-react-native";

// Importa tus propios módulos compartidos en el monorepo
import { createCommunitySchema } from "../../../../shared-core/src/validators/community/createCommunity";
import {
  createCommunity,
  getTagRecommendations,
} from "@shared/services/community/communityServices";
import { uploadToCloudinary } from "@shared/services/cloudinary/cloudinaryService";


import CommunitySuccessModal from "../components/modals/CommunitySuccessModal";
import CommunityErrorModal from "../components/modals/CommuntyErrorModal";

type CreateCommunityPageData = z.infer<typeof createCommunitySchema>;

export default function CreateCommunityScreen() {
  const router = useRouter();

  const [communityId, setCommunityId] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);

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

  const [tagError, setTagError] = useState<string | null>(null);
  const maxTags = 5;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateCommunityPageData>({
    resolver: zodResolver(createCommunitySchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
      banner: undefined,
      avatar: undefined,
    },
  });

  // Vincula inputs controlados de RN con react-hook-form
  useEffect(() => {
    register("name");
    register("description");
    register("banner");
    register("avatar");
  }, [register]);

  watch("name");
  watch("description");

  interface TagSuggestion {
    name: string;
  }

  // Sugerencias de tags con debounce
  const fetchTagSuggestions = useCallback(
    debounce(async (query: string) => {
      setTagError(null);
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await getTagRecommendations(query) as TagSuggestion[];
        const newSuggestions = response
          .filter((s) => !selectedTags.includes(s.name.toLowerCase()))
          .map((s) => s.name);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error("Error fetching tag suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 1000),
    [selectedTags],
  );

  useEffect(() => {
    fetchTagSuggestions(inputValue);
    return () => {
      fetchTagSuggestions.cancel();
    };
  }, [inputValue, fetchTagSuggestions]);

  // Manejo de tags
  const handleAddTag = (tag: string) => {
    const newTag = tag.trim().toLowerCase();
    if (newTag && !selectedTags.includes(newTag) && selectedTags.length < maxTags) {
      setSelectedTags((prev) => [...prev, newTag]);
      setInputValue("");
      setSuggestions([]);
    } else if (selectedTags.includes(newTag)) {
      setTagError("Esta etiqueta ya ha sido agregada.");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Subida de imágenes (banner y avatar)
  const handleImageUpload = async (uri: string, type: "banner" | "avatar") => {
    const setPreview = type === "banner" ? setBannerPreview : setAvatarPreview;
    const setIsLoading = type === "banner" ? setIsUploadingBanner : setIsUploadingAvatar;

    try {
      setPreview(uri);
      setIsLoading(true);
      setSubmissionError(null);

      // Subir URI (base64 o multipart) a tu servicio de Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(uri);
      setValue(type, cloudinaryUrl, { shouldValidate: true });
    } catch (error) {
      console.error(`Error al subir la imagen de ${type}:`, error);
      setSubmissionError(`No se pudo subir la imagen de ${type}. Inténtalo de nuevo.`);
      setPreview(null);
      setValue(type, undefined, { shouldValidate: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Helpers para seleccionar imagen desde el dispositivo
  const openSystemImagePicker = async (type: "banner" | "avatar") => {
    // Si ya tienes integrado expo-image-picker, llama aquí y obtén la URI.
    // Para mantenerlo agnóstico, asumimos que recibes una URI lista:
    // const result = await pickImage();
    // if (!result.canceled) handleImageUpload(result.uri, type);

    // Placeholder: simula selección con una URI existente (reemplaza con tu picker real)
    const sampleUri =
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80";
    await handleImageUpload(sampleUri, type);
  };

  // Submit
  const handleCloseSuccessModal = () => setIsSubmitCorrect(false);
  const handleCloseErrorModal = () => {
    setSubmissionError(null);
    setIsSubmitting(false);
  };

  async function submitCreateCommunityForm(data: CreateCommunityPageData) {
    setIsSubmitting(true);
    setSubmissionError(null);
    const communityData = { ...data, isPrivate, tags: selectedTags };
    try {
      const response = await createCommunity(communityData);
      setIsSubmitCorrect(true);
      setCommunityId(String(response.id));
    } catch (error) {
      console.error("Error al crear la comunidad:", error);
      setSubmissionError("Error al crear la comunidad. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-black px-6 py-6">
      <Text className="text-2xl font-bold mb-6 text-white">Crear Comunidad</Text>

      {/* Información de la comunidad */}
      <View className="bg-gray-900 rounded-lg shadow-md p-6 w-full mb-6">
        <Text className="text-lg font-semibold text-white mb-1">Información de la comunidad</Text>
        <Text className="text-sm text-gray-400 mb-6">
          Estamos emocionados de ver tu comunidad cobrar vida. Cuéntanos un poco de lo que tienes en mente.
        </Text>

        {/* Título */}
        <View className="mb-6">
          <Text className="text-sm font-medium mb-1 text-white">Título de la comunidad</Text>
          <TextInput
            placeholder="Ej. Matemáticas y física"
            placeholderTextColor="#9CA3AF"
            onChangeText={(v) => setValue("name", v, { shouldValidate: true })}
            className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-white border ${errors.name ? "border-red-500" : "border-gray-600"
              }`}
          />
          {errors.name && <Text className="text-red-400 text-sm mt-1">{errors.name.message}</Text>}
        </View>

        {/* Descripción */}
        <View className="mb-6">
          <Text className="text-sm font-medium mb-1 text-white">Descripción de la comunidad</Text>
          <TextInput
            placeholder="Ej. Un lugar para discutir y aprender sobre matemáticas y física."
            placeholderTextColor="#9CA3AF"
            multiline
            onChangeText={(v) => setValue("description", v, { shouldValidate: true })}
            className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-white border ${errors.description ? "border-red-500" : "border-gray-600"
              }`}
          />
          {errors.description && (
            <Text className="text-red-400 text-sm mt-1">{errors.description.message}</Text>
          )}
        </View>

        {/* Privacidad */}
        <View className="mb-2">
          <Text className="text-sm font-medium mb-1 text-white">Privacidad de la comunidad.</Text>
          <TouchableOpacity
            onPress={() => setIsPrivate((v) => !v)}
            className={`inline-flex h-6 w-11 mt-2 items-center rounded-full ${isPrivate ? "bg-purple-600" : "bg-gray-700"
              }`}
            activeOpacity={0.8}
          >
            <View
              className={`size-4 rounded-full bg-white ${isPrivate ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </TouchableOpacity>

          <View className="mt-2">
            {isPrivate ? (
              <Text className="text-sm text-red-400">
                La comunidad será privada, solo podrás invitar a miembros mediante un enlace de confirmación
              </Text>
            ) : (
              <Text className="text-sm text-gray-400">
                La comunidad será pública; cualquiera puede unirse y ver su contenido.
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Etiquetas */}
      <View className="bg-gray-900 rounded-lg shadow-md p-6 w-full mb-6">
        <Text className="text-lg font-semibold text-white mb-1">Temas de la comunidad</Text>
        <Text className="text-sm text-gray-400 mb-4">
          Añade al menos 3 etiquetas para que los demás puedan encontrar tu comunidad fácilmente.
        </Text>

        {/* Tags seleccionados */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          {selectedTags.map((tag) => (
            <View
              key={tag}
              className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-md flex-row items-center"
            >
              <Text className="text-white text-sm font-semibold">{tag}</Text>
              <TouchableOpacity onPress={() => handleTagRemove(tag)} className="ml-3">
                <Text className="text-red-200 text-lg font-bold">×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Input y sugerencias */}
        {selectedTags.length < maxTags ? (
          <View>
            <TextInput
              placeholder="Ej. programación"
              placeholderTextColor="#9CA3AF"
              value={inputValue}
              onChangeText={setInputValue}
              className="w-full border border-gray-600 rounded px-3 py-2 text-sm bg-gray-800 text-white"
            />

            {isSearching && (
              <Text className="text-sm text-gray-400 italic mt-2">🔍 Buscando...</Text>
            )}

            {suggestions.length > 0 && !isSearching && (
              <View className="mt-4 flex-row flex-wrap gap-2">
                {suggestions.slice(0, 5).map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    onPress={() => handleAddTag(suggestion)}
                    className="px-4 py-2 bg-gray-700 rounded-full"
                  >
                    <Text className="text-gray-100 text-sm font-medium">+ {suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <Text className="text-sm text-gray-400 mt-2">
            Has agregado el máximo de {maxTags} etiquetas.
          </Text>
        )}

        {tagError && <Text className="text-red-400 text-sm mt-2">{tagError}</Text>}
      </View>

      {/* Imágenes */}
      <View className="bg-gray-900 rounded-lg shadow-md p-6 w-full mb-6">
        <Text className="text-lg font-semibold text-white mb-1">Imágenes de la comunidad</Text>
        <Text className="text-sm text-gray-400 mb-6">
          Añade un banner y un avatar representativo para que tu comunidad se vea única.
        </Text>

        <View className="space-y-6">
          {/* Banner */}
          <TouchableOpacity
            onPress={() => openSystemImagePicker("banner")}
            activeOpacity={0.8}
            className="border border-dashed border-zinc-600 rounded-lg p-6 items-center justify-center"
          >
            {isUploadingBanner && (
              <View className="absolute inset-0 bg-black/50 items-center justify-center rounded-md">
                <ActivityIndicator color="#fff" />
              </View>
            )}

            {bannerPreview ? (
              <Image
                source={{ uri: bannerPreview }}
                className="w-full h-48 rounded-md"
                resizeMode="cover"
              />
            ) : (
              !isUploadingBanner && (
                <View className="items-center">
                  <Text className="text-white mb-1 font-semibold">Sube la cabecera</Text>
                  <Text className="text-sm text-zinc-400 text-center">
                    Pulsa aquí para elegir una imagen. Ideal: 1840 x 560 píxeles.
                  </Text>
                </View>
              )
            )}
          </TouchableOpacity>

          {/* Avatar */}
          <TouchableOpacity
            onPress={() => openSystemImagePicker("avatar")}
            activeOpacity={0.8}
            className="flex-row items-center gap-4"
          >
            <View className="w-20 h-20 border border-dashed border-zinc-600 rounded-lg items-center justify-center bg-gray-800 relative">
              {isUploadingAvatar && (
                <View className="absolute inset-0 bg-black/50 items-center justify-center rounded-md">
                  <ActivityIndicator color="#fff" />
                </View>
              )}

              {avatarPreview && !isUploadingAvatar ? (
                <Image
                  source={{ uri: avatarPreview }}
                  className="w-20 h-20 rounded-md"
                  resizeMode="cover"
                />
              ) : (
                !isUploadingAvatar && <ImageIcon size={24} color="#A1A1AA" />
              )}
            </View>

            <View className="flex-col">
              <Text className="text-sm text-white mb-1 font-semibold">Sube un avatar</Text>
              <Text className="text-sm text-zinc-400">
                Formato ideal cuadrado de 512 píxeles.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botones de acción */}
      <View className="flex-row mt-2 justify-center gap-4">
        <TouchableOpacity
          disabled={
            isUploadingBanner || isUploadingAvatar || !isValid || selectedTags.length < 3
          }
          onPress={handleSubmit(submitCreateCommunityForm)}
          className={`px-4 py-2 rounded ${isUploadingBanner || isUploadingAvatar || !isValid || selectedTags.length < 3
              ? "bg-blue-900 opacity-50"
              : "bg-blue-600"
            }`}
        >
          <Text className="text-white font-bold">
            {isSubmitting ? "Creando..." : "Crear Comunidad"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/communities" as any)}
          className="px-4 py-2 bg-gray-600 rounded"
        >
          <Text className="text-white font-medium">Ir a comunidades</Text>
        </TouchableOpacity>
      </View>

      {/* Modales de éxito y error */}
      <CommunitySuccessModal
        isOpen={isSubmitCorrect}
        onClose={handleCloseSuccessModal}
        message="Tu comunidad se ha creado con éxito. Comparte tu conocimiento con el mundo."
        communityId={communityId}
      />
      <CommunityErrorModal
        isOpen={!!submissionError}
        onClose={handleCloseErrorModal}
        message={submissionError || undefined}
      />
    </ScrollView>
  );
}