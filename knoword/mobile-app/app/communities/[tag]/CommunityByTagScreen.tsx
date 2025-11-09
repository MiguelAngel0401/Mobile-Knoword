import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import { getCommunitiesByTag } from "@shared/services/community/communityServices";
import { Community } from "@shared/types/community/community";
import ErrorMessageScreen from "../../../components/shared/ErrorMessageScreen";
import { router } from "expo-router";
import { styles } from "./styles";

export default function CommunityByTagScreen() {
  const route = useRoute();
  const { tag } = route.params as { tag: string };

  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorFetchingCommunities, setErrorFetchingCommunities] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchCommunities = async () => {
      try {
        const data = await getCommunitiesByTag(tag);
        setCommunities(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching communities", error);
        setErrorFetchingCommunities("No se pudo cargar las comunidades");
        setLoading(false);
      }
    };
    fetchCommunities();
  }, [tag]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.spinner} />
      </View>
    );
  }

  if (errorFetchingCommunities) {
    return <ErrorMessageScreen error={errorFetchingCommunities} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comunidades de {tag}</Text>

      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/communities/community/${item.id}`)}
          >
            {/* Banner */}
            <View style={styles.banner}>
              {item.banner ? (
                <Image source={{ uri: item.banner }} style={styles.bannerImage} resizeMode="cover" />
              ) : (
                <View style={styles.bannerFallback} />
              )}

              {/* Avatar */}
              <View style={styles.avatarContainer}>
                {item.avatar ? (
                  <Image
                    source={{ uri: item.avatar }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarFallbackText}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Privacidad */}
              {item.isPrivate && (
                <View style={styles.privacyBadge}>
                  <Text style={styles.privacyText}>Privada</Text>
                </View>
              )}
            </View>

            {/* Contenido */}
            <View style={styles.content}>
              <Text style={styles.communityName}>{item.name}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                {item.tags.slice(0, 2).map((tag) => (
                  <View key={tag.id} style={styles.tag}>
                    <Text style={styles.tagText}>{tag.name}</Text>
                  </View>
                ))}
                {item.tags.length > 2 && (
                  <View style={styles.tagOverflow}>
                    <Text style={styles.tagOverflowText}>
                      +{item.tags.length - 2}
                    </Text>
                  </View>
                )}
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Creada: {formatDate(item.createdAt)}</Text>
                <Text style={styles.footerText}>👥 {item.memberCount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}