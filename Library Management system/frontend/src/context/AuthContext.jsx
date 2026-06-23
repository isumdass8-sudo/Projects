import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

// AuthContext holds the current user and login/logout functions.
// Any component in the app can access this via useAuth().
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Try to restore user from localStorage so they stay logged in on refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Called when the user submits the login form
  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;

    // Save token and user to localStorage so they persist on page refresh
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    return user; // return role so we can redirect accordingly
  }

  // Called when the user submits the register form
  async function register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  }

  // Clear everything and go to login page
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — any component calls useAuth() instead of useContext(AuthContext)
export function useAuth() {
  return useContext(AuthContext);
}
