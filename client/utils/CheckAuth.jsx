import { createContext, useEffect } from "react";
import { useState } from "react";

export const AuthContext = createContext();

export default function CheckAuth({ children }) {
  const [user, setUser] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      }
      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
      }
      const logout = async () => {
        setIsAuthenticated(false);
        setUser(null);
      };
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification",
        error
      );
      setIsAuthenticated(false);
      setUser(null);
    }
  }
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
