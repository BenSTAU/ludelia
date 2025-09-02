import CardAuth from "../../../component/card/cardAuth/CardAuth";
import "./login.scss";
import CardGoogle from "../../../component/card/cardGoogle/CardGoogle";
import dragon from "../../../assets/image/flyingdragon.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { handleResendActivationEmail } from "../../../../utils/resendActivationMail";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    emailUsername: "",
    password: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("google") === "false") {
      toast.error("Erreur de connexion avec Google", {
        duration: 2000,
      });
      navigate('/');
    } else if (params.get("google") === "classique") {
      toast.error("Compte déjà existant, veuillez vous connecter avec vos identifiants", {
        duration: 2000,
      });
    }
  }, [location, navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    const toastId = toast.loading("Connexion en cours...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, {
          id: toastId,
          duration: 2000,
        });
        navigate("/landing");
      } else {
        toast.error(data.message, {
          id: toastId,
          duration: 2000,
        });
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

  return (
    <section>
      <div>
        <h1>Connexion</h1>
        <CardAuth height={"250px"}>
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
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button onClick={handleLogin} className="btn btnLogin">
            Connexion
          </button>
          <img src={dragon} alt="dessin d'un dragon" className="dragonImage" />
          <Link to="/forgotpassword">Mot de passe oublié ?</Link>
          <Link to="/register">S'inscrire</Link>
        </CardAuth>
        <h2> Ou </h2>
        <CardGoogle />
      </div>
    </section>
  );
}
