import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";

interface LinkModalProps {
  editor?: any;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function LinkModal({ editor, isOpen, setIsOpen }: LinkModalProps) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (!editor) return;

    const updateText = () => {
      const selection = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(
        selection.from,
        selection.to,
        " "
      );
      setText(selectedText);
    };

    editor.on("selectionUpdate", updateText);
    editor.on("transaction", updateText);

    return () => {
      editor.off("selectionUpdate", updateText);
      editor.off("transaction", updateText);
    };
  }, [editor]);

  const handleSubmit = () => {
    if (!url || !editor) return;

    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      alert("Por favor ingresa una URL válida");
      return;
    }

    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    if (text) {
      editor.chain().focus().setLink({ href: fullUrl }).run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: url,
          marks: [{ type: "link", attrs: { href: fullUrl } }],
        })
        .run();
    }

    setUrl("");
    setText("");
    setIsOpen(false);
  };

  const handleUnlink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setIsOpen(false);
  };

  const isLinkActive = () => {
    if (!editor) return false;
    return editor.isActive("link");
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            {isLinkActive() ? "Editar enlace" : "Insertar enlace"}
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Texto a mostrar</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Texto del enlace"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
            <Text style={styles.helper}>
              Si no se especifica, se usará la URL como texto
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>URL</Text>
            <TextInput
              value={url}
              onChangeText={setUrl}
              placeholder="https://example.com"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <View style={styles.actions}>
            {isLinkActive() && (
              <TouchableOpacity onPress={handleUnlink} style={styles.unlink}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.cancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submit}>
              <Text style={styles.buttonText}>
                {isLinkActive() ? "Actualizar" : "Insertar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  modalTitle: {
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
  unlink: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});