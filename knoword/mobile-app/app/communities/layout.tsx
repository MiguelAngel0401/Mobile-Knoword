import { Tabs } from "expo-router";
import { Users, Compass, PlusCircle, User } from "lucide-react-native";

export default function CommunitiesLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#111827" }, // bg-gray-900
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#111827", // bg-gray-900
          borderTopColor: "#1f2937", // border-gray-800
        },
        tabBarActiveTintColor: "#3B82F6", // text-blue-500
        tabBarInactiveTintColor: "#9CA3AF", // text-gray-400
      }}
    >
      <Tabs.Screen
        name="explore/index"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="my/index"
        options={{
          title: "Mis comunidades",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="member/index"
        options={{
          title: "Soy miembro",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          title: "Crear",
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}