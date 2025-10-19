import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Posts() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Posts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",   // items-center
    justifyContent: "center", // justify-center
  },
  text: {
    color: "white",        // text-white
    fontSize: 18,          // text-lg
    fontWeight: "600",     // font-semibold
  },
});