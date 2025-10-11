import { View } from "react-native";
import { useRouter } from "expo-router";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Si necesitas navegar desde el layout, puedes usar router.push("/ruta")
  // Por ejemplo: router.push("/login") al cerrar sesión

  return <View style={{ flex: 1 }}>{children}</View>;
}