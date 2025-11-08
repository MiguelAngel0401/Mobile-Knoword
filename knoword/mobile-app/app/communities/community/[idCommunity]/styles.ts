import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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