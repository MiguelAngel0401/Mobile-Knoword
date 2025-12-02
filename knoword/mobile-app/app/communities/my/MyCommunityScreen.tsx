import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Users } from "lucide-react-native";
import { getMyCommunities } from "@shared/services/community/communityServices";
import BottomTabs from "../../../src/components/profile/BottomTabs";
import { styles } from "./styles";

interface Tag {
  id: number;
  name: string;
}

interface Community {
  id: number;
  name: string;
  description: string;
  banner?: string;
  avatar?: string;
  isPrivate: boolean;
  tags: Tag[];
  memberCount: number;
  createdAt: string;
}

export default function MyCommunityScreen() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyCommunities();
      setCommunities(data);
    } catch (err) {
      console.error("Error fetching communities:", err);
      setError("Hubo un error al cargar tus comunidades. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCommunityPress = (communityId: number) => {
    router.push(`/communities/community/${communityId}`);
  };

  if (loading) {
    return (
      <View style={containerStyles.centerContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Cargando comunidades...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={containerStyles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCommunities}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={containerStyles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          Mis Comunidades ({communities.length})
        </Text>

        {communities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Aún no has creado comunidades</Text>
            <Text style={styles.emptySubtitle}>
              Crea tu primera comunidad para empezar a colaborar
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/communities/create")}
            >
              <Text style={styles.createButtonText}>Crear comunidad</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {communities.map((community) => (
              <TouchableOpacity
                key={community.id}
                style={styles.card}
                onPress={() => handleCommunityPress(community.id)}
                activeOpacity={0.7}
              >
                {/* Banner */}
                <View style={styles.bannerContainer}>
                  {community.banner ? (
                    <Image
                      source={{ uri: community.banner.trim() }}
                      style={styles.banner}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.bannerPlaceholder} />
                  )}

                  {/* Avatar */}
                  <View style={styles.avatarContainer}>
                    {community.avatar ? (
                      <Image
                        source={{ uri: community.avatar.trim() }}
                        style={styles.avatar}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                          {community.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.communityName} numberOfLines={1}>
                      {community.name}
                    </Text>
                    {community.isPrivate && (
                      <View style={styles.privateBadge}>
                        <Text style={styles.privateBadgeText}>Privada</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.description} numberOfLines={2}>
                    {community.description}
                  </Text>

                  {/* Tags */}
                  <View style={styles.tagsContainer}>
                    {community.tags.slice(0, 3).map((tag) => (
                      <View key={tag.id} style={styles.tag}>
                        <Text style={styles.tagText}>{tag.name}</Text>
                      </View>
                    ))}
                    {community.tags.length > 3 && (
                      <View style={styles.tagMore}>
                        <Text style={styles.tagMoreText}>
                          +{community.tags.length - 3}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Footer */}
                  <View style={styles.cardFooter}>
                    <Text style={styles.footerText}>
                      {formatDate(community.createdAt)}
                    </Text>
                    <View style={styles.membersContainer}>
                      <Users size={14} color="#6b7280" />
                      <Text style={styles.footerText}>
                        {" "}{community.memberCount} miembro{community.memberCount !== 1 ? "s" : ""}
                      </Text>
                    </View>
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});