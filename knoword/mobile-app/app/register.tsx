import { useEffect } from "react";
import { router } from "expo-router";

// Proxy navegable para /register → redirige a /(auth)/register
export default function RedirectToRegister() {
  useEffect(() => {
    router.replace("/(auth)/register" as any);
  }, []);

  return null;
}