import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Users } from "lucide-react-native";

interface CommunityUpdate {
  id: number;
  title: string;
  date: string;
  description: string;
  active?: boolean;
}

export function CommunityUpdateItem({ update }: { update: CommunityUpdate }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <Users size={24} color="#22C55E" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{update.title}</Text>
        <Text style={styles.description}>{update.description}</Text>
        <Text style={styles.date}>{update.date}</Text>
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
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
  description: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});