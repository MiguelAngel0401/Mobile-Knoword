import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Calendar, Users, Tag, Lock, Globe } from "lucide-react-native";
import DeleteCommunityModal from "../../components/modals/DeleteCommunityModal";
import JoinCommunitySuccessModal from "../../components/modals/JoinCommunitySuccessModal";
import LeaveCommunityModal from "../../components/modals/LeaveCommunityModal";
import PostComponent from "../../components/ui/posts/PostActionComponent";
import { getCommunityById, joinCommunity } from "../../../../../shared-core/src/services/community/communityServices";
import type { Community } from "../../../../../shared-core/src/types/community";
import { styles } from "./styles";
import { useLocalSearchParams } from "expo-router";

export default function CommunityDetailScreen() {
    const { idCommunity } = useLocalSearchParams<{ idCommunity: string }>();


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
                console.error("❌ Error al cargar comunidad:", err);
                setError("No se pudo cargar la comunidad.");
            } finally {
                setLoading(false);
            }
        };
        if (idCommunity) {
            fetchCommunity();
        } else {
        }
    }, [idCommunity]);

    const handleJoin = async () => {
        try {
            setIsJoining(true);
            await joinCommunity(Number(idCommunity));
            setIsJoined(true);
            setCommunity((prev) => (prev ? { ...prev, isMember: true } : null));
            console.log("✅ Unión exitosa");
        } catch (err) {
            console.error("❌ Error al unirse:", err);
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (error || !community) {
        console.warn("⚠️ Error o comunidad no encontrada:", error);
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error || "Comunidad no encontrada."}
                </Text>
            </View>
        );
    }


    return (
        <ScrollView style={styles.container}>
            {/* Banner */}
            <View style={styles.bannerContainer}>
                {community.banner ? (
                    <Image
                        source={{ uri: community.banner }}
                        style={styles.banner}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.bannerPlaceholder}>
                        <Text style={styles.bannerPlaceholderText}>{community.name}</Text>
                    </View>
                )}
            </View>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
                {community.avatar ? (
                    <Image source={{ uri: community.avatar }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarPlaceholderText}>
                            {community.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>

            {/* Info principal */}
            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{community.name}</Text>
                    {community.isPrivate ? (
                        <Lock size={20} color="#F59E0B" />
                    ) : (
                        <Globe size={20} color="#3B82F6" />
                    )}
                </View>
                <Text style={styles.description}>{community.description}</Text>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                    {community.tags.map((tag) => (
                        <View key={tag.id} style={styles.tag}>
                            <Tag size={16} color="#2563EB" />
                            <Text style={styles.tagText}>{tag.name}</Text>
                        </View>
                    ))}
                </View>

                {community.isOwner && (
                    <Text style={styles.ownerText}>¡Eres dueño de esta comunidad!</Text>
                )}

                {/* Botones de acción */}
                <View style={styles.actionsContainer}>
                    {!community.isOwner && !community.isMember && (
                        <TouchableOpacity
                            style={styles.joinButton}
                            onPress={handleJoin}
                            disabled={isJoining}
                        >
                            <Text style={styles.buttonText}>
                                {isJoining ? "Uniendo..." : "Unirse"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {!community.isOwner && community.isMember && (
                        <TouchableOpacity
                            style={styles.leaveButton}
                            onPress={() => setIsLeaving(true)}
                        >
                            <Text style={styles.buttonText}>Salir</Text>
                        </TouchableOpacity>
                    )}

                    {community.isOwner && (
                        <>
                            <TouchableOpacity style={styles.editButton}>
                                <Text style={styles.buttonText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => setIsDeleting(true)}
                            >
                                <Text style={styles.buttonText}>Eliminar</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity style={styles.shareButton}>
                        <Text style={styles.shareButtonText}>Compartir</Text>
                    </TouchableOpacity>
                </View>

                {/* Info extra */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Calendar size={20} color="#6B7280" />
                        <Text style={styles.infoText}>
                            Creada: {formatDate(community.createdAt)}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Users size={20} color="#6B7280" />
                        <Text style={styles.infoText}>
                            Miembros: {community.memberCount}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Modales */}
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