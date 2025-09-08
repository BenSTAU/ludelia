import CardAuth from "../../../component/card/cardAuth/CardAuth";
import CardGoogle from "../../../component/card/cardGoogle/CardGoogle";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import "./password.scss";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = useParams().token;

  async function handleResetPassword(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    const toastId = toast.loading("Réinitialisation du mot de passe...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/auth/resetpassword/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
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
    <>
      <section>
        <div>
          <h1>Réinitialisation du mot de passe</h1>
          <p>Veuillez renseigner votre nouveau mot de passe</p>
          <CardAuth height={"250px"}>
            <div>
              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Entrez votre nouveau mot de passe"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmez votre nouveau mot de passe"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              onClick={handleResetPassword}
              className="btn btnForgottenPassword"
            >
              Envoyer
            </button>
            <Link to="/login">Se connecter</Link>
            <Link to="/register">S'inscrire</Link>
          </CardAuth>
          <h2> Ou </h2>
          <CardGoogle />
        </div>
      </section>
    </>
  );
}
