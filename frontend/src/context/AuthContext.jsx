import { createContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(email, password) {
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.access_token);
        await refreshUser();
      },
      async register(payload) {
        await api.post("/auth/register", payload);
      },
      async syncWallet(walletAddress) {
        const { data } = await api.post("/auth/wallet-sync", { wallet_address: walletAddress });
        setUser(data);
      },
      logout() {
        localStorage.removeItem("token");
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
