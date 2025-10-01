// Import des outils de navigation React Router
import { Navigate, Outlet } from "react-router-dom";
// Import du hook d'authentification global
import { useAuth } from "./useAuth";

// Route protégée : accès uniquement si l'utilisateur est authentifié
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    // Redirige vers la page de login si non connecté
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// Route admin : accès uniquement si l'utilisateur est admin
export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    // Redirige vers la page de login si non connecté
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    // Redirige vers l'accueil si non admin
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

// Route MJ : accès uniquement si l'utilisateur est MJ ou admin
export function MjRoute() {
  const { isAuthenticated, isMj, isAdmin } = useAuth();
  if (!isAuthenticated) {
    // Redirige vers la page de login si non connecté
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin && !isMj) {
    // Redirige vers l'accueil si ni MJ ni admin
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}