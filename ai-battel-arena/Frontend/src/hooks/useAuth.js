/**
 * @file useAuth.js
 * Decodes the JWT from localStorage and exposes user info + logout.
 * No network call needed — the JWT payload already contains name/avatar.
 */

import { useMemo } from "react";
import { logout } from "../api/google.auth.api";

export function useAuth() {
  const user = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      // JWT payload is the middle base64 segment
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.userId,
        name: payload.name ?? "User",
        email: payload.email ?? "",
        avatar: payload.avatar ?? null,
      };
    } catch {
      return null;
    }
  }, []);

  return { user, logout };
}