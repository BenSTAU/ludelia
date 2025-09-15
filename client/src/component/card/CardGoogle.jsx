import { useAuth } from "../../../utils/useAuth";
import googleLogo from "../../assets/image/google.svg";
import "./card.scss";

export default function CardGoogle() {
  const { setIsAuthenticated, setIsAdmin, setIsMj } = useAuth();
  const handleGoogleLogin = async () => {
    window.open(`${import.meta.env.VITE_API_URL}/v1/auth/google`, "_self");
    setIsAuthenticated(true);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/v1/auth/verifytoken`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.isMj) {
      setIsMj(true);
    }
    if (data.isAdmin) {
      setIsAdmin(true);
    }
  };

  return (
    <button className="cardGoogle card" onClick={handleGoogleLogin}>
      <h2
        style={{ display: "inline-flex", alignItems: "center", gap: "0.5em" }}
      >
        Connexion avec
        <img src={googleLogo} alt="Logo Google" />
      </h2>
    </button>
  );
}
