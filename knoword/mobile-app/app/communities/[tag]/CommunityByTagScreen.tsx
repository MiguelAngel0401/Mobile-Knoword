import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { getCommunitiesByTag } from "@shared/services/community/communityServices";
import { Community } from "@shared/types/community/community";
import { RootStackParamList } from "@shared/types/navigation";
import ErrorMessageScreen from "../../../components/shared/ErrorMessageScreen";

type CommunityNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "CommunityScreen"
>;

export default function CommunityByTagScreen() {
  const route = useRoute();
  const navigation = useNavigation<CommunityNavProp>();
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
            onPress={() =>
              navigation.navigate("CommunityScreen", { idCommunity: item.id })
            }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textTransform: "capitalize",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  spinner: {
    width: 48,
    height: 48,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#3b82f6",
    borderRadius: 24,
  },
  card: {
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    marginBottom: 24,
    overflow: "hidden",
  },
  banner: {
    height: 96,
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  avatarContainer: {
    position: "absolute",
    bottom: -24,
    left: 16,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#121212",
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#121212",
    backgroundColor: "#4b5563",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFallbackText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  privacyBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#facc15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  privacyText: {
    color: "#78350f",
    fontSize: 10,
    fontWeight: "500",
  },
  content: {
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  communityName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#1e3a8a",
  },
  tagText: {
    color: "#bfdbfe",
    fontSize: 12,
    fontWeight: "500",
  },
  tagOverflow: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#374151",
  },
  tagOverflowText: {
    color: "#d1d5db",
    fontSize: 12,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    color: "#9ca3af",
    fontSize: 12,
  },
});