import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;

}

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;

}

export function MjRoute() {
  const { isAuthenticated, isMj, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin && !isMj) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
}