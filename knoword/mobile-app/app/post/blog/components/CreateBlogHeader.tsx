import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface CreateBlogHeaderProps {
  onSave: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  onTogglePreview: () => void;
  isPreviewMode: boolean;
}

export default function CreateBlogHeader({
  onSave,
  onCancel,
  onSubmit,
  onTogglePreview,
  isPreviewMode,
}: CreateBlogHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear nuevo blog</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onCancel} activeOpacity={0.7}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onTogglePreview}
          activeOpacity={0.7}
          style={styles.previewButton}
        >
          {isPreviewMode ? (
            <>
              <EyeOff size={18} color="white" />
              <Text style={styles.previewText}>Editar</Text>
            </>
          ) : (
            <>
              <Eye size={18} color="white" />
              <Text style={styles.previewText}>Vista previa</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSave}
          activeOpacity={0.7}
          style={styles.saveButton}
        >
          <Text style={styles.saveText}>Guardar borrador</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSubmit}
          activeOpacity={0.7}
          style={styles.publishButton}
        >
          <Text style={styles.publishText}>Publicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cancelText: {
    color: "#9CA3AF",
    fontWeight: "500",
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#4B5563",
    borderRadius: 8,
  },
  previewText: {
    color: "#fff",
    fontWeight: "600",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 8,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
  publishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#2563EB",
    borderRadius: 8,
  },
  publishText: {
    color: "#fff",
    fontWeight: "600",
  },
});