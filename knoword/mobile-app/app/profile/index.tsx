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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.menuIcon}>
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

      <Banner />
      <Posts />
      <Followers />
      <Communities />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "black",
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
});