// src/constants/routes.ts

export const ROUTES = {
  // 🟢 Rutas públicas (auth)
  login: "/login", // proxy → redirige a /(auth)/login
  register: "/register", // proxy → redirige a /(auth)/register
  confirmAccount: "/(auth)/confirm-account",
  forgotPassword: "/(auth)/forgot-password",
  resetPassword: "/(auth)/reset-password",
  verifyAccount: "/(auth)/verify-account",

  // 🔵 Rutas privadas (tabs)
  community: "/community", // proxy → redirige a /(tabs)/community
  create: "/create",       // proxy → redirige a /(tabs)/create
  explore: "/explore",     // proxy → redirige a /(tabs)/explore

  // 🟣 Rutas dinámicas
  communityByTag: (tag: string) => `/communities/${tag}`,
  communityDetail: (id: string) => `/communities/community/${id}`,
  communityEdit: (id: string) => `/communities/community/${id}/editar`,
};