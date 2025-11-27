import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
        }}
      >
        {/* Pantalla raíz */}
        <Stack.Screen
          name="index"
          options={{ title: 'Inicio', headerShown: false }}
        />

        {/* Autenticación */}
        <Stack.Screen name="auth/login/LoginScreen" options={{ title: 'Login' }} />
        <Stack.Screen name="auth/register/RegisterScreen" options={{ title: 'Registro' }} />
        <Stack.Screen name="auth/forgot-password/ForgotPasswordScreen" options={{ title: 'Olvidé mi contraseña' }} />
        <Stack.Screen name="auth/reset-password/ResetPasswordScreen" options={{ title: 'Restablecer contraseña' }} />
        <Stack.Screen name="auth/verify-account/VerifyAccountScreen" options={{ title: 'Verificar cuenta' }} />
        <Stack.Screen name="auth/confirm-account/ConfirmAccountScreen" options={{ title: 'Confirmar cuenta' }} />

        {/* Comunidad */}
        <Stack.Screen name="create/index" options={{ title: 'Crear Comunidad' }} />
        <Stack.Screen name="explore/index" options={{ title: 'Explorar Comunidades' }} />
        <Stack.Screen name="communities/member/index" options={{ title: 'Miembros' }} />
        <Stack.Screen name="communities/my/index" options={{ title: 'Mis comunidades' }} />
        <Stack.Screen name="communities/community/[idCommunity]/index" options={{ title: 'Detalle comunidad' }} />
        <Stack.Screen name="communities/community/[idCommunity]/editar/index" options={{ title: 'Editar comunidad' }} />
        <Stack.Screen name="communities/[tag]/index" options={{ title: 'Por etiqueta' }} />

        {/* Perfil */}
        <Stack.Screen
          name="profile/index"
          options={{
            title: 'Perfil',
            headerShown: true,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="profile/[username]/ProfileScreen"
          options={{ title: 'Perfil público' }}
        />
        <Stack.Screen
          name="profile/me/Profile"
          options={{ title: 'Mi perfil' }}
        />
        <Stack.Screen
          name="profile/me/edit/ProfileEditorScreen"
          options={{ title: 'Editar perfil' }}
        />

        <Stack.Screen
          name="post/blog/index"
          options={{ title: 'Blog' }}
        />

        <Stack.Screen
  name="post/blog/create/CreatePostScreen"
  options={{ title: 'Crear Post' }}
/>

        {/* Modal */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      <StatusBar style="light" />
    </ThemeProvider>
  );
}