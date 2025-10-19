import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
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

  const getButtonStyle = (tab: ActiveTab) => {
    if (activeTab === tab) {
      return [styles.tabText, styles.tabTextActive];
    }
    return [styles.tabText, styles.tabTextInactive];
  };

  return (
    <ScrollView style={styles.scroll}>
      {/* Sección superior */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Avatar + seguidores */}
          <View style={styles.avatarSection}>
            <Avatar src={userData.avatar || ""} size="lg" />

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
          </View>

          {/* Información del usuario */}
          <View style={styles.userInfo}>
           <Text style={styles.username}>{userData.username}</Text>
<Text style={styles.realName}>{userData.realName}</Text>
<View style={styles.bioWrapper}>
  <Text style={styles.bio}>{userData.bio}</Text>
</View>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab("posts")}>
          <Text style={getButtonStyle("posts")}>Publicaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("communities")}>
          <Text style={getButtonStyle("communities")}>Comunidades</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("followers")}>
          <Text style={getButtonStyle("followers")}>Seguidores</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido dinámico */}
      <View style={styles.content}>
        {activeTab === "posts" && <Posts />}
        {activeTab === "communities" && <Communities />}
        {activeTab === "followers" && <Followers />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, width: "100%" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    width: "100%",
    backgroundColor: "#1f1e28",
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  headerContent: {
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  avatarSection: {
    alignItems: "center",
    gap: 16,
  },
  followSection: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
  },
  followItem: { alignItems: "center" },
  followNumber: { fontSize: 20, fontWeight: "600", color: "white" },
  followLabel: { fontSize: 14, color: "#9ca3af" },
  userInfo: { marginTop: 24, alignItems: "center" },
  username: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    flexShrink: 1,
  },
  realName: {
    fontSize: 16,
    color: "#d1d5db",
    textAlign: "center",
    flexShrink: 1,
  },
  bioWrapper: {
    width: "100%",
    paddingHorizontal: 8,
  },
  bio: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    flexWrap: "wrap",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
    marginTop: 24,
  },
  tabText: { paddingVertical: 8, paddingHorizontal: 16 },
  tabTextActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#3B82F6",
    color: "white",
    fontWeight: "600",
  },
  tabTextInactive: { color: "#9ca3af" },
  content: { marginTop: 24, paddingHorizontal: 16 },
});