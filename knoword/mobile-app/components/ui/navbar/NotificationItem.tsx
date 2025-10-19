import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Trophy, Users } from "lucide-react-native";

interface Notification {
  id: number;
  type: "achievement" | "rank" | "achievement-knoword";
  title: string;
  date: string;
  points?: string;
  actionText?: string;
  active?: boolean;
}

export function NotificationItem({ notification }: { notification: Notification }) {
  const renderIcon = () => {
    switch (notification.type) {
      case "achievement":
        return (
          <View style={[styles.iconWrapper, styles.iconBlue]}>
            <Trophy size={24} color="#3B82F6" />
          </View>
        );
      case "rank":
        return (
          <View style={[styles.iconWrapper, styles.iconPink]}>
            <Text style={styles.rankStar}>★</Text>
          </View>
        );
      case "achievement-knoword":
        return (
          <View style={[styles.iconWrapper, styles.iconPurple]}>
            <Users size={24} color="#A855F7" />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{renderIcon()}</View>

      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>

        {notification.points && (
          <Text style={styles.pointsText}>
            <Text style={styles.pointsValue}>{notification.points}</Text> añadidos a tu cuenta.
          </Text>
        )}

        <Text style={styles.date}>{notification.date}</Text>

        {notification.actionText && (
          <TouchableOpacity
            onPress={() => console.log("Acción:", notification.actionText)}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>{notification.actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  iconContainer: {
    marginRight: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBlue: {
    backgroundColor: "#DBEAFE",
  },
  iconPink: {
    backgroundColor: "#FCE7F3",
  },
  iconPurple: {
    backgroundColor: "#F3E8FF",
  },
  rankStar: {
    color: "#EC4899",
    fontWeight: "700",
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
  pointsText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  pointsValue: {
    fontWeight: "700",
    color: "#22C55E",
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  actionButton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#2563EB",
    borderRadius: 9999,
    alignSelf: "flex-start",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});