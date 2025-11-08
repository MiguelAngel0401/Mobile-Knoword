import { useEffect } from "react";
import { router } from "expo-router";

export default function RedirectToCommunity() {
  useEffect(() => {
    router.replace("/(tabs)/community" as any);
  }, []);

  return null;
}