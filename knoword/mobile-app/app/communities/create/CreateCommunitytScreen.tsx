import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash/debounce";
import { Image as ImageIcon } from "lucide-react-native";

import { createCommunitySchema } from "../../../../shared-core/src/validators/community/createCommunity";
import {
  createCommunity,
  getTagRecommendations,
} from "@shared/services/community/communityServices";
import { uploadToCloudinary } from "@shared/services/cloudinary/upload";

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

  const handleImageUpload = async (uri: string, type: "banner" | "avatar") => {
    const setPreview = type === "banner" ? setBannerPreview : setAvatarPreview;
    const setIsLoading = type === "banner" ? setIsUploadingBanner : setIsUploadingAvatar;

    try {
      setPreview(uri);
      setIsLoading(true);
      setSubmissionError(null);

      const cloudinaryResult = await uploadToCloudinary();
      const cloudinaryUrl = cloudinaryResult.secure_url;

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

  const openSystemImagePicker = async (type: "banner" | "avatar") => {
    const sampleUri =
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80";
    await handleImageUpload(sampleUri, type);
  };

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Comunidad</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de la comunidad</Text>
        <Text style={styles.sectionDescription}>
          Estamos emocionados de ver tu comunidad cobrar vida. Cuéntanos un poco de lo que tienes en mente.
        </Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Título de la comunidad</Text>
          <TextInput
            placeholder="Ej. Matemáticas y física"
            placeholderTextColor="#9CA3AF"
            onChangeText={(v) => setValue("name", v, { shouldValidate: true })}
            style={[styles.input, errors.name && styles.inputError]}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Descripción de la comunidad</Text>
          <TextInput
            placeholder="Ej. Un lugar para discutir y aprender sobre matemáticas y física."
            placeholderTextColor="#9CA3AF"
            multiline
            onChangeText={(v) => setValue("description", v, { shouldValidate: true })}
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description.message}</Text>
          )}
        </View>

        <View style={styles.privacyContainer}>
          <Text style={styles.label}>Privacidad de la comunidad.</Text>
          <TouchableOpacity
            onPress={() => setIsPrivate((v) => !v)}
            style={[styles.toggle, isPrivate ? styles.toggleActive : styles.toggleInactive]}
            activeOpacity={0.8}
          >
            <View style={[styles.toggleThumb, isPrivate && styles.toggleThumbActive]} />
          </TouchableOpacity>

          <View style={styles.privacyInfo}>
            {isPrivate ? (
              <Text style={styles.privacyTextPrivate}>
                La comunidad será privada, solo podrás invitar a miembros mediante un enlace de confirmación
              </Text>
            ) : (
              <Text style={styles.privacyTextPublic}>
                La comunidad será pública; cualquiera puede unirse y ver su contenido.
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Temas de la comunidad</Text>
        <Text style={styles.sectionDescription}>
          Añade al menos 3 etiquetas para que los demás puedan encontrar tu comunidad fácilmente.
        </Text>

        <View style={styles.tagsContainer}>
          {selectedTags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity onPress={() => handleTagRemove(tag)} style={styles.tagRemove}>
                <Text style={styles.tagRemoveText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {selectedTags.length < maxTags ? (
          <View>
            <TextInput
              placeholder="Ej. programación"
              placeholderTextColor="#9CA3AF"
              value={inputValue}
              onChangeText={setInputValue}
              style={styles.tagInput}
            />

            {isSearching && (
              <Text style={styles.searchingText}>🔍 Buscando...</Text>
            )}

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
          </View>
        ) : (
          <Text style={styles.maxTagsText}>
            Has agregado el máximo de {maxTags} etiquetas.
          </Text>
        )}

        {tagError && <Text style={styles.tagErrorText}>{tagError}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Imágenes de la comunidad</Text>
        <Text style={styles.sectionDescription}>
          Añade un banner y un avatar representativo para que tu comunidad se vea única.
        </Text>

        <View style={styles.imagesSection}>
          <TouchableOpacity
            onPress={() => openSystemImagePicker("banner")}
            activeOpacity={0.8}
            style={styles.bannerUpload}
          >
            {isUploadingBanner && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator color="#fff" />
              </View>
            )}

            {bannerPreview ? (
              <Image
                source={{ uri: bannerPreview }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            ) : (
              !isUploadingBanner && (
                <View style={styles.uploadPlaceholder}>
                  <Text style={styles.uploadTitle}>Sube la cabecera</Text>
                  <Text style={styles.uploadDescription}>
                    Pulsa aquí para elegir una imagen. Ideal: 1840 x 560 píxeles.
                  </Text>
                </View>
              )
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openSystemImagePicker("avatar")}
            activeOpacity={0.8}
            style={styles.avatarUpload}
          >
            <View style={styles.avatarBox}>
              {isUploadingAvatar && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color="#fff" />
                </View>
              )}

              {avatarPreview && !isUploadingAvatar ? (
                <Image
                  source={{ uri: avatarPreview }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                !isUploadingAvatar && <ImageIcon size={24} color="#A1A1AA" />
              )}
            </View>

            <View style={styles.avatarInfo}>
              <Text style={styles.avatarTitle}>Sube un avatar</Text>
              <Text style={styles.avatarDescription}>
                Formato ideal cuadrado de 512 píxeles.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          disabled={
            isUploadingBanner || isUploadingAvatar || !isValid || selectedTags.length < 3
          }
          onPress={handleSubmit(submitCreateCommunityForm)}
          style={[
            styles.createButton,
            (isUploadingBanner || isUploadingAvatar || !isValid || selectedTags.length < 3) &&
            styles.createButtonDisabled
          ]}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Creando..." : "Crear Comunidad"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/communities" as any)}
          style={styles.cancelButton}
        >
          <Text style={styles.buttonText}>Ir a comunidades</Text>
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#ffffff',
  },
  section: {
    backgroundColor: '#111827',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 24,
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#ffffff',
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1f2937',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#f87171',
    fontSize: 14,
    marginTop: 4,
  },
  privacyContainer: {
    marginBottom: 8,
  },
  toggle: {
    height: 24,
    width: 44,
    marginTop: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#7c3aed',
  },
  toggleInactive: {
    backgroundColor: '#374151',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginLeft: 4,
  },
  toggleThumbActive: {
    marginLeft: 24,
  },
  privacyInfo: {
    marginTop: 8,
  },
  privacyTextPrivate: {
    fontSize: 14,
    color: '#fca5a5',
  },
  privacyTextPublic: {
    fontSize: 14,
    color: '#9ca3af',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  tagRemove: {
    marginLeft: 12,
  },
  tagRemoveText: {
    color: '#fecaca',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tagInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#1f2937',
    color: '#ffffff',
  },
  searchingText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 8,
  },
  suggestionsContainer: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestion: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#374151',
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    color: '#f3f4f6',
    fontSize: 14,
    fontWeight: '500',
  },
  maxTagsText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  tagErrorText: {
    color: '#f87171',
    fontSize: 14,
    marginTop: 8,
  },
  imagesSection: {
    marginTop: 0,
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
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  bannerImage: {
    width: '100%',
    height: 192,
    borderRadius: 6,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadTitle: {
    color: '#ffffff',
    marginBottom: 4,
    fontWeight: '600',
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2937',
    marginRight: 16,
    position: 'relative',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  avatarInfo: {
    flex: 1,
  },
  avatarTitle: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
    fontWeight: '600',
  },
  avatarDescription: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'center',
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#2563eb',
    marginRight: 16,
  },
  createButtonDisabled: {
    backgroundColor: '#1e3a8a',
    opacity: 0.5,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#4b5563',
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});