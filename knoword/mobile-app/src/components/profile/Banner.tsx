import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Avatar } from "../../../components/ui/userProfile/Avatar";
import { getMe } from "../../../../shared-core/src/services/users/userServices";
import { User } from "../../../../shared-core/src/types/users/user";
import ErrorMessageScreen from "../../../components/shared/ErrorMessageScreen";
import privateApiClient from "../../../../shared-core/src/services/client/privateApiClient";
import BottomTabs from "../../components/profile/BottomTabs";

export function Banner() {
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

  const formatName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sección superior con avatar e info */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.avatarSection}>
              <Avatar src={userData.avatar || ""} size="xl" editable={true} />
            </View>

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
      </ScrollView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#111827",
    position: "relative",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center", 
    alignItems: "center",
    paddingBottom: 100,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  header: {
    width: "90%", 
    maxWidth: 400, 
    backgroundColor: "#1f2937",
    marginTop: 0, 
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
});