import React from "react";
import { View, StyleSheet } from "react-native";
import { Banner } from "../../../src/components/profile/Banner";
import BottomTabs from "../../../src/components/profile/BottomTabs";

export default function ProfilePage() {
  return (
    <View style={styles.container}>
      <Banner />
      
      {/* BottomTabs ligeramente más arriba */}
      <View style={styles.tabsWrapper}>
        <BottomTabs />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  tabsWrapper: {
    position: "absolute",
    bottom: 20, 
    left: 0,
    right: 0,
  },
});