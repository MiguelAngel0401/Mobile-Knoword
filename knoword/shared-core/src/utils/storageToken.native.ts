import * as SecureStore from "expo-secure-store";

type Tokens = { accessToken: string; refreshToken: string };

export async function saveTokens(tokens: Tokens) {
  await SecureStore.setItemAsync("accessToken", tokens.accessToken);
  await SecureStore.setItemAsync("refreshToken", tokens.refreshToken);
}

export async function getTokens(): Promise<Tokens | null> {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
}