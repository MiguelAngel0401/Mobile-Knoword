import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Home,
  Compass,
  Users,
  Bookmark,
  Settings,
  ChevronRight,
} from "lucide-react-native";

const navigation = [
  { name: "Inicio", icon: Home },
  { name: "Explorar", icon: Compass },
  { name: "Comunidades", icon: Users, submenu: true },
  { name: "Cursos", icon: Bookmark },
  { name: "Configuración", icon: Settings },
];

const communitySubmenu = [
  { name: "Explorar Comunidades" },
  { name: "Comunidades a las que pertenezco" },
  { name: "Mis Comunidades" },
];

export default function LateralMenu() {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

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
                      <Text style={styles.menuText}>{item.name}</Text>
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
                          onPress={() => console.log("Navigate to", subItem.name)}
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
                    <Text style={styles.menuText}>{item.name}</Text>
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
  },
  menuText: {
    color: "white",
    marginLeft: 8,
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