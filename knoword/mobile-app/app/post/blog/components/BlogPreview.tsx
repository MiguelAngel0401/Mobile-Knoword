import React from "react";
import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import RenderHTML from "react-native-render-html";

interface BlogPreviewProps {
  title: string;
  content: string;
}

export default function BlogPreview({ title, content }: BlogPreviewProps) {
  const previewDate = new Date();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {title || "Título del blog"}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>Por Autor del Blog</Text>
          <Text style={styles.metaSeparator}>•</Text>
          <Text style={styles.metaText}>
            {previewDate.toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>

      <RenderHTML
        contentWidth={width}
        source={{
          html: content || "<p>Contenido del blog aparecerá aquí...</p>",
        }}
        baseStyle={styles.htmlBase}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  metaSeparator: {
    marginHorizontal: 8,
    color: "#9CA3AF",
  },
  htmlBase: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
});