import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  avatar: string;
  active?: boolean;
}

export function MessageItem({ message }: { message: Message }) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: message.avatar }}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.sender}>{message.sender}</Text>
        <Text style={styles.message}>{message.message}</Text>
        <Text style={styles.time}>{message.time}</Text>
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
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  sender: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  message: {
    fontSize: 14,
    fontWeight: "300",
    color: "#E5E7EB",
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});