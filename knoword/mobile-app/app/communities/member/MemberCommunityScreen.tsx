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
import BottomTabs from "../../../src/components/profile/BottomTabs";
import { Community } from "@shared/types/community";
import { getUserCommunities } from "@shared/services/community/communityServices";

export default function MemberCommunitiesScreen() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const data: Community[] = await getUserCommunities();
        setCommunities(data);
      } catch (err) {
        console.error("Error fetching communities:", err);
        setError(
          "Hubo un error al cargar las comunidades a las que perteneces. Intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={containerStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return <ErrorMessageScreen error={error} />;
  }

  return (
    <View style={containerStyles.container}>
      <ScrollView style={styles.screen}>
        <Text style={styles.title}>
          Comunidades a las que pertenezco ({communities.length})
        </Text>

        {communities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>
              Aún no perteneces a comunidades
            </Text>
            <Text style={styles.emptySubtitle}>
              Únete a comunidades para empezar a colaborar
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {communities.map((community) => (
              <TouchableOpacity
                key={community.id}
                onPress={() =>
                  router.push(`/communities/community/${community.id}` as any)
                }
                style={styles.card}
                activeOpacity={0.8}
              >
                <View style={styles.banner}>
                  {community.banner ? (
                    <Image
                      source={{ uri: community.banner.trim() }}
                      style={styles.bannerImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.bannerFallback} />
                  )}
                  <View style={styles.avatarContainer}>
                    {community.avatar ? (
                      <Image
                        source={{ uri: community.avatar.trim() }}
                        style={styles.avatar}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.avatarFallback}>
                        <Text style={styles.avatarFallbackText}>
                          {community.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.content}>
                  <View style={styles.header}>
                    <Text style={styles.communityName}>
                      {community.name}
                    </Text>
                    {community.isPrivate && (
                      <Text style={styles.privateBadge}>Privada</Text>
                    )}
                  </View>

                  <Text style={styles.description} numberOfLines={2}>
                    {community.description}
                  </Text>

                  <View style={styles.tagsContainer}>
                    {community.tags.slice(0, 3).map((tag) => (
                      <Text key={tag.id} style={styles.tag}>
                        {tag.name}
                      </Text>
                    ))}
                    {community.tags.length > 3 && (
                      <Text style={styles.moreTags}>
                        +{community.tags.length - 3}
                      </Text>
                    )}
                  </View>

                  <View style={styles.footer}>
                    <Text style={styles.footerText}>
                      Creada: {formatDate(community.createdAt)}
                    </Text>
                    <Text style={styles.footerText}>
                      👥 {community.memberCount} miembro
                      {community.memberCount !== 1 ? "s" : ""}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <BottomTabs />
    </View>
  );
}

const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});

const styles = StyleSheet.create({
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
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    backgroundColor: "#E5E7EB",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 4,
  },
  emptySubtitle: {
    color: "#9CA3AF",
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    marginBottom: 24,
    width: "100%",
  },
  banner: {
    height: 128,
    backgroundColor: "#1F2937",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "#3B82F6",
  },
  avatarContainer: {
    position: "absolute",
    bottom: -32,
    left: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B5563",
  },
  content: {
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  communityName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    marginRight: 8,
  },
  privateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "500",
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  description: {
    color: "#D1D5DB",
    fontSize: 14,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "500",
    backgroundColor: "#1E3A8A",
    color: "#DBEAFE",
    marginRight: 4,
    marginBottom: 4,
  },
  moreTags: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "500",
    backgroundColor: "#374151",
    color: "#D1D5DB",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
});