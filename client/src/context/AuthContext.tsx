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
  updateUserProfile: (data: Partial<User> & { currentPassword?: string; newPassword?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  loginWithGoogle: async () => false,
  logout: async () => {},
  checkSession: async () => {},
  updateUserProfile: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkSession = async () => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);

        // 1. Check if token returned from server-side callback
        const authTokenFromUrl = params.get('auth_token');
        if (authTokenFromUrl) {
          setAuthToken(authTokenFromUrl);
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          toast.success('Signed in with Google successfully!');
        }

        // 2. Check if authorization code returned from client-side redirect
        const codeFromUrl = params.get('code');
        if (codeFromUrl) {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          try {
            const redirectUri = window.location.origin + cleanUrl;
            const res = await fetchAPI('/auth/google/code', {
              method: 'POST',
              body: JSON.stringify({ code: codeFromUrl, redirectUri }),
            });
            if (res.success && res.user) {
              setUser(res.user);
              if (res.token) setAuthToken(res.token);
              localStorage.setItem('studiospace_user', JSON.stringify(res.user));
              toast.success(`Welcome ${res.user.name}! Signed in with Google.`);
              return;
            }
          } catch (codeErr: any) {
            console.error('Google code auth error:', codeErr);
          }
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

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Call backend to get original Google OAuth 2.0 Consent URL
      const res = await fetchAPI('/auth/google/url');
      if (res.success && res.url) {
        // Redirect directly to official Google Accounts login screen
        window.location.href = res.url;
        return true;
      } else {
        toast.error(res.message || 'Google Client ID is missing in server/.env');
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to initiate Google authentication.');
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

  const updateUserProfile = async (
    data: Partial<User> & { currentPassword?: string; newPassword?: string }
  ): Promise<boolean> => {
    try {
      const res = await fetchAPI('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) setAuthToken(res.token);
        localStorage.setItem('studiospace_user', JSON.stringify(res.user));
        toast.success(res.message || 'Profile updated successfully!');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
      return false;
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
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

