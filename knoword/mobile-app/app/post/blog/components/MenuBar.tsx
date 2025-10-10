import React from "react";
import { View, TouchableOpacity } from "react-native";
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
  editor: any; // En RN no hay tipado oficial de Tiptap, puedes usar any o tu wrapper
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
    <View className="border border-blue-500 rounded-md p-1 mb-4 bg-gray-900 flex-row flex-wrap z-50">
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={option.onClick}
          className={`p-2 rounded-md m-1 ${
            option.pressed ? "bg-gray-700" : "bg-transparent"
          }`}
        >
          {option.icon}
        </TouchableOpacity>
      ))}

      {/* Extras */}
      <LinkModal editor={editor} />
      <ImageUpload editor={editor} />
      <YoutubeUpload editor={editor} />
    </View>
  );
}