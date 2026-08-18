import React, { createContext, useContext, useState, useCallback } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem('crm_admin');
    return raw ? JSON.parse(raw) : null;
  });

  const login = useCallback(async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password });
    localStorage.setItem('crm_token', data.token);
    localStorage.setItem('crm_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data.admin;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await client.post('/auth/register', { name, email, password });
    localStorage.setItem('crm_token', data.token);
    localStorage.setItem('crm_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data.admin;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_admin');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, register, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
