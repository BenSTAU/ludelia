import { useContext } from "react";
import { AuthContext } from "./CheckAuth.jsx";

export function useAuth() {
  return useContext(AuthContext);
}
