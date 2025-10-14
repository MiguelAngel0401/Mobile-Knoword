import React from "react";
import { View } from "react-native";
import LateralMenu from "../../../components/shared/LateraMenu";
import Navbar from "../../../components/ui/navbar/Navbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View className="flex-1 bg-black">
      {/* Navbar arriba */}
      <Navbar />

      {/* Contenedor principal */}
      <View className="flex-row flex-1">
        <LateralMenu />
        <View className="flex-1">{children}</View>
      </View>
    </View>
  );
}