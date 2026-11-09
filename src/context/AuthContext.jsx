import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../features/auth/authService';

const SESSION_KEY = 'libraspace-demo-user';
const AuthContext = createContext(null);

function readSession() {
  try {
    const user = JSON.parse(localStorage.getItem(SESSION_KEY));
    return user?.id && user?.email && user?.name ? user : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);
  const [checking, setChecking] = useState(() => !!readSession());
  const setSession = useCallback(value => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(value));
    setUser(value);
  }, []);

  const login = useCallback(async (email, password) => {
    const account = await authService.login(email, password);
    setSession(account);
  }, [setSession]);

  const register = useCallback(async values => {
    const account = await authService.register(values);
    setSession(account);
  }, [setSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const session = readSession();
    if (!session) return;
    let active = true;
    authService.getUser(session.id).then(account => { if (active) setSession(account); }).catch(() => { if (active) logout(); }).finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [logout, setSession]);

  const updateProfile = useCallback(async values => {
    const account = await authService.updateProfile(user.id, values);
    setSession(account);
  }, [user, setSession]);
  const changePassword = useCallback((currentPassword, newPassword, confirmPassword) => authService.changePassword(user.id, currentPassword, newPassword, confirmPassword), [user]);

  const value = useMemo(() => ({ user, checking, login, register, logout, updateProfile, changePassword }), [user, checking, login, register, logout, updateProfile, changePassword]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth phải nằm trong AuthProvider');
  return value;
}
