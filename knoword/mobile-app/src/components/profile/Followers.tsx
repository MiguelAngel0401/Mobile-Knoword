import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Followers() {
  return (
    <View style={styles.container}>
      {/*<Text style={styles.text}>Followers</Text>*/}
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