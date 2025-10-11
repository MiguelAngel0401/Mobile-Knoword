import { useEffect } from "react";
import { router } from "expo-router";

// Proxy navegable para /login → redirige a /(auth)/login
export default function RedirectToLogin() {
  useEffect(() => {
    router.replace("/(auth)/login" as any);
  }, []);

  return null;
}