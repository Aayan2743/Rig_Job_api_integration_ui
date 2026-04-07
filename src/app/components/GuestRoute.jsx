import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function GuestRoute({ children }) {
  const { token, user } = useAuth();

  // 🔥 If already logged in → redirect
  if (token && user) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "employer") {
      return user.companyName
        ? <Navigate to="/company/dashboard" replace />
        : <Navigate to="/employer/dashboard" replace />;
    }

    if (user.role === "candidate") {
      return <Navigate to="/candidate/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}