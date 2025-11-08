import { styles } from "./styles";

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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash/debounce";
import { Image as ImageIcon } from "lucide-react-native";

import { createCommunitySchema } from "../../../../shared-core/src/validators/community/createCommunity";
import { createCommunity, getTagRecommendations } from "@shared/services/community/communityServices";
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

  // Estados para validación manual
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCommunityPageData>({
    resolver: zodResolver(createCommunitySchema),
    mode: "onChange",
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

  // Calcular si el formulario es válido
  const isFormValid = 
    name.trim().length >= 3 && 
    description.trim().length >= 10 && 
    selectedTags.length >= 3 &&
    !isUploadingBanner &&
    !isUploadingAvatar;

  const fetchTagSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const response = await getTagRecommendations(query);
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
    }, 800),
    [selectedTags]
  );

  useEffect(() => {
    if (inputValue.trim().length >= 2) {
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
    
    if (selectedTags.length >= maxTags) {
      setTagError(`Máximo ${maxTags} etiquetas permitidas.`);
      setTimeout(() => setTagError(null), 3000);
      return;
    }
    
    if (selectedTags.includes(newTag)) {
      setTagError("Esta etiqueta ya ha sido agregada.");
      setTimeout(() => setTagError(null), 3000);
      return;
    }
    
    setSelectedTags((prev) => [...prev, newTag]);
    setInputValue("");
    setSuggestions([]);
    setTagError(null);
  };

  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const openSystemImagePicker = async (type: "banner" | "avatar") => {
    const setPreview = type === "banner" ? setBannerPreview : setAvatarPreview;
    const setIsLoading = type === "banner" ? setIsUploadingBanner : setIsUploadingAvatar;

    try {
      setIsLoading(true);
      setSubmissionError(null);

      const cloudinaryResult = await uploadToCloudinary();
      const cloudinaryUrl = cloudinaryResult.secure_url;

      setPreview(cloudinaryUrl);
      setValue(type, cloudinaryUrl, { shouldValidate: true });
    } catch (error: any) {
      // Si el usuario canceló, no mostrar error
      if (error.message === 'USER_CANCELED') {
        console.log('Usuario canceló la selección de imagen');
        return;
      }
      
      console.error(`Error al subir la imagen de ${type}:`, error);
      setSubmissionError(`No se pudo subir la imagen de ${type}. Inténtalo de nuevo.`);
      setPreview(null);
      setValue(type, undefined, { shouldValidate: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSubmitCorrect(false);
    setValue("name", "");
    setValue("description", "");
    setValue("banner", undefined);
    setValue("avatar", undefined);
    setName("");
    setDescription("");
    setSelectedTags([]);
    setIsPrivate(false);
    setBannerPreview(null);
    setAvatarPreview(null);
  };

  const handleCloseErrorModal = () => {
    setSubmissionError(null);
    setIsSubmitting(false);
  };

  async function submitCreateCommunityForm(data: CreateCommunityPageData) {
    console.log("🚀 Iniciando creación de comunidad...");
    console.log("📝 Datos del formulario:", data);
    console.log("🏷️ Tags seleccionados:", selectedTags);
    console.log("🔒 Es privada:", isPrivate);
    
    setIsSubmitting(true);
    setSubmissionError(null);
    
    const communityData = { 
      ...data, 
      isPrivate, 
      tags: selectedTags 
    };
    
    console.log("📦 Datos completos a enviar:", communityData);
    
    try {
      console.log("⏳ Llamando a createCommunity...");
      const response = await createCommunity(communityData);
      console.log("✅ Respuesta recibida:", response);
      console.log("🆔 ID de comunidad:", response.id);
      
      setIsSubmitCorrect(true);
      setCommunityId(String(response.id));
      console.log("✨ Estado actualizado correctamente");
    } catch (error: any) {
      console.error("❌ Error completo al crear la comunidad:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
      setSubmissionError(error.message || "Error al crear la comunidad. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
      console.log("🏁 Proceso finalizado");
    }
  }

  useEffect(() => {
    console.log("🔍 Estado de redirección:", { isSubmitCorrect, communityId });
    if (isSubmitCorrect && communityId) {
      console.log("⏰ Esperando 2 segundos antes de redirigir...");
      const timer = setTimeout(() => {
        console.log(`🚀 Redirigiendo a: /communities/${communityId}`);
        router.replace(`/communities/${communityId}`);
      }, 2000);
      
      return () => {
        console.log("🧹 Limpiando timer de redirección");
        clearTimeout(timer);
      };
    }
  }, [isSubmitCorrect, communityId, router]);

  return (
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
        <Text style={styles.title}>Crear Comunidad</Text>

        {/* Información básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la comunidad</Text>
          <Text style={styles.sectionDescription}>
            Cuéntanos un poco sobre tu comunidad.
          </Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Título de la comunidad</Text>
            <TextInput
              placeholder="Ej. Matemáticas y física"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={(v) => {
                setName(v);
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
                setDescription(v);
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
                onPress={() => setIsPrivate((v) => !v)}
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
                <Text style={styles.privacyTextPublic}>
                  Pública: Cualquiera puede unirse
                </Text>
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
            
            {selectedTags.length > 0 && (
              <Text style={styles.tagCount}>
                {selectedTags.length} de {maxTags} etiquetas
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

          {selectedTags.length > 0 && (
            <View style={styles.selectedTagsContainer}>
              {selectedTags.map((tag) => (
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
          <Text style={styles.sectionDescription}>
            Recomendado: 1200 x 400 px (opcional)
          </Text>
          
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
              <Image
                source={{ uri: bannerPreview }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
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
          <Text style={styles.sectionDescription}>
            Recomendado: 512 x 512 px (opcional)
          </Text>

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
                <Image
                  source={{ uri: avatarPreview }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
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

        {/* Botón de crear */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid && styles.submitButtonDisabled,
          ]}
          disabled={!isFormValid || isSubmitting}
          onPress={() => {
            console.log("🖱️ Botón presionado");
            console.log("✓ Validación:", { isFormValid, name, description, tagsCount: selectedTags.length });
            handleSubmit(submitCreateCommunityForm)();
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Crear comunidad</Text>
          )}
        </TouchableOpacity>

        {/* Info de validación */}
        {!isFormValid && (
          <View style={styles.validationInfo}>
            {name.trim().length < 3 && (
              <Text style={styles.validationText}>• Falta el título de la comunidad</Text>
            )}
            {description.trim().length < 10 && (
              <Text style={styles.validationText}>• Falta la descripción</Text>
            )}
            {selectedTags.length < 3 && (
              <Text style={styles.validationText}>
                • Faltan {3 - selectedTags.length} etiqueta(s)
              </Text>
            )}
          </View>
        )}

        {/* Modales */}
        <CommunitySuccessModal
          isOpen={isSubmitCorrect}
          onClose={handleCloseSuccessModal}
          message="Tu comunidad se ha creado con éxito."
          communityId={communityId}
        />

        <CommunityErrorModal
          isOpen={!!submissionError}
          onClose={handleCloseErrorModal}
          message={submissionError || ""}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

