import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../services/auth.api";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  const handleRegister = async (data) => {
    try {
      setLoading(true);
      const res = await registerUser(data);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      const res = await loginUser(data);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    try {
      setLoading(true);
      const res = await getMe();
      setUser(res.data.user);
    } catch (err) {
      // If 401, just clear user silently
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetMe();
  }, []);

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout,
  };
};