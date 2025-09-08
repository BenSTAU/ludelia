import { useContext } from "react";
import { AuthContext } from "./checkAuth.jsx";

export function useAuth() {
  return useContext(AuthContext);
}
