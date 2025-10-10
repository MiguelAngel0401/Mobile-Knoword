import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Calendar, Users, Tag, Lock, Globe } from "lucide-react-native";
import DeleteCommunityModal from "../../components/modals/DeleteCommunityModal";
import JoinCommunitySuccessModal from "../../components/modals/JoinCommunitySuccessModal";
import LeaveCommunityModal from "../../components/modals/LeaveCommunityModal";
import PostComponent from "../../components/ui/posts/PostActionComponent";
import { getCommunityById, joinCommunity } from "../../../../../shared-core/src/services/community/communityServices";
import type { Community } from "../../../../../shared-core/src/types/community"; 

export default function CommunityDetailScreen() {
    const route = useRoute();
    const { idCommunity } = route.params as { idCommunity: number };

    const [community, setCommunity] = useState<Community | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const data = await getCommunityById(String(idCommunity));
                setCommunity(data);
            } catch (err) {
                setError("No se pudo cargar la comunidad.");
            } finally {
                setLoading(false);
            }
        };
        fetchCommunity();
    }, [idCommunity]);

    const handleJoin = async () => {
        try {
            setIsJoining(true);
            await joinCommunity(idCommunity);
            setIsJoined(true);
            setCommunity((prev) => (prev ? { ...prev, isMember: true } : null));
        } catch {
            setError("Error al unirse a la comunidad.");
        } finally {
            setIsJoining(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (error || !community) {
        return (
            <View className="flex-1 justify-center items-center px-4">
                <Text className="text-center text-lg text-red-500">
                    {error || "Comunidad no encontrada."}
                </Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white dark:bg-black">
            {/* Banner */}
            <View className="h-64 w-full">
                {community.banner ? (
                    <Image
                        source={{ uri: community.banner }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-full bg-blue-500 justify-center items-center">
                        <Text className="text-white text-2xl font-bold">
                            {community.name}
                        </Text>
                    </View>
                )}
            </View>

            {/* Avatar */}
            <View className="absolute top-52 left-6">
                {community.avatar ? (
                    <Image
                        source={{ uri: community.avatar }}
                        className="w-24 h-24 rounded-full border-4 border-white"
                    />
                ) : (
                    <View className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 justify-center items-center">
                        <Text className="text-3xl font-bold text-gray-600">
                            {community.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>

            {/* Info */}
            <View className="mt-20 px-6">
                <View className="flex-row items-center gap-2 mb-2">
                    <Text className="text-2xl font-bold text-black dark:text-white">
                        {community.name}
                    </Text>
                    {community.isPrivate ? (
                        <Lock size={20} color="#F59E0B" />
                    ) : (
                        <Globe size={20} color="#3B82F6" />
                    )}
                </View>
                <Text className="text-gray-600 dark:text-gray-300">
                    {community.description}
                </Text>

                {/* Tags */}
                <View className="flex-row flex-wrap gap-2 mt-4">
                    {community.tags.map((tag) => (
                        <View
                            key={tag.id}
                            className="flex-row items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900"
                        >
                            <Tag size={16} color="#2563EB" />
                            <Text className="ml-1 text-sm text-blue-800 dark:text-blue-100">
                                {tag.name}
                            </Text>
                        </View>
                    ))}
                </View>

                {community.isOwner && (
                    <Text className="text-yellow-600 italic mt-4">
                        ¡Eres dueño de esta comunidad!
                    </Text>
                )}
                {/* Botones de acción */}
                <View className="flex-row flex-wrap gap-3 mt-6">
                    {!community.isOwner && !community.isMember && (
                        <TouchableOpacity
                            className="px-4 py-2 bg-blue-600 rounded-lg"
                            onPress={handleJoin}
                            disabled={isJoining}
                        >
                            <Text className="text-white">
                                {isJoining ? "Uniendo..." : "Unirse"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {!community.isOwner && community.isMember && (
                        <TouchableOpacity
                            className="px-4 py-2 bg-gray-500 rounded-lg"
                            onPress={() => setIsLeaving(true)}
                        >
                            <Text className="text-white">Salir</Text>
                        </TouchableOpacity>
                    )}

                    {community.isOwner && (
                        <>
                            <TouchableOpacity className="px-4 py-2 bg-blue-600 rounded-lg">
                                <Text className="text-white">Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="px-4 py-2 bg-red-600 rounded-lg"
                                onPress={() => setIsDeleting(true)}
                            >
                                <Text className="text-white">Eliminar</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity className="px-4 py-2 border border-gray-300 rounded-lg">
                        <Text className="text-gray-700 dark:text-gray-300">Compartir</Text>
                    </TouchableOpacity>
                </View>

                {/* Información adicional */}
                <View className="mt-8 border-t border-gray-300 pt-4">
                    <View className="flex-row items-center mb-4">
                        <Calendar size={20} color="#6B7280" />
                        <Text className="ml-2 text-gray-700 dark:text-gray-400">
                            Creada: {formatDate(community.createdAt)}
                        </Text>
                    </View>
                    <View className="flex-row items-center mb-4">
                        <Users size={20} color="#6B7280" />
                        <Text className="ml-2 text-gray-700 dark:text-gray-400">
                            Miembros: {community.memberCount}
                        </Text>
                    </View>
                    <View className="flex-row items-center mb-4">
                        <View className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-xl" />
                        <View className="ml-3">
                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                                Creador
                            </Text>
                            <Text className="font-medium text-gray-900 dark:text-white">
                                Usuario
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Navegación de secciones */}
                <View className="mt-12">
                    <View className="flex-row justify-around border-b border-gray-700 py-2">
                        <Text className="text-blue-600 font-medium">Publicaciones</Text>
                        <Text className="text-gray-400">Encuestas</Text>
                        <Text className="text-gray-400">Miembros</Text>
                    </View>
                    {/*<PostComponent />*/}
                </View>
            </View>

            {/* Modals */}
            {isDeleting && (
                <DeleteCommunityModal
                    isOpen={isDeleting}
                    onClose={() => setIsDeleting(false)}
                    communityName={community.name}
                    communityId={community.id}
                />
            )}
            {isJoined && (
                <JoinCommunitySuccessModal
                    isOpen={isJoined}
                    onClose={() => setIsJoined(false)}
                    communityName={community.name}
                />
            )}
            {isLeaving && (
                <LeaveCommunityModal
                    isOpen={isLeaving}
                    onClose={() => setIsLeaving(false)}
                    communityName={community.name}
                    communityId={community.id}
                />
            )}
        </ScrollView>
    );
}