import React, { createContext, useState, useEffect } from "react";
import { login, register } from "./services/auth.api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlelogin = async (username, password) => {
    setLoading(true);
    try {
      const res = await login(username, password);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await register(username, email, password);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, handlelogin, handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
}