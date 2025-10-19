import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        {/* Input */}
        <TextInput
          placeholder="Busca cualquier tema en KnoWord"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        {/* Icono de búsqueda */}
        <View style={styles.iconWrapper}>
          <Search size={20} color="#9CA3AF" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // flex-row
    justifyContent: "center",
    paddingHorizontal: 16, // px-4
  },
  inputWrapper: {
    width: "100%",
    maxWidth: 480, // max-w-xl
    position: "relative",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    paddingLeft: 48, // pl-12
    paddingRight: 16, // pr-4
    paddingVertical: 8, // py-2
    borderRadius: 9999, // rounded-full
    backgroundColor: "#1f1e28",
    color: "white",
  },
  iconWrapper: {
    position: "absolute",
    left: 12, // left-3
    top: "50%",
    transform: [{ translateY: -10 }], // -translate-y-1/2 (ajustado al tamaño del icono)
  },
});