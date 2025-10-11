import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Pantallas de autenticación */}
        <Stack.Screen name="auth/login/LoginScreen" options={{ title: 'Login' }} />
        <Stack.Screen name="auth/register/RegisterScreen" options={{ title: 'Registro' }} />
        <Stack.Screen name="auth/forgot-password/ForgotPasswordScreen" options={{ title: 'Olvidé mi contraseña' }} />
        <Stack.Screen name="auth/reset-password/ResetPasswordScreen" options={{ title: 'Restablecer contraseña' }} />
        <Stack.Screen name="auth/verify-account/VerifyAccountScreen" options={{ title: 'Verificar cuenta' }} />
        <Stack.Screen name="auth/confirm-account/ConfirmAccountScreen" options={{ title: 'Confirmar cuenta' }} />

        {/* Pantallas de comunidad */}
        <Stack.Screen name="communities/create/CreateCommunitytScreen" options={{ title: 'Crear comunidad' }} />
        <Stack.Screen name="communities/explore/ExploreCommuntyScreen" options={{ title: 'Explorar comunidades' }} />
        <Stack.Screen name="communities/member/MemberCommunityScreen" options={{ title: 'Miembros' }} />
        <Stack.Screen name="communities/my/MyCommunityScreen" options={{ title: 'Mis comunidades' }} />
        <Stack.Screen name="communities/community/[idCommunity]/CommunityDetailScreen" options={{ title: 'Detalle comunidad' }} />
        <Stack.Screen name="communities/community/[idCommunity]/editar/EditCommunityScreen" options={{ title: 'Editar comunidad' }} />
        <Stack.Screen name="communities/[tag]/CommunityByTagScreen" options={{ title: 'Por etiqueta' }} />

        {/* Pantallas de perfil */}
        <Stack.Screen name="profile/[username]/ProfileScreen" options={{ title: 'Perfil público' }} />
        <Stack.Screen name="profile/me/Profile" options={{ title: 'Mi perfil' }} />
        <Stack.Screen name="profile/me/edit/ProfileEditorScreen" options={{ title: 'Editar perfil' }} />

        {/* Modales */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />

        {/* Navegación principal si usas tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}