import CardAuth from "../../../component/card/cardAuth/CardAuth";
import CardGoogle from "../../../component/card/cardGoogle/CardGoogle";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import "./password.scss";


export default function ForgottenPassword() {
  const navigate = useNavigate();
  const [emailUsername, setEmailUsername] = useState("");

  async function handleForgottenPassword(e) {
    e.preventDefault();

    const toastId = toast.loading("Envoi de l'email...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/auth/forgotpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emailUsername }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, {
          id: toastId,
          duration: 2000,
        });
        navigate("/");
      } else {
        toast.error(data.message, {
          id: toastId,
          duration: 2000,
        });
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
        <h1>Réinitialisation du mot de passe</h1>
        <p>veuillez renseigner votre nom d’utilisateur et votre email pour recevoir un lien de réinitialisation de votre mot de passe</p>
        <CardAuth height={"200px"}>
          <div>
            <label htmlFor="emailUsername">Email / Nom d'utilisateur</label>
            <input
              type="text"
              id="emailUsername"
              name="emailUsername"
              placeholder="Entrez votre email ou nom d'utilisateur"
              onChange={(e) =>
                setEmailUsername(e.target.value)
              }
              required
            />
          </div>
          <button onClick={handleForgottenPassword} className="btn btnForgottenPassword">
            Envoyer
          </button>
          <Link to="/">Se connecter</Link>
          <Link to="/register">S'inscrire</Link>
        </CardAuth>
        <h2> Ou </h2>
        <CardGoogle />
      </div>
    </section>
  );
}
