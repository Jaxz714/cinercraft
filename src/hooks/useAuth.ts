import { create } from 'zustand';
import type { User } from '../types';
import { getCurrentUser, onAuthStateChange, signOut as authSignOut, clearDemoUser } from '../lib/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  initialize: () => {
    getCurrentUser().then((user) => {
      set({ user, isAuthenticated: !!user, isLoading: false });
    });
    
    const { data: { subscription } } = onAuthStateChange((user) => {
      set({ user, isAuthenticated: !!user });
    });
    
    return () => subscription.unsubscribe();
  },
  signOut: async () => {
    await authSignOut();
    clearDemoUser();
    set({ user: null, isAuthenticated: false });
  },
}));
