import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { FileText, Users, UserPlus } from "lucide-react-native";
import { Avatar } from "../../../components/ui/userProfile/Avatar";
import Posts from "./Posts";
import Communities from "./Communities";
import Followers from "./Followers";
import { getMe } from "../../../../shared-core/src/services/users/userServices";
import { User } from "../../../../shared-core/src/types/users/user";
import ErrorMessageScreen from "../../../components/shared/ErrorMessageScreen";
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
        console.log("Perfil cargado:", data.user);
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
      <View style={styles.loadingContainer}>
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

  const isActive = (tab: ActiveTab) => activeTab === tab;

  const formatName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <View style={styles.container}>
      {/* Sección superior */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <Avatar src={userData.avatar || ""} size="xl" editable={true} />

            {/* Sección de seguidores/siguiendo (comentada por ahora) */}
            {/*
            <View style={styles.followSection}>
              <View style={styles.followItem}>
                <Text style={styles.followNumber}>1</Text>
                <Text style={styles.followLabel}>Seguidores</Text>
              </View>
              <View style={styles.followItem}>
                <Text style={styles.followNumber}>1</Text>
                <Text style={styles.followLabel}>Siguiendo</Text>
              </View>
            </View>
            */}
          </View>

          {/* Información del usuario */}
          <View style={styles.userInfo}>
            <Text style={styles.realName} numberOfLines={2}>
              {userData.realName
                ? formatName(userData.realName)
                : formatName(userData.username)}
            </Text>

            <Text style={styles.username} numberOfLines={1}>
              @{String(userData.username).trim()}
            </Text>

            {userData.bio && (
              <View style={styles.bioWrapper}>
                <Text style={styles.bio}>{userData.bio}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Tabs con iconos */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab("posts")}
          style={[styles.tabButton, isActive("posts") && styles.tabButtonActive]}
        >
          <FileText
            size={22}
            color={isActive("posts") ? "#3B82F6" : "#9ca3af"}
          />
          <Text
            style={[styles.tabText, isActive("posts") && styles.tabTextActive]}
          >
            Posts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("communities")}
          style={[
            styles.tabButton,
            isActive("communities") && styles.tabButtonActive,
          ]}
        >
          <Users
            size={22}
            color={isActive("communities") ? "#3B82F6" : "#9ca3af"}
          />
          <Text
            style={[
              styles.tabText,
              isActive("communities") && styles.tabTextActive,
            ]}
          >
            Comunidades
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("followers")}
          style={[
            styles.tabButton,
            isActive("followers") && styles.tabButtonActive,
          ]}
        >
          <UserPlus
            size={22}
            color={isActive("followers") ? "#3B82F6" : "#9ca3af"}
          />
          <Text
            style={[
              styles.tabText,
              isActive("followers") && styles.tabTextActive,
            ]}
          >
            Seguidores
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido dinámico */}
      <View style={styles.content}>
        {activeTab === "posts" && <Posts />}
        {activeTab === "communities" && <Communities />}
        {activeTab === "followers" && <Followers />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#111827",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  header: {
    width: "100%",
    backgroundColor: "#1f2937",
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  avatarSection: {
    alignItems: "center",
    gap: 20,
    width: "100%",
  },
  followSection: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginTop: 12,
    width: "100%",
  },
  followItem: {
    alignItems: "center",
    flex: 1,
    maxWidth: 120,
  },
  followNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3B82F6",
  },
  followLabel: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 4,
  },
  userInfo: {
    marginTop: 24,
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 8,
  },
  realName: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 6,
    width: "100%",
  },
  username: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 10,
    width: "100%",
  },
  bioWrapper: {
    width: "100%",
    paddingHorizontal: 12,
    marginTop: 10,
  },
  bio: {
    fontSize: 14,
    color: "#d1d5db",
    textAlign: "center",
    lineHeight: 20,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    marginTop: 28,
    width: "100%",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    gap: 6,
  },
  tabButtonActive: {
    borderBottomWidth: 3,
    borderBottomColor: "#3B82F6",
  },
  tabText: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
  },
  tabTextActive: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  content: {
    marginTop: 28,
    width: "100%",
    paddingHorizontal: 16,
  },
});