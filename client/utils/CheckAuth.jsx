import { createContext, useEffect, useState } from "react";

// Création du contexte d'authentification global
export const AuthContext = createContext();

export default function CheckAuth({ children }) {
  // États d'authentification utilisateur
  const [user, setUser] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMj, setIsMj] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Déconnexion utilisateur et reset des états
  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsMj(false);
    setIsAdmin(false);
  };

  // Vérifie l'authentification via l'API à chaque chargement
  async function checkAuth() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/auth/verifytoken`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        setIsMj(false);
        setIsAdmin(false);
      }
      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        setIsMj(data.role === "mj");
        setIsAdmin(data.role === "admin");
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setIsMj(false);
      setIsAdmin(false);
    }
  }

  // Vérifie l'authentification au montage du composant
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setIsAuthenticated,
        setUser,
        logout,
        isMj,
        isAdmin,
        setIsMj,
        setIsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
