// Rutas para el stack de autenticación (no requiere login)
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ConfirmAccount: { token: string };
  VerifyAccount: undefined;
  ResetPassword: { uid: string; token: string };
};

// Rutas privadas (requieren autenticación)
export type AppStackParamList = {
  Profile: undefined;
  ProfileEditor: undefined;
};

// Rutas principales (comunidades, home, etc.)
export type RootStackParamList = {
  Home: undefined;
  CommunityScreen: { idCommunity: string };
  CommunityByTag: { tag: string };
  EditCommunity: { idCommunity: string };
};