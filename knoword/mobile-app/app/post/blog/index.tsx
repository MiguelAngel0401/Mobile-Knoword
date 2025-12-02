import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { Link } from "expo-router";

import BlogPreview from "./components/BlogPreview";
import BottomTabs from "../../../src/components/profile/BottomTabs";
import { getBlogPosts } from "../../../../shared-core/src/blog/api";
import { BlogPost } from "../../../../shared-core/src/blog/types";

export default function BlogFeedScreen() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.screen}>
        <Link href="/post/blog/create/CreatePostScreen" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Crear nuevo post</Text>
          </Pressable>
        </Link>

        {posts.map((post) => (
          <View key={post.id} style={styles.card}>
            <BlogPreview title={post.title} content={post.content} />
          </View>
        ))}
      </ScrollView>

      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  screen: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  button: {
    backgroundColor: "#1F2937",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#374151",
  },
  buttonText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});