import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Communities() {
  return (
    <View style={styles.container}>
      {/*<Text style={styles.text}>Communities</Text>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});