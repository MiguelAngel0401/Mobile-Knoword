export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ConfirmAccount: { token: string };
  VerifyAccount: undefined;
  ResetPassword: { uid: string; token: string };
  Profile: undefined;
};