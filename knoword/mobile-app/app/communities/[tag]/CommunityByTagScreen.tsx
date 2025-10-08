import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getCommunitiesByTag } from "@shared/services/community/communityServices";
import { Community } from "@shared/types/community/community";
import ErrorMessageScreen from "@components/shared/ErrorMessageScreen";

export default function CommunityByTagScreen() {
    const route = useRoute();
    const navigation = useNavigation();
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
            <View className="flex-1 justify-center items-center bg-black">
                <View className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin" />
            </View>
        );
    }

    if (errorFetchingCommunities) {
        return <ErrorMessageScreen error={errorFetchingCommunities} />;
    }

    return (
        <View className="flex-1 bg-black px-4 pt-6">
            <Text className="text-white text-2xl font-bold mb-6 capitalize">
                Comunidades de {tag}
            </Text>

            <FlatList
                data={communities}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 32 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="bg-[#1f1f1f] rounded-xl mb-6 overflow-hidden"
                        onPress={() => navigation.navigate("CommunityScreen", { idCommunity: item.id })}
                    >
                        {/* Banner */}
                        <View className="h-24 relative">
                            {item.banner ? (
                                <Image source={{ uri: item.banner }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <View className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
                            )}

                            {/* Avatar */}
                            <View className="absolute -bottom-6 left-4">
                                {item.avatar ? (
                                    <Image
                                        source={{ uri: item.avatar }}
                                        className="w-12 h-12 rounded-full border-2 border-[#121212]"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="w-12 h-12 rounded-full border-2 border-[#121212] bg-gray-700 flex items-center justify-center">
                                        <Text className="text-white font-bold text-lg">
                                            {item.name.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Privacidad */}
                            {item.isPrivate && (
                                <View className="absolute top-2 right-2 bg-yellow-500 px-2 py-1 rounded-full">
                                    <Text className="text-yellow-900 text-xs font-medium">Privada</Text>
                                </View>
                            )}
                        </View>

                        {/* Contenido */}
                        <View className="pt-8 pb-4 px-4">
                            <Text className="text-white text-lg font-bold mb-1 truncate">
                                {item.name}
                            </Text>

                            <Text className="text-gray-400 text-sm mb-3" numberOfLines={2}>
                                {item.description}
                            </Text>

                            {/* Tags */}
                            <View className="flex-row flex-wrap gap-1 mb-3">
                                {item.tags.slice(0, 2).map((tag) => (
                                    <View key={tag.id} className="px-2 py-1 rounded-full bg-blue-900">
                                        <Text className="text-blue-200 text-xs font-medium">{tag.name}</Text>
                                    </View>
                                ))}
                                {item.tags.length > 2 && (
                                    <View className="px-2 py-1 rounded-full bg-gray-700">
                                        <Text className="text-gray-300 text-xs font-medium">
                                            +{item.tags.length - 2}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Footer */}
                            <View className="flex-row justify-between items-center text-xs text-gray-500">
                                <Text className="text-xs text-gray-400">Creada: {formatDate(item.createdAt)}</Text>
                                <Text className="text-xs text-gray-400">👥 {item.memberCount}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}