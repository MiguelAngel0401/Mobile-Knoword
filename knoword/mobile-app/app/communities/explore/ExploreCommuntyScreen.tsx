import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

import ErrorMessageScreen from "../../../components/shared/ErrorMessageScreen";
import { exploreCommunities } from "@shared/services/community/communityServices";
import { Community } from "@shared/types/community";

interface TagRelatedToCommunities {
  id: string;
  name: string;
  createdAt: string;
  communities: Community[];
}

export default function ExploreCommunitiesScreen() {
  const [tagToCommunitiesData, setTagToCommunitiesData] = useState<
    TagRelatedToCommunities[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await exploreCommunities();
        setTagToCommunitiesData(response);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError(
          "Hubo un error al cargar las comunidades. Intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return <ErrorMessageScreen error={error} />;
  }

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.title}>Explorar Comunidades 🌍</Text>

      <View style={styles.section}>
        {tagToCommunitiesData.map((tag, index) => (
          <View key={index}>
            <View style={styles.header}>
              <Text style={styles.categoryTitle}>
                {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push(`/communities/${tag.name.toLowerCase()}` as any)
                }
              >
                <Text style={styles.viewAll}>Ver todo →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
            >
              {tag.communities.map((community, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() =>
                    router.push(`/communities/community/${community.id}` as any)
                  }
                  style={styles.card}
                  activeOpacity={0.8}
                >
                  {community.banner ? (
                    <Image
                      source={{ uri: community.banner }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imageFallback} />
                  )}
                  <View style={styles.overlay}>
                    <Text style={styles.communityName}>
                      {community.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  screen: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#fff",
  },
  section: {
    gap: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
    color: "#fff",
  },
  viewAll: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  carousel: {
    flexDirection: "row",
    gap: 16,
  },
  card: {
    width: 256,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1F2937",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "#111827",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    padding: 16,
  },
  communityName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});