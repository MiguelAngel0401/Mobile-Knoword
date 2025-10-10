import React from "react";
import { View, TextInput } from "react-native";
import { Search } from "lucide-react-native";

export default function SearchBar() {
  return (
    <View className="flex-1 flex-row justify-center px-4">
      <View className="relative w-full max-w-xl">
        {/* Input */}
        <TextInput
          placeholder="Busca cualquier tema en KnoWord"
          placeholderTextColor="#9CA3AF"
          className="w-full pl-12 pr-4 py-2 rounded-full bg-[#1f1e28] text-white"
        />

        {/* Icono de búsqueda */}
        <View className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search size={20} color="#9CA3AF" />
        </View>
      </View>
    </View>
  );
}