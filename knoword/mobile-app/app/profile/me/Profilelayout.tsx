import React from "react";
import { View, StyleSheet } from "react-native";
import LateralMenu from "../../../components/shared/LateraMenu";
import Navbar from "../../../components/ui/navbar/Navbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={styles.container}>
      {/* Navbar arriba */}
      <Navbar />

      {/* Contenedor principal */}
      <View style={styles.mainContent}>
        <LateralMenu />
        <View style={styles.childrenWrapper}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  childrenWrapper: {
    flex: 1,
  },
});