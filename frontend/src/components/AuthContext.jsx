import React, { createContext, useContext, useEffect, useState } from "react";
import { checkAuth, logoutUser } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const res = await checkAuth();
      if (!mounted) return;

      // If your backend returns {email: "..."} from /api/me:
      if (res?.email) setUser({ email: res.email });
      else if (res?.ok) setUser({ email: "user" }); // fallback when /api/me not present yet
      else setUser(null);

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
