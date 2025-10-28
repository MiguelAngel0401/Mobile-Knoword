import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (error || !community) {
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
            <View style={styles.bannerContainer}>
                {community.banner ? (
                    <Image
                        source={{ uri: community.banner }}
                        style={styles.banner}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.bannerPlaceholder}>
                        <Text style={styles.bannerPlaceholderText}>
                            {community.name}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.avatarContainer}>
                {community.avatar ? (
                    <Image
                        source={{ uri: community.avatar }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarPlaceholderText}>
                            {community.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        {community.name}
                    </Text>
                    {community.isPrivate ? (
                        <Lock size={20} color="#F59E0B" />
                    ) : (
                        <Globe size={20} color="#3B82F6" />
                    )}
                </View>
                <Text style={styles.description}>
                    {community.description}
                </Text>

                <View style={styles.tagsContainer}>
                    {community.tags.map((tag) => (
                        <View key={tag.id} style={styles.tag}>
                            <Tag size={16} color="#2563EB" />
                            <Text style={styles.tagText}>
                                {tag.name}
                            </Text>
                        </View>
                    ))}
                </View>

                {community.isOwner && (
                    <Text style={styles.ownerText}>
                        ¡Eres dueño de esta comunidad!
                    </Text>
                )}

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
                    <View style={styles.infoRow}>
                        <View style={styles.creatorAvatar} />
                        <View style={styles.creatorInfo}>
                            <Text style={styles.creatorLabel}>
                                Creador
                            </Text>
                            <Text style={styles.creatorName}>
                                Usuario
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.navigation}>
                    <View style={styles.navigationTabs}>
                        <Text style={styles.navigationActive}>Publicaciones</Text>
                        <Text style={styles.navigationInactive}>Encuestas</Text>
                        <Text style={styles.navigationInactive}>Miembros</Text>
                    </View>
                </View>
            </View>

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

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#ef4444',
    },
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    bannerContainer: {
        height: 256,
        width: '100%',
    },
    banner: {
        width: '100%',
        height: '100%',
    },
    bannerPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerPlaceholderText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    avatarContainer: {
        position: 'absolute',
        top: 208,
        left: 24,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 4,
        borderColor: '#ffffff',
    },
    avatarPlaceholder: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 4,
        borderColor: '#ffffff',
        backgroundColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#4b5563',
    },
    content: {
        marginTop: 80,
        paddingHorizontal: 24,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginRight: 8,
    },
    description: {
        color: '#d1d5db',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        backgroundColor: '#1e3a8a',
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#bfdbfe',
    },
    ownerText: {
        color: '#ca8a04',
        fontStyle: 'italic',
        marginTop: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
    },
    joinButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#2563eb',
        borderRadius: 8,
        marginRight: 12,
        marginBottom: 12,
    },
    leaveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#6b7280',
        borderRadius: 8,
        marginRight: 12,
        marginBottom: 12,
    },
    editButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#2563eb',
        borderRadius: 8,
        marginRight: 12,
        marginBottom: 12,
    },
    deleteButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#dc2626',
        borderRadius: 8,
        marginRight: 12,
        marginBottom: 12,
    },
    shareButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        marginRight: 12,
        marginBottom: 12,
    },
    buttonText: {
        color: '#ffffff',
    },
    shareButtonText: {
        color: '#d1d5db',
    },
    infoSection: {
        marginTop: 32,
        borderTopWidth: 1,
        borderTopColor: '#d1d5db',
        paddingTop: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoText: {
        marginLeft: 8,
        color: '#9ca3af',
    },
    creatorAvatar: {
        width: 64,
        height: 64,
        backgroundColor: '#e5e7eb',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 12,
    },
    creatorInfo: {
        marginLeft: 12,
    },
    creatorLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    creatorName: {
        fontWeight: '500',
        color: '#ffffff',
    },
    navigation: {
        marginTop: 48,
    },
    navigationTabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
        paddingVertical: 8,
    },
    navigationActive: {
        color: '#2563eb',
        fontWeight: '500',
    },
    navigationInactive: {
        color: '#9ca3af',
    },
});