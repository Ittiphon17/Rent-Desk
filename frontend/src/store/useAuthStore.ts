"use client";

import { create } from 'zustand';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'tenant';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  initialize: () => void;
}

// Helper functions to manage cookies client-side
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });

    // 1. Basic space validation
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      set({
        isLoading: false,
        error: 'Username and password cannot be empty or contain only spaces.'
      });
      return false;
    }

    // 2. Simulated network request delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 3. Simple simulated credentials check
    // Accept "admin" / "111" or "tenant" / "333"
    const isAdmin = trimmedUsername === 'admin' && trimmedPassword === '111';
    const isTenant = trimmedUsername === 'tenant' && trimmedPassword === '333';

    if (isAdmin || isTenant) {
      const role = isAdmin ? 'admin' : 'tenant';
      const mockUser: User = {
        id: role === 'admin' ? 'usr-admin' : 'usr-tenant',
        username: trimmedUsername,
        email: `${trimmedUsername}@rentdesk.com`,
        role,
      };
      const token = `mock-token-${role}-${Date.now()}`;

      // Save state to localStorage for persistence
      localStorage.setItem('rent_desk_user', JSON.stringify(mockUser));
      localStorage.setItem('rent_desk_token_local', token);

      // Set cookies for Next.js 16 Server-Side Proxy Route Guard
      setCookie('rent_desk_token', token, 7);
      setCookie('rent_desk_role', role, 7);

      set({
        isAuthenticated: true,
        user: mockUser,
        accessToken: token,
        isLoading: false,
        error: null,
      });

      return true;
    } else {
      set({
        isLoading: false,
        error: 'Invalid username or password. (Hint: admin/111 or tenant/333)',
      });
      return false;
    }
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem('rent_desk_user');
    localStorage.removeItem('rent_desk_token_local');

    // Delete cookies
    deleteCookie('rent_desk_token');
    deleteCookie('rent_desk_role');

    // Reset store state
    set({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  initialize: () => {
    if (typeof window === 'undefined') return;
    
    const localUser = localStorage.getItem('rent_desk_user');
    const localToken = localStorage.getItem('rent_desk_token_local');
    const cookieToken = getCookie('rent_desk_token');
    const cookieRole = getCookie('rent_desk_role');

    // Sync Zustand state if localStorage and cookies match
    if (localUser && localToken && cookieToken === localToken) {
      try {
        const parsedUser = JSON.parse(localUser);
        if (parsedUser.role === cookieRole) {
          set({
            isAuthenticated: true,
            user: parsedUser,
            accessToken: localToken,
            error: null,
          });
        } else {
          throw new Error('Role mismatch');
        }
      } catch (e) {
        // Clear corrupt state
        localStorage.removeItem('rent_desk_user');
        localStorage.removeItem('rent_desk_token_local');
        deleteCookie('rent_desk_token');
        deleteCookie('rent_desk_role');
      }
    }
  }
}));
