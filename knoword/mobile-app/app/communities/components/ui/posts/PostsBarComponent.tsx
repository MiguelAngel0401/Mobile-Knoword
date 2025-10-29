import React from "react";
import { View, StyleSheet } from "react-native";
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
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
});