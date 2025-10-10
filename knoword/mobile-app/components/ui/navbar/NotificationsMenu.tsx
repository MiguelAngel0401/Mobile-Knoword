import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
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
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="p-2 rounded-full bg-gray-800"
      >
        <Bell size={24} color="white" />
      </TouchableOpacity>

      {/* Modal de notificaciones */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 bg-black/70 justify-center items-center">
          <View className="w-80 max-h-[500px] bg-[#1f1e28] rounded-md shadow-lg">
            {/* Tabs */}
            <View className="flex-row justify-around items-center py-3 border-b border-gray-700">
              <TouchableOpacity
                onPress={() => setActiveTab("notifications")}
                className={`p-2 rounded-md ${
                  activeTab === "notifications"
                    ? "bg-gray-800"
                    : "bg-transparent"
                }`}
              >
                <Trophy size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("messages")}
                className={`p-2 rounded-md ${
                  activeTab === "messages" ? "bg-gray-800" : "bg-transparent"
                }`}
              >
                <MessageSquare size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("community")}
                className={`p-2 rounded-md ${
                  activeTab === "community" ? "bg-gray-800" : "bg-transparent"
                }`}
              >
                <Users size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Contenido */}
            <ScrollView className="max-h-96">
              {activeTab === "notifications" && (
                <View>
                  <Text className="px-4 py-4 font-bold text-lg text-white border-b border-gray-700">
                    Notificaciones
                  </Text>
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <NotificationItem key={n.id} notification={n} />
                    ))
                  ) : (
                    <Text className="px-4 py-3 text-center text-gray-500">
                      No tienes notificaciones de logros.
                    </Text>
                  )}
                </View>
              )}

              {activeTab === "messages" && (
                <View>
                  <Text className="px-4 py-4 font-bold text-lg text-white border-b border-gray-700">
                    Mensajes
                  </Text>
                  {messages.length > 0 ? (
                    messages.map((m) => <MessageItem key={m.id} message={m}  />)
                  ) : (
                    <Text className="px-4 py-3 text-center text-gray-500">
                      No tienes mensajes.
                    </Text>
                  )}
                </View>
              )}

              {activeTab === "community" && (
                <View>
                  <Text className="px-4 py-4 font-bold text-lg text-white border-b border-gray-700">
                    Tus Comunidades
                  </Text>
                  {communityUpdates.length > 0 ? (
                    communityUpdates.map((u) => (
                      <CommunityUpdateItem key={u.id} update={u} />
                    ))
                  ) : (
                    <Text className="px-4 py-3 text-center text-gray-500">
                      No hay actualizaciones de la comunidad.
                    </Text>
                  )}
                </View>
              )}
            </ScrollView>

            {/* Botón cerrar */}
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              className="p-3 bg-red-600 rounded-b-md"
            >
              <Text className="text-white text-center font-semibold">
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}