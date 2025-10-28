import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react-native";

import ImageUpload from "./ImageUpload";
import YoutubeUpload from "./YoutubeUpload";
import LinkModal from "./LinkModal";

interface MenuBarProps {
  editor: any;
}

export default function MenuBar({ editor }: MenuBarProps) {
  if (!editor) return null;

  const options = [
    {
      icon: <Heading2 size={18} color="white" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 size={18} color="white" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Bold size={18} color="white" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic size={18} color="white" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough size={18} color="white" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft size={18} color="white" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter size={18} color="white" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight size={18} color="white" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List size={18} color="white" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered size={18} color="white" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <Highlighter size={18} color="white" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
  ];

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={option.onClick}
          style={[
            styles.button,
            option.pressed ? styles.buttonActive : styles.buttonIdle,
          ]}
        >
          {option.icon}
        </TouchableOpacity>
      ))}

      <LinkModal editor={editor} />
      <ImageUpload editor={editor} />
      <YoutubeUpload editor={editor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    backgroundColor: "#111827",
    flexDirection: "row",
    flexWrap: "wrap",
    zIndex: 50,
  },
  button: {
    padding: 8,
    borderRadius: 8,
    margin: 4,
  },
  buttonIdle: {
    backgroundColor: "transparent",
  },
  buttonActive: {
    backgroundColor: "#374151",
  },
});