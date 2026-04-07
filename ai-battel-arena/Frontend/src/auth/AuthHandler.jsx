import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Handles the OAuth callback redirect from the backend.
 * Reads ?token= from the URL, saves to localStorage, then cleans the URL.
 * Rendered at the root "/" route so it runs on every page load.
 */
export default function AuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // ✅ Strip token from URL so it doesn't leak in browser history
      window.history.replaceState({}, document.title, "/");
      navigate("/", { replace: true });
    }
  }, []);

  return null;
}