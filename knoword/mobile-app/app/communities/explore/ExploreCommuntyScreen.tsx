import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
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
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return <ErrorMessageScreen error={error} />;
  }

  return (
    <ScrollView className="flex-1 bg-black px-6 py-6">
      <Text className="text-3xl font-bold mb-8 text-white">
        Explorar Comunidades 🌍
      </Text>

      <View className="space-y-12">
        {tagToCommunitiesData.map((tag, index) => (
          <View key={index}>
            {/* Encabezado de categoría */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-semibold capitalize text-white">
                {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push(`/communities/${tag.name.toLowerCase()}` as any)
                }
              >
                <Text className="text-sm text-gray-400">Ver todo →</Text>
              </TouchableOpacity>
            </View>

            {/* Carrusel horizontal de comunidades */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-4"
            >
              {tag.communities.map((community, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() =>
                    router.push(`/communities/community/${community.id}` as any)
                  }
                  className="w-64 h-40 rounded-lg overflow-hidden bg-gray-800"
                  activeOpacity={0.8}
                >
                  {community.banner ? (
                    <Image
                      source={{ uri: community.banner }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="bg-gray-900 w-full h-full" />
                  )}
                  <View className="absolute inset-0 bg-black/40 justify-end p-4">
                    <Text className="text-white text-lg font-medium">
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