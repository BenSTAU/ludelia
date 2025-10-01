// Import des composants locaux
import CardForm from "../../component/card/CardForm";
import CardGoogle from "../../component/card/CardGoogle";
import Password from "../../component/auth/Password";

// Import des assets
import dragon from "../../assets/image/flyingdragon.svg";

// Import globaux React et librairies tierces
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Import des utilitaires
import { handleResendActivationEmail } from "../../../utils/resendActivationMail";
import { useAuth } from "../../../utils/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    emailUsername: "",
    password: "",
  });
  const { isAuthenticated, setIsAuthenticated, setIsMj, setIsAdmin } = useAuth();

  // Redirige vers l'accueil si l'utilisateur est déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Affiche les erreurs liées à la connexion Google ou au compte existant
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("google") === "false") {
      toast.error("Erreur de connexion avec Google", {
        duration: 2000,
      });
      navigate("/");
    } else if (params.get("google") === "classique") {
      toast.error(
        "Compte déjà existant, veuillez vous connecter avec vos identifiants",
        {
          duration: 2000,
        }
      );
    }
  }, [location, navigate]);

  // Gère la soumission du formulaire de connexion
  async function handleLogin(e) {
    e.preventDefault();

    const toastId = toast.loading("Connexion en cours...");

    try {
      // Appel API pour authentifier l'utilisateur
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, {
          id: toastId,
          duration: 2000,
        });
        if (data.isMj) {
          setIsMj(true);
        }
        if (data.isAdmin) {
          setIsAdmin(true);
        }
        navigate("/");
        setIsAuthenticated(true);
      } else {
        toast.error(data.message, {
          id: toastId,
          duration: 2000,
        });
        // Si le compte n'est pas activé, propose la réactivation par email
        if (response.status === 403) {
          handleResendActivationEmail(e, formData.emailUsername, navigate);
        }
      }
    } catch (error) {
      toast.error("Erreur lors de la connexion", {
        id: toastId,
        duration: 2000,
      });
    }
  }

  // Affichage principal du formulaire de connexion
  return (
    <section>
      <div>
        <h1>Connexion</h1>
        <CardForm height={"250px"}>
          <div>
            <label htmlFor="emailUsername">Email / Nom d'utilisateur</label>
            <input
              type="text"
              id="emailUsername"
              name="emailUsername"
              placeholder="Entrez votre email ou nom d'utilisateur"
              onChange={(e) =>
                setFormData({ ...formData, emailUsername: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="password">Mot de passe</label>
            <Password
              id="password"
              nom="password"
              placeholder="Entrez votre mot de passe"
              formData={formData}
              setFormData={setFormData}
            />
          </div>
          <Link to="/forgotpassword">Mot de passe oublié ?</Link>
          <Link to="/register">S'inscrire</Link>
          <div className="btnDragonContainer">
            <button onClick={handleLogin} className="btn btnLogin">
              Connexion
            </button>
            <img
              src={dragon}
              alt="dessin d'un dragon"
              className="dragonImage"
            />
          </div>
        </CardForm>
        <h2> Ou </h2>
        <CardGoogle />
      </div>
    </section>
  );
}
