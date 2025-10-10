import React, { useRef } from "react";
import { View, Text } from "react-native";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import { useState } from "react";

interface RichTextProps {
  content: string;
  onChange: (richText: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextProps) {
  const editorRef = useRef<RichEditor>(null);
  const [editorContent, setEditorContent] = useState(content);

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-white text-lg font-bold mb-2">Editor</Text>

      <RichEditor
        ref={editorRef}
        initialContentHTML={editorContent}
        onChange={(html) => {
          setEditorContent(html);
          onChange(html);
        }}
        editorStyle={{
          backgroundColor: "#1f2937", // bg-gray-800
          color: "white",
          placeholderColor: "#9CA3AF",
          contentCSSText: "font-size: 16px; min-height: 300px;",
        }}
        placeholder="Escribe tu contenido aquí..."
      />

      <RichToolbar
        editor={editorRef}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading1,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.insertImage,
        ]}
        iconTint="white"
        selectedIconTint="#3B82F6"
        style={{ backgroundColor: "#111827", marginTop: 10, borderRadius: 8 }}
      />
    </View>
  );
}