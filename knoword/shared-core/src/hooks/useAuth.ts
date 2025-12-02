import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        clearAuth: () => set({ isAuthenticated: false }),
      }),
      {
        name: "auth-storage", 
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);
