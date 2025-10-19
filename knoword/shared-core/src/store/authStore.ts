// shared-core/src/store/authStore.ts
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (value) => {
    console.log("🔧 setIsAuthenticated llamado con:", value);
    set({ isAuthenticated: value });
  },
  clearAuth: () => set({ isAuthenticated: false }),
}));