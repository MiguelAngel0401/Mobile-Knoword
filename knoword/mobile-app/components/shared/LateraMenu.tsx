import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Home, Compass, Users, Bookmark, Settings, ChevronRight } from "lucide-react-native";

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
    <View className="p-4">
      <View className="flex-col space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <View key={item.name}>
              {item.submenu ? (
                <View>
                  <TouchableOpacity
                    onPress={() => toggleSubmenu(item.name)}
                    className="w-full flex-row items-center justify-between rounded-md py-2 px-4 bg-gray-800"
                  >
                    <View className="flex-row items-center space-x-2">
                      <Icon size={20} color="white" />
                      <Text className="text-white">{item.name}</Text>
                    </View>
                    <ChevronRight
                      size={16}
                      color="white"
                      className={openSubmenu === item.name ? "rotate-90" : ""}
                    />
                  </TouchableOpacity>

                  {openSubmenu === item.name && (
                    <View className="ml-6 mt-2 flex-col space-y-1">
                      {communitySubmenu.map((subItem) => (
                        <TouchableOpacity
                          key={subItem.name}
                          className="py-2 px-4 rounded-md bg-gray-700"
                          onPress={() => console.log("Navigate to", subItem.name)}
                        >
                          <Text className="text-gray-300">{subItem.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  className="flex-row items-center space-x-2 rounded-md py-2 px-4 bg-gray-800"
                  onPress={() => console.log("Navigate to", item.name)}
                >
                  <Icon size={20} color="white" />
                  <Text className="text-white">{item.name}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}