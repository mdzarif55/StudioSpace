'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { fetchAPI, setAuthToken, clearAuthToken, getAuthToken } from '../lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, photoURL?: string) => Promise<boolean>;
  loginWithGoogle: (email?: string, name?: string, photoURL?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  loginWithGoogle: async () => false,
  logout: async () => {},
  checkSession: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkSession = async () => {
    try {
      // Catch Google OAuth redirect token from URL if present
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const authTokenFromUrl = params.get('auth_token');
        if (authTokenFromUrl) {
          setAuthToken(authTokenFromUrl);
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          toast.success('Signed in with Google successfully!');
        }
      }

      // First check if cached user exists in localStorage for immediate hydration
      const cached = localStorage.getItem('studiospace_user');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          // ignore parsing error
        }
      }

      // Verify session with server using HTTPOnly cookie or stored token
      const res = await fetchAPI('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('studiospace_user', JSON.stringify(res.user));
      }
    } catch {
      // If token is invalid or expired
      if (!getAuthToken()) {
        setUser(null);
        localStorage.removeItem('studiospace_user');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) setAuthToken(res.token);
        localStorage.setItem('studiospace_user', JSON.stringify(res.user));
        toast.success(res.message || 'Welcome back to StudioSpace!');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, photoURL?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, photoURL }),
      });

      if (res.success) {
        toast.success('Account created! Please log in with your credentials.');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (
    email = 'marcus.creator@gmail.com',
    name = 'Marcus Sterling',
    photoURL = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // 1. Check if real Google OAuth 2.0 URL is configured on the backend
      try {
        const res = await fetchAPI('/auth/google/url');
        if (res.success && res.url) {
          window.location.href = res.url;
          return true;
        }
      } catch {
        // Fallback if client ID is pending configuration
      }

      // 2. Direct fallback authentication
      const res = await fetchAPI('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ email, name, photoURL }),
      });

      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) setAuthToken(res.token);
        localStorage.setItem('studiospace_user', JSON.stringify(res.user));
        toast.success(`Signed in as ${res.user.name}`);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Google authentication failed.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetchAPI('/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      setUser(null);
      clearAuthToken();
      localStorage.removeItem('studiospace_user');
      toast.info('You have been logged out.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

