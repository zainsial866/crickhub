'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { ROLE_HOME_ROUTES } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  signup: (name: string, email: string, role?: UserRole) => Promise<void>;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const DEFAULT_USER: User = {
  id: 'user-player-1',
  name: 'Zain Sial',
  email: 'zain@crickethub.pk',
  phone: '0300-1234567',
  role: 'player',
  createdAt: '2026-08-01T00:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('crickethub_token');
      const savedUser = localStorage.getItem('crickethub_user');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } else {
        // Provide default player user for smooth immediate exploration
        setUser(DEFAULT_USER);
        setToken('mock_jwt_token_demo_zain');
        localStorage.setItem('crickethub_user', JSON.stringify(DEFAULT_USER));
        localStorage.setItem('crickethub_token', 'mock_jwt_token_demo_zain');
      }
    } catch {
      setUser(DEFAULT_USER);
      setToken('mock_jwt_token_demo_zain');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, role: UserRole = 'player') => {
    setIsLoading(true);
    const mockUser: User = {
      id: `user-${role}-demo`,
      name: role === 'ground_owner' ? 'Hamid Ali (Owner)' : role === 'admin' ? 'Zain (Admin)' : 'Zain Sial',
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    const mockToken = `mock_jwt_${role}_${Date.now()}`;
    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('crickethub_user', JSON.stringify(mockUser));
    localStorage.setItem('crickethub_token', mockToken);
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, role: UserRole = 'player') => {
    setIsLoading(true);
    const mockUser: User = {
      id: `user-${role}-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    const mockToken = `mock_jwt_${role}_${Date.now()}`;
    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('crickethub_user', JSON.stringify(mockUser));
    localStorage.setItem('crickethub_token', mockToken);
    setIsLoading(false);
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      role,
      name: role === 'ground_owner' ? 'Hamid Ali (Owner)' : role === 'admin' ? 'Zain (Admin)' : 'Zain Sial',
    };
    setUser(updatedUser);
    localStorage.setItem('crickethub_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('crickethub_user');
    localStorage.removeItem('crickethub_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
