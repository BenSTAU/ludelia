import { createContext, useEffect } from "react";
import { useState } from "react";

export const AuthContext = createContext();

export default function CheckAuth({ children }) {
  const [user, setUser] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMj, setIsMj] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsMj(false);
    setIsAdmin(false);
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
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setIsAuthenticated, setUser, logout, isMj, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}
