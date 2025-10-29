import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Menu } from "lucide-react-native";
import { ProfileMenu } from "../../components/ui/navbar/ProfileMenu";
import { Banner } from "../../../mobile-app/src/components/profile/Banner";
import Posts from "../../../mobile-app/src/components/profile/Posts";
import Followers from "../../../mobile-app/src/components/profile/Followers";
import Communities from "../../../mobile-app/src/components/profile/Communities";
import LateralMenu from "../../../mobile-app/components/shared/LateraMenu";

export default function ProfileIndex() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            style={styles.menuIcon}
          >
            <Menu size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.profileWrapper}>
            <ProfileMenu />
          </View>
        </View>

        {showMenu && (
          <View style={styles.lateralMenuWrapper}>
            <LateralMenu />
          </View>
        )}

        <View style={styles.card}>
          <Banner />
          <Posts />
          <Followers />
          <Communities />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    padding: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  menuIcon: {
    padding: 8,
  },
  profileWrapper: {
    alignItems: "flex-end",
  },
  lateralMenuWrapper: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});