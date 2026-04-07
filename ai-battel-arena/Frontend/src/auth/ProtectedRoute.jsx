import { Navigate } from "react-router-dom";

/**
 * Wraps a route and redirects to /login if no JWT is present.
 * Simple and clean — no duplicate if(token) checks.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}