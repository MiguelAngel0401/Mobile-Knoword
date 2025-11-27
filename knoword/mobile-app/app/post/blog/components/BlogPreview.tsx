import React from "react";
import { View, Text, useWindowDimensions, StyleSheet, Image as RNImage } from "react-native";
import RenderHTML, { HTMLElementModel, HTMLContentModel } from "react-native-render-html";

interface BlogPreviewProps {
  title: string;
  content: string;
}

export default function BlogPreview({ title, content }: BlogPreviewProps) {
  const previewDate = new Date();
  const { width } = useWindowDimensions();
  const contentWidth = width - 80;

  // Modelo personalizado para imágenes
  const customHTMLElementModels = {
    img: HTMLElementModel.fromCustomModel({
      tagName: 'img',
      contentModel: HTMLContentModel.block
    })
  };

  const renderers = {
    img: ({ tnode }: any) => {
      const { src } = tnode.attributes;
      
      if (!src) {
        return null;
      }

      return (
        <View style={styles.imageContainer}>
          <RNImage
            source={{ uri: src }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      );
    },
  };

  const tagsStyles = {
    body: {
      color: '#E5E7EB',
      fontSize: 14,
      lineHeight: 20,
    },
    p: {
      marginBottom: 8,
      color: '#E5E7EB',
      fontSize: 14,
    },
    h1: {
      fontSize: 20,
      fontWeight: 'bold' as const,
      marginTop: 12,
      marginBottom: 8,
      color: '#fff',
    },
    h2: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      marginTop: 10,
      marginBottom: 6,
      color: '#fff',
    },
    strong: {
      fontWeight: 'bold' as const,
      color: '#fff',
    },
    em: {
      fontStyle: 'italic' as const,
    },
    u: {
      textDecorationLine: 'underline' as const,
    },
    a: {
      color: '#3B82F6',
      textDecorationLine: 'underline' as const,
      fontSize: 14,
    },
    ul: {
      marginBottom: 8,
      color: '#E5E7EB',
    },
    ol: {
      marginBottom: 8,
      color: '#E5E7EB',
    },
    li: {
      marginBottom: 4,
      color: '#E5E7EB',
      fontSize: 14,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {title || "Título del blog"}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>
            Por Autor del Blog
          </Text>
          <Text style={styles.metaSeparator}>•</Text>
          <Text style={styles.metaText}>
            {previewDate.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      <View style={styles.contentWrapper}>
        <RenderHTML
          contentWidth={contentWidth}
          source={{
            html: content || "<p>Contenido del blog aparecerá aquí...</p>",
          }}
          baseStyle={styles.htmlBase}
          tagsStyles={tagsStyles}
          renderers={renderers}
          customHTMLElementModels={customHTMLElementModels}
          defaultTextProps={{
            selectable: false
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 0,
    overflow: 'hidden',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    lineHeight: 26,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  metaText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  metaSeparator: {
    marginHorizontal: 6,
    color: "#9CA3AF",
    fontSize: 12,
  },
  htmlBase: {
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 20,
  },
  contentWrapper: {
    maxHeight: 220,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
});