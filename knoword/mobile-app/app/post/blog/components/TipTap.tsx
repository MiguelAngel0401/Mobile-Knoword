import React, { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";

interface RichTextProps {
  content: string;
  onChange: (richText: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextProps) {
  const editorRef = useRef<RichEditor>(null);
  const [editorContent, setEditorContent] = useState(content);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editor</Text>

      <RichEditor
        ref={editorRef}
        initialContentHTML={editorContent}
        onChange={(html) => {
          setEditorContent(html);
          onChange(html);
        }}
        editorStyle={{
          backgroundColor: "#1f2937",
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
        style={styles.toolbar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  toolbar: {
    backgroundColor: "#111827",
    marginTop: 10,
    borderRadius: 8,
  },
});