import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('token');
        const u = await AsyncStorage.getItem('user');
        if (t && u) { setToken(t); setUser(JSON.parse(u)); }
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const staffLogin = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    if (!data.success) throw new Error(data.message);
    return data;
  };

  const verifyOTP = async (userId, otp) => {
    const { data } = await api.post('/auth/verify-otp', { userId, otp });
    if (!data.success) throw new Error(data.message);
    await _save(data.token, data.user);
  };

  const clientLogin = async (username, password) => {
    const { data } = await api.post('/auth/client/login', { username, password });
    if (!data.success) throw new Error(data.message);
    await _save(data.token, data.user);
  };

  const clientRegister = async (fields) => {
    const { data } = await api.post('/auth/client/register', fields);
    if (!data.success) throw new Error(data.message);
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    await AsyncStorage.clear();
    setUser(null); setToken(null);
  };

  const _save = async (t, u) => {
    await AsyncStorage.setItem('token', t);
    await AsyncStorage.setItem('user', JSON.stringify(u));
    setToken(t); setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, staffLogin, verifyOTP, clientLogin, clientRegister, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
