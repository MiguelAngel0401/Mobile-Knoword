import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Bell, Trophy, MessageSquare, Users } from "lucide-react-native";
import { NotificationItem } from "./NotificationItem";
import { MessageItem } from "./MessageItem";
import { CommunityUpdateItem } from "./CommunityUpdateItem";

type Notification = {
  id: number;
  type: "achievement" | "rank" | "achievement-knoword";
  title: string;
  date: string;
  points?: string;
  actionText?: string;
};

const notifications: Notification[] = [
  {
    id: 1,
    type: "achievement",
    title: "El primer brote desbloqueado.",
    points: "+5 ptos",
    date: "21/05/2025",
    actionText: "RECLAMA LA MEDALLA",
  },
  {
    id: 2,
    type: "rank",
    title: "Conseguiste nuevo rango Aspirante",
    date: "21/05/2025",
  },
  {
    id: 3,
    type: "achievement-knoword",
    title: "Espacio Brainly desbloqueado.",
    points: "+5 ptos",
    date: "12/05/2025",
  },
];

const messages = [
  {
    id: 1,
    sender: "Ana G.",
    message: "¡Hola! ¿Podrías ayudarme con un problema de física?",
    time: "Hace 5 min",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    sender: "Pedro L.",
    message: "Revisa mi última respuesta, creo que te servirá.",
    time: "Ayer",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

const communityUpdates = [
  {
    id: 1,
    title: "Nuevo evento: Maratón de Matemáticas",
    date: "20/06/25",
    description: "¡Inscríbete ya y demuestra tus habilidades!",
  },
  {
    id: 2,
    title: "Reglas actualizadas del foro",
    date: "15/06/2025",
    description: "Por favor, revisa los cambios para una mejor convivencia.",
  },
];

export function NotificationsMenu() {
  const [activeTab, setActiveTab] = useState<
    "notifications" | "messages" | "community"
  >("notifications");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      {/* Botón campana */}
      <TouchableOpacity onPress={() => setIsOpen(true)} style={styles.bellButton}>
        <Bell size={24} color="white" />
      </TouchableOpacity>

      {/* Modal de notificaciones */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity
                onPress={() => setActiveTab("notifications")}
                style={[
                  styles.tabButton,
                  activeTab === "notifications" && styles.tabButtonActive,
                ]}
              >
                <Trophy size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("messages")}
                style={[
                  styles.tabButton,
                  activeTab === "messages" && styles.tabButtonActive,
                ]}
              >
                <MessageSquare size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("community")}
                style={[
                  styles.tabButton,
                  activeTab === "community" && styles.tabButtonActive,
                ]}
              >
                <Users size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Contenido */}
            <ScrollView style={styles.scrollContent}>
              {activeTab === "notifications" && (
                <View>
                  <Text style={styles.sectionTitle}>Notificaciones</Text>
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <NotificationItem key={n.id} notification={n} />
                    ))
                  ) : (
                    <Text style={styles.emptyText}>
                      No tienes notificaciones de logros.
                    </Text>
                  )}
                </View>
              )}

              {activeTab === "messages" && (
                <View>
                  <Text style={styles.sectionTitle}>Mensajes</Text>
                  {messages.length > 0 ? (
                    messages.map((m) => <MessageItem key={m.id} message={m} />)
                  ) : (
                    <Text style={styles.emptyText}>No tienes mensajes.</Text>
                  )}
                </View>
              )}

              {activeTab === "community" && (
                <View>
                  <Text style={styles.sectionTitle}>Tus Comunidades</Text>
                  {communityUpdates.length > 0 ? (
                    communityUpdates.map((u) => (
                      <CommunityUpdateItem key={u.id} update={u} />
                    ))
                  ) : (
                    <Text style={styles.emptyText}>
                      No hay actualizaciones de la comunidad.
                    </Text>
                  )}
                </View>
              )}
            </ScrollView>

            {/* Botón cerrar */}
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bellButton: {
    padding: 8,
    borderRadius: 9999,
    backgroundColor: "#1f2937",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 320,
    maxHeight: 500,
    backgroundColor: "#1f1e28",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  tabButton: {
    padding: 8,
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: "#1f2937",
  },
  scrollContent: {
    maxHeight: 384,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontWeight: "700",
    fontSize: 18,
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  emptyText: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlign: "center",
    color: "#6b7280",
  },
  closeButton: {
    padding: 12,
    backgroundColor: "#dc2626",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});