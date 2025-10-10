import React from "react";
import { View } from "react-native";
import PostActionComponent from "./PostActionComponent";
import {
  Image as ImageIcon,
  PanelsTopLeft,
  MessageCircleQuestion,
  FileText,
  Workflow,
  ListChecks,
  Calendar,
} from "lucide-react-native";

const postActions = [
  { label: "Blog", icon: <PanelsTopLeft size={24} color="#fff" />, key: "blog" },
  { label: "Imagen", icon: <ImageIcon size={24} color="#fff" />, key: "image" },
  { label: "Diagrama", icon: <Workflow size={24} color="#fff" />, key: "diagram" },
  { label: "Pregunta", icon: <MessageCircleQuestion size={24} color="#fff" />, key: "question" },
  { label: "Documento", icon: <FileText size={24} color="#fff" />, key: "document" },
  { label: "Encuesta", icon: <ListChecks size={24} color="#fff" />, key: "poll" },
  { label: "Evento", icon: <Calendar size={24} color="#fff" />, key: "event" },
];

export default function PostsBarComponent() {
  return (
    <View className="border border-gray-700 rounded-xl shadow-lg w-full flex-row flex-wrap gap-4 px-4 py-2 mt-4 items-center justify-between">
      {postActions.map((action) => (
        <PostActionComponent
          key={action.key}
          label={action.label}
          icon={action.icon}
        />
      ))}
    </View>
  );
}