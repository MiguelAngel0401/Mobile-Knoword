import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { Avatar } from "../../../components/ui/userProfile/Avatar";
import Posts from "./Posts";
import Communities from "./Communities";
import Followers from "./Followers";
import { getMe } from "../../../../shared-core/src/services/users/userServices";
import { User } from "../../../../shared-core/src/types/users/user";
import ErrorMessageScreen from "@/components/shared/ErrorMessageScreen";
import privateApiClient from "../../../../shared-core/src/services/client/privateApiClient";


type ActiveTab = "posts" | "communities" | "followers";

export function Banner() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("posts");
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getMe(privateApiClient);
        setUserData(data.user);
        setError(null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("No pudimos cargar tu perfil. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return <ErrorMessageScreen error={error} />;
  }

  if (!userData) {
    return null;
  }

  const getButtonClasses = (tab: ActiveTab) => {
    if (activeTab === tab) {
      return "border-b-2 border-blue-500 text-white font-semibold px-4 py-2";
    }
    return "text-gray-400 px-4 py-2";
  };

  return (
    <ScrollView className="flex-1 w-full">
      {/* Sección superior */}
      <View className="w-full bg-[#1f1e28] text-white mt-4 px-6 py-8 rounded-md shadow-md">
        <View className="flex-col md:flex-row md:items-start md:justify-around gap-8">
          {/* Avatar + seguidores */}
          <View className="flex-col items-center gap-4">
            <Avatar src={userData.avatar || ""} size="lg" />

            <View className="flex-row gap-8 text-center">
              <View className="items-center">
                <Text className="text-xl font-semibold text-white">1</Text>
                <Text className="text-sm text-gray-400">Seguidores</Text>
              </View>
              <View className="items-center">
                <Text className="text-xl font-semibold text-white">1</Text>
                <Text className="text-sm text-gray-400">Siguiendo</Text>
              </View>
            </View>
          </View>

          {/* Información del usuario */}
          <View className="space-y-2 mt-6 md:mt-0">
            <Text className="text-3xl font-bold text-white text-center">
              {userData.username}
            </Text>
            <Text className="text-base text-gray-300 text-center">
              {userData.realName}
            </Text>
            <Text className="text-sm text-gray-400 text-center mt-2">
              {userData.bio}
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-evenly border-b border-gray-800 mt-6">
        <TouchableOpacity onPress={() => setActiveTab("posts")}>
          <Text className={getButtonClasses("posts")}>Publicaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("communities")}>
          <Text className={getButtonClasses("communities")}>Comunidades</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("followers")}>
          <Text className={getButtonClasses("followers")}>Seguidores</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido dinámico */}
      <View className="mt-6 px-4">
        {activeTab === "posts" && <Posts />}
        {activeTab === "communities" && <Communities />}
        {activeTab === "followers" && <Followers />}
      </View>
    </ScrollView>
  );
}