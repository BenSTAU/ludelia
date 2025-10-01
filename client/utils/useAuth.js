// Import du contexte d'authentification global
import { useContext } from "react";
import { AuthContext } from "./CheckAuth.jsx";

// Hook personnalisé pour accéder à l'état d'authentification dans l'application
export function useAuth() {
  return useContext(AuthContext);
}
