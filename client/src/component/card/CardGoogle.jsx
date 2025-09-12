import { useAuth } from "../../../utils/useAuth";
import googleLogo from "../../assets/image/google.svg";
import "./card.scss";

export default function CardGoogle() {
  const { setIsAuthenticated } = useAuth();
  const handleGoogleLogin = () => {
    window.open(`${import.meta.env.VITE_API_URL}/v1/auth/google`, "_self");
    setIsAuthenticated(true);
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
