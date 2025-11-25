import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Home, Users, User } from "lucide-react-native";

export default function BottomTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.includes(path);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push("/(tabs)/")}
      >
        <Home 
          size={28} 
          color={isActive("/") && !isActive("/communities") && !isActive("/profile") ? "#3B82F6" : "#9CA3AF"} 
        />
        <Text 
          style={[
            styles.label,
            isActive("/") && !isActive("/communities") && !isActive("/profile") && styles.labelActive
          ]}
        >
          Inicio
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push("/(tabs)/communities")}
      >
        <Users 
          size={28} 
          color={isActive("/communities") ? "#3B82F6" : "#9CA3AF"} 
        />
        <Text 
          style={[
            styles.label,
            isActive("/communities") && styles.labelActive
          ]}
        >
          Comunidades
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push("/(tabs)/profile")}
      >
        <User 
          size={28} 
          color={isActive("/profile") ? "#3B82F6" : "#9CA3AF"} 
        />
        <Text 
          style={[
            styles.label,
            isActive("/profile") && styles.labelActive
          ]}
        >
          Perfil
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