import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Import des composants locaux
import CardForm from "../../component/card/CardForm";
import CardGoogle from "../../component/card/CardGoogle";

// Récupère le token de réinitialisation depuis l'URL
export default function ResetPassword() {
  const navigate = useNavigate();
  const token = useParams().token;

  // États pour les champs du formulaire
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Gère la soumission du formulaire de réinitialisation du mot de passe
  async function handleResetPassword(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    const toastId = toast.loading("Réinitialisation du mot de passe...");

    try {
      // Appel API pour réinitialiser le mot de passe
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

  // Affichage principal de la page de réinitialisation
  return (
    <>
      <section>
        <div>
          <h1>Réinitialisation du mot de passe</h1>
          <p>Veuillez renseigner votre nouveau mot de passe</p>
          <CardForm height={"250px"}>
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
          </CardForm>
          <h2> Ou </h2>
          <CardGoogle />
        </div>
      </section>
    </>
  );
}
