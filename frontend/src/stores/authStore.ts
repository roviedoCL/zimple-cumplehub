import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; email: string; name: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuth: (token: string, user: { id: string; email: string; name: string }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: async (email: string, password: string) => {
        // TODO: Implement actual API call
        console.log('Login attempt:', email, password);
        // Mock successful login
        set({
          isAuthenticated: true,
          token: 'mock-token',
          user: { id: '1', email, name: 'Admin User' },
        });
      },
      logout: () => {
        set({ isAuthenticated: false, user: null, token: null });
      },
      setAuth: (token, user) => {
        set({ isAuthenticated: true, token, user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);