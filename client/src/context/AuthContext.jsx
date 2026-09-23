import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('prepgenius_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('prepgenius_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('prepgenius_token');
      if (storedToken) {
        try {
          const res = await authService.getProfile();
          if (res?.success && res.user) {
            setUser(res.user);
            localStorage.setItem('prepgenius_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.warn('Session expired or invalid, logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res?.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('prepgenius_token', res.token);
      localStorage.setItem('prepgenius_user', JSON.stringify(res.user));
      return res;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const signup = async (userData) => {
    const res = await authService.signup(userData);
    if (res?.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('prepgenius_token', res.token);
      localStorage.setItem('prepgenius_user', JSON.stringify(res.user));
      return res;
    }
    throw new Error(res?.message || 'Signup failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('prepgenius_token');
    localStorage.removeItem('prepgenius_user');
  };

  const updateUserProfile = async (updates) => {
    const res = await authService.updateProfile(updates);
    if (res?.success && res.user) {
      setUser(res.user);
      localStorage.setItem('prepgenius_user', JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res?.message || 'Profile update failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
