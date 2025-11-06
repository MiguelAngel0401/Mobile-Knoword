import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Home, Compass, Users, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

const navigation = [
  { name: "Inicio", icon: Home },
  { name: "Explorar", icon: Compass },
  { name: "Comunidades", icon: Users, submenu: true },
];

const communitySubmenu = [
  { name: "Explorar Comunidades", route: "/communities/explore" },
  { name: "Comunidades a las que pertenezco", route: "/communities/user-communities" },
  { name: "Mis Comunidades", route: "/communities/my-communities" },
  { name: "Crear Comunidad", route: "/communities/create" },
];

export default function LateralMenu() {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const router = useRouter();

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuList}>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <View key={item.name} style={styles.menuItemWrapper}>
              {item.submenu ? (
                <View>
                  <TouchableOpacity
                    onPress={() => toggleSubmenu(item.name)}
                    style={styles.menuButton}
                  >
                    <View style={styles.menuButtonContent}>
                      <Icon size={20} color="white" />
                      <Text style={styles.menuText} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                    <ChevronRight
                      size={16}
                      color="white"
                      style={openSubmenu === item.name ? styles.rotateIcon : undefined}
                    />
                  </TouchableOpacity>

                  {openSubmenu === item.name && (
                    <View style={styles.submenuContainer}>
                      {communitySubmenu.map((subItem) => (
                        <TouchableOpacity
                          key={subItem.name}
                          style={styles.submenuButton}
                          onPress={() => router.push(subItem.route)}
                        >
                          <Text style={styles.submenuText}>{subItem.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => console.log("Navigate to", item.name)}
                >
                  <View style={styles.menuButtonContent}>
                    <Icon size={20} color="white" />
                    <Text style={styles.menuText} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  menuList: {
    flexDirection: "column",
  },
  menuItemWrapper: {
    marginBottom: 8,
  },
  menuButton: {
    width: "100%",
    minWidth: 220,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#1f2937",
  },
  menuButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    flexShrink: 1,
    flexGrow: 1,
    minWidth: 100,
    maxWidth: 200,
  },
  rotateIcon: {
    transform: [{ rotate: "90deg" }],
  },
  submenuContainer: {
    marginLeft: 24,
    marginTop: 8,
  },
  submenuButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#374151",
    marginBottom: 4,
  },
  submenuText: {
    color: "#D1D5DB",
  },
});