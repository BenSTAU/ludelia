import { createContext, useEffect } from "react";
import { useState } from "react";

export const AuthContext = createContext();

export default function CheckAuth({ children }) {
  const [user, setUser] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
  };

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
        console.log("Je viens de la route 1");
        setIsAuthenticated(false);
        setUser(null);
      }
      if (response.ok) {
        console.log("Je viens de la route 2");
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("Je viens de la route 3");
      setIsAuthenticated(false);
      setUser(null);
    }
  }
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setIsAuthenticated, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
