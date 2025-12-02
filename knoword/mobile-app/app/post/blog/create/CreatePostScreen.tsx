import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import CreateBlogHeader from "../components/CreateBlogHeader";
import BlogPreview from "../components/BlogPreview";
import RichHtmlBlogEditor from "../components/RichHTMLBlogEditor";
import BottomTabs from "../../../../src/components/profile/BottomTabs";
import { useDebounce } from "../../../../../mobile-app/src/hooks/useDebounce";
import { createBlogPost } from "../../../../../shared-core/src/blog/api";

interface BlogDraft {
  title: string;
  content: string;
  lastSaved: Date;
}

type SavingStatus = "idle" | "saving" | "saved";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savingStatus, setSavingStatus] = useState<SavingStatus>("idle");

  const router = useRouter();

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
    router.push("/post/blog");
  };

  const handleSubmit = async () => {
    try {
      if (!title || !content) {
        Alert.alert("Error", "Título y contenido son obligatorios");
        return;
      }

      await createBlogPost({ title, content });

      await AsyncStorage.removeItem("blogDraft");
      Alert.alert("Publicado con éxito");
      router.push("/post/blog");
    } catch (error) {
      console.error("Error al publicar:", error);
      Alert.alert("Error", "No se pudo publicar el contenido");
    }
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
    <View style={styles.container}>
      <ScrollView style={styles.screen}>
        <CreateBlogHeader
          onSubmit={handleSubmit}
          onSave={handleSave}
          onCancel={handleCancel}
          onTogglePreview={handleTogglePreview}
          isPreviewMode={isPreviewMode}
        />

        <View style={styles.titleContainer}>
          <View style={styles.titleHeader}>
            <Text style={styles.titleLabel}>Título del blog</Text>
            {savingStatus !== "idle" && (
              <Text style={styles.savingStatus}>
                {savingStatusText[savingStatus]}
              </Text>
            )}
          </View>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Escribe el título de tu blog..."
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />
        </View>

        {isPreviewMode ? (
          <BlogPreview title={title} content={content} />
        ) : (
          <RichHtmlBlogEditor content={content} onChange={handleContentChange} />
        )}
      </ScrollView>

      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  screen: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  titleContainer: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },
  titleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#D1D5DB",
  },
  savingStatus: {
    fontSize: 12,
    color: "#6B7280",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 8,
    color: "#fff",
  },
});