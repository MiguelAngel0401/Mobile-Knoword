import { useEffect } from "react";
import { router } from "expo-router";

// Proxy navegable para /create → redirige a /(tabs)/create
export default function RedirectToCreate() {
  useEffect(() => {
    router.replace("/(tabs)/create" as any);
  }, []);

  return null;
}