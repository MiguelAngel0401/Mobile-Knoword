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
        Comunidades a las que pertenezco ({communities.length})
      </Text>

      {communities.length === 0 ? (
        <View className="items-center py-12">
          <View className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
          <Text className="text-lg font-medium text-white mb-1">
            Aún no perteneces a comunidades
          </Text>
          <Text className="text-gray-400">
            Únete a comunidades para empezar a colaborar
          </Text>
        </View>
      ) : (
        <View className="flex flex-wrap flex-row justify-between">
          {communities.map((community) => (
            <TouchableOpacity
              key={community.id}
              onPress={() =>
                router.push(`/communities/community/${community.id}` as any)
              }
              className="bg-gray-900 rounded-xl shadow-md overflow-hidden mb-6 w-full"
              activeOpacity={0.8}
            >
              {/* Banner */}
              <View className="h-32 bg-gray-800">
                {community.banner ? (
                  <Image
                    source={{ uri: community.banner.trim() }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500" />
                )}

                {/* Avatar */}
                <View className="absolute -bottom-8 left-4">
                  {community.avatar ? (
                    <Image
                      source={{ uri: community.avatar.trim() }}
                      className="w-16 h-16 rounded-full border-4 border-white"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-16 h-16 rounded-full border-4 border-white bg-gray-200 items-center justify-center">
                      <Text className="text-2xl font-bold text-gray-600">
                        {community.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Contenido */}
              <View className="pt-10 pb-6 px-4">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-xl font-bold text-white flex-1 mr-2">
                    {community.name}
                  </Text>
                  {community.isPrivate && (
                    <Text className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Privada
                    </Text>
                  )}
                </View>

                <Text className="text-gray-300 text-sm mb-4" numberOfLines={2}>
                  {community.description}
                </Text>

                {/* Etiquetas */}
                <View className="flex-row flex-wrap gap-1 mb-4">
                  {community.tags.slice(0, 3).map((tag) => (
                    <Text
                      key={tag.id}
                      className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-100 mr-1"
                    >
                      {tag.name}
                    </Text>
                  ))}
                  {community.tags.length > 3 && (
                    <Text className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                      +{community.tags.length - 3}
                    </Text>
                  )}
                </View>

                <View className="flex-row justify-between items-center text-xs">
                  <Text className="text-gray-400">
                    Creada: {formatDate(community.createdAt)}
                  </Text>
                  <Text className="text-gray-400">
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
  );
}