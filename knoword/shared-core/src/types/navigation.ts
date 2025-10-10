export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ConfirmAccount: { token: string };
  VerifyAccount: undefined;
  ResetPassword: { uid: string; token: string };
  Profile: undefined;

};

// Root stack para comunidades y pantallas principales
export type RootStackParamList = {
  Home: undefined;
  CommunityScreen: { idCommunity: string };
  CommunityByTag: { tag: string };
  EditCommunity: { idCommunity: string };
};

