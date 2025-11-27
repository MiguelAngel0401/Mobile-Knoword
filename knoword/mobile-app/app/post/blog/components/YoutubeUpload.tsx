import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { Youtube } from "lucide-react-native";

interface YoutubeUploadProps {
  editor?: any;
}

export default function YoutubeUpload({ editor }: YoutubeUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleSubmit = () => {
    if (!url || !editor) return;

    const start = startTime ? parseInt(startTime, 10) : 0;

    editor?.commands?.setYoutubeVideo?.({
      src: url,
      start: isNaN(start) ? 0 : start,
    });

    setUrl("");
    setStartTime("");
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setIsOpen(true)} style={styles.trigger}>
        <Youtube size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.modal}>
            <Text style={styles.title}>Insertar video de YouTube</Text>

            <View style={styles.field}>
              <Text style={styles.label}>URL del video</Text>
              <TextInput
                value={url}
                onChangeText={setUrl}
                placeholder="https://www.youtube.com/watch?v=..."
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Tiempo de inicio (opcional)</Text>
              <TextInput
                value={startTime}
                onChangeText={setStartTime}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                style={styles.input}
              />
              <Text style={styles.helper}>Segundos después del inicio del video</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.cancel}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} style={styles.submit}>
                <Text style={styles.submitText}>Insertar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: 8,
    borderRadius: 8,
    margin: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 24,
    width: 320,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#d1d5db",
    marginBottom: 4,
  },
  input: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#374151",
    borderColor: "#4b5563",
    borderWidth: 1,
    borderRadius: 8,
    color: "#fff",
  },
  helper: {
    marginTop: 4,
    fontSize: 12,
    color: "#9CA3AF",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelText: {
    color: "#d1d5db",
    fontWeight: "600",
  },
  submit: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
});