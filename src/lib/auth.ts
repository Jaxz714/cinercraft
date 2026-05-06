import { supabase } from './supabase';
import type { User } from '../types';

const DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'demo@cinecraft.com',
  created_at: '2024-01-01T00:00:00Z',
};

const isDemoMode = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  return url.includes('your-project-id') || url === '';
};

export async function signIn(email: string, password: string) {
  if (isDemoMode()) {
    return {
      user: DEMO_USER,
      session: {
        access_token: 'demo-token',
        refresh_token: 'demo-refresh-token',
        expires_at: Date.now() + 3600000,
        token_type: 'bearer',
        user: {
          id: DEMO_USER.id,
          email: DEMO_USER.email,
          created_at: DEMO_USER.created_at,
          email_confirmed_at: DEMO_USER.created_at,
        },
      },
    };
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  if (isDemoMode()) {
    return {
      user: {
        id: 'new-user-id',
        email,
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
      },
      session: null,
    };
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (isDemoMode()) return;
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  if (isDemoMode()) {
    const storedUser = localStorage.getItem('cinecraft_demo_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || '',
    created_at: user.created_at,
  };
}

export async function getSession() {
  if (isDemoMode()) {
    return {
      access_token: 'demo-token',
      refresh_token: 'demo-refresh-token',
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: DEMO_USER,
    };
  }
  
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (isDemoMode()) {
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  }
  
  return supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        created_at: session.user.created_at,
      });
    } else {
      callback(null);
    }
  });
}

export function setDemoUser(user: User) {
  localStorage.setItem('cinecraft_demo_user', JSON.stringify(user));
}

export function clearDemoUser() {
  localStorage.removeItem('cinecraft_demo_user');
}

export { DEMO_USER };
