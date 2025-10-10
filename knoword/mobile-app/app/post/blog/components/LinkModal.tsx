import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Link as LinkIcon } from "lucide-react-native";

// Si usas un editor compatible en RN, pásalo como prop
interface LinkModalProps {
  editor?: any;
}

export default function LinkModal({ editor }: LinkModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  // Actualizar texto seleccionado (si tu editor lo soporta)
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
          text: text || url,
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
  };

  const isLinkActive = () => {
    if (!editor) return false;
    return editor.isActive("link");
  };

  return (
    <View>
      {/* Botón para abrir modal */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={`p-2 rounded-md ${
          isLinkActive()
            ? "bg-gray-700"
            : "bg-transparent"
        }`}
      >
        <LinkIcon size={18} color={isLinkActive() ? "white" : "#9CA3AF"} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={isOpen} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-gray-800 rounded-lg p-6 w-80">
            <Text className="text-lg font-semibold text-white mb-4">
              {isLinkActive() ? "Editar enlace" : "Insertar enlace"}
            </Text>

            {/* Texto */}
            <View className="mb-4">
              <Text className="text-sm text-gray-300 mb-1">Texto a mostrar</Text>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Texto del enlace"
                placeholderTextColor="#9CA3AF"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              <Text className="mt-1 text-xs text-gray-400">
                Si no se especifica, se usará la URL como texto
              </Text>
            </View>

            {/* URL */}
            <View className="mb-4">
              <Text className="text-sm text-gray-300 mb-1">URL</Text>
              <TextInput
                value={url}
                onChangeText={setUrl}
                placeholder="https://example.com"
                placeholderTextColor="#9CA3AF"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </View>

            {/* Botones */}
            <View className="flex-row justify-end gap-3">
              {isLinkActive() && (
                <TouchableOpacity
                  onPress={handleUnlink}
                  className="px-4 py-2 bg-red-600 rounded-md"
                >
                  <Text className="text-white font-semibold">Eliminar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                className="px-4 py-2"
              >
                <Text className="text-gray-300 font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="px-4 py-2 bg-blue-600 rounded-md"
              >
                <Text className="text-white font-semibold">
                  {isLinkActive() ? "Actualizar" : "Insertar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}