import { create } from 'zustand';

interface AuthState {
  user: any | null;
  token: string | null;
  isCheckingAuth: boolean,
  setUser: (user: any) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isCheckingAuth: true,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearAuth: () => set({ token: null, user: null }),
}));
