import React from "react";
import { View, StyleSheet } from "react-native";
import { Banner } from "../../../src/components/profile/Banner";

export default function ProfilePage() {
  return (
    <View style={styles.container}>
      <Banner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});