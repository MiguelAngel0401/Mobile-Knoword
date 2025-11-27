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
    <View style={styles.wrapper}>
      <Text style={styles.title}>Crear nuevo blog</Text>

      <View style={styles.actionsContainer}>
        <View style={styles.topRow}>
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
                <EyeOff size={16} color="white" />
                <Text style={styles.previewText}>Editar</Text>
              </>
            ) : (
              <>
                <Eye size={16} color="white" />
                <Text style={styles.previewText}>Vista previa</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#1a2332",
    borderBottomWidth: 1,
    borderBottomColor: "#2a3545",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#F9FAFB",
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cancelText: {
    color: "#9CA3AF",
    fontWeight: "500",
    fontSize: 15,
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#4B5563",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  previewText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  saveText: {
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 14,
  },
  publishButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    alignItems: "center",
  },
  publishText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});