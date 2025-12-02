import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Home, Users, FileText } from "lucide-react-native";

export default function BottomTabs() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push("/profile")}
      >
        <Home
          size={28}
          color={
            pathname?.includes("/profile/index") || pathname === "/profile"
              ? "#3B82F6"
              : "#9CA3AF"
          }
        />
        <Text
          style={[
            styles.label,
            (pathname?.includes("/profile/index") || pathname === "/profile") &&
              styles.labelActive,
          ]}
        >
          Inicio
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push("/communities/my")}
      >
        <Users
          size={28}
          color={
            pathname?.includes("/communities/my") ||
            pathname?.includes("/communities")
              ? "#3B82F6"
              : "#9CA3AF"
          }
        />
        <Text
          style={[
            styles.label,
            (pathname?.includes("/communities/my") ||
              pathname?.includes("/communities")) &&
              styles.labelActive,
          ]}
        >
          Comunidades
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push("/post/blog")}
      >
        <FileText
          size={28}
          color={pathname?.includes("/post/blog") ? "#3B82F6" : "#9CA3AF"}
        />
        <Text
          style={[
            styles.label,
            pathname?.includes("/post/blog") && styles.labelActive,
          ]}
        >
          Blog
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    borderTopWidth: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
    fontWeight: "500",
  },
  labelActive: {
    color: "#3B82F6",
    fontWeight: "600",
  },
});