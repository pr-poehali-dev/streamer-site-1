import { useState, useEffect, useCallback } from "react";
import { userApi, User } from "@/lib/userApi";

const TOKEN_KEY = "chat_session_token";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem(TOKEN_KEY));

  const loadMe = useCallback(async (t: string) => {
    setLoading(true);
    const res = await userApi("me", {}, t);
    setLoading(false);
    if (res.ok) {
      setUser(res.user);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (token) loadMe(token);
  }, [token, loadMe]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const updateUser = (patch: Partial<User>) => {
    setUser((u) => (u ? { ...u, ...patch } : u));
  };

  return { token, user, loading, login, logout, updateUser };
}
