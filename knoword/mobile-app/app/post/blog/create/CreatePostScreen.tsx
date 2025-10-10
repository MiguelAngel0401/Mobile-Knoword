import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import CreateBlogHeader from "../components/CreateBlogHeader";
import BlogPreview from "../components/BlogPreview";
import RichTextEditor from "../components/RichTextEditor"; // wrapper que hicimos con pell
import { useDebounce } from "../hooks/useDebounce";

interface BlogDraft {
  title: string;
  content: string;
  lastSaved: Date;
}

type SavingStatus = "idle" | "saving" | "saved";

export default function CreateBlogPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savingStatus, setSavingStatus] = useState<SavingStatus>("idle");

  const router = useRouter();

  // Cargar borrador desde AsyncStorage
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const savedDraft = await AsyncStorage.getItem("blogDraft");
        if (savedDraft) {
          const draft: BlogDraft = JSON.parse(savedDraft);
          setTitle(draft.title);
          setContent(draft.content);
        }
      } catch (e) {
        console.error("Error al cargar el borrador:", e);
      }
    };
    loadDraft();
  }, []);

  // Guardar borrador
  const saveDraft = useCallback(async () => {
    setSavingStatus("saving");
    const draft: BlogDraft = {
      title,
      content,
      lastSaved: new Date(),
    };
    try {
      await AsyncStorage.setItem("blogDraft", JSON.stringify(draft));
      setTimeout(() => {
        setSavingStatus("saved");
        setTimeout(() => setSavingStatus("idle"), 2000);
      }, 1000);
    } catch (e) {
      console.error("Error guardando borrador:", e);
    }
  }, [title, content]);

  const debouncedSaveDraft = useDebounce(saveDraft, 2000);

  useEffect(() => {
    debouncedSaveDraft();
  }, [title, content, debouncedSaveDraft]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    await saveDraft();
    Alert.alert("Borrador guardado");
  };

  const handleCancel = () => {
    router.push("/posts/blog" as any);
  };

  const handleSubmit = async () => {
    await AsyncStorage.removeItem("blogDraft");
    Alert.alert("Contenido publicado");
  };

  const handleTogglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const savingStatusText: Record<SavingStatus, string> = {
    idle: "",
    saving: "Guardando...",
    saved: "Guardado",
  };

  return (
    <ScrollView className="flex-1 bg-black px-4 py-6">
      <CreateBlogHeader
        onSubmit={handleSubmit}
        onSave={handleSave}
        onCancel={handleCancel}
        onTogglePreview={handleTogglePreview}
        isPreviewMode={isPreviewMode}
      />

      {/* Título */}
      <View className="flex flex-col gap-2 mb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm font-medium text-gray-300">
            Título del blog
          </Text>
          {savingStatus !== "idle" && (
            <Text className="text-xs text-gray-500">
              {savingStatusText[savingStatus]}
            </Text>
          )}
        </View>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Escribe el título de tu blog..."
          placeholderTextColor="#9CA3AF"
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white"
        />
      </View>

      {/* Editor o Preview */}
      {isPreviewMode ? (
        <BlogPreview title={title} content={content} />
      ) : (
        <RichTextEditor content={content} onChange={handleContentChange} />
      )}
    </ScrollView>
  );
}