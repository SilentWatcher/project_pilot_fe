import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { user: userData } = res.data.data;
    setUser(userData);
    toast.success('Login successful');
    return userData;
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post('/api/auth/register', { name, email, password, role });
    const { user: userData } = res.data.data;
    setUser(userData);
    toast.success('Registration successful');
    return userData;
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch {
      // proceed regardless
    }
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
