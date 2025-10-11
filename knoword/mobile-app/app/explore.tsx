import { useEffect } from "react";
import { router } from "expo-router";

// Proxy navegable para /explore → redirige a /(tabs)/explore
export default function RedirectToExplore() {
  useEffect(() => {
    router.replace("/(tabs)/explore");
  }, []);

  return null;
}