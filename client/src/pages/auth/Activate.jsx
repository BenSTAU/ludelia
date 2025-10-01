import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Import des composants locaux
import CardForm from "../../component/card/CardForm";

// Import des utilitaires
import { handleResendActivationEmail } from "../../../utils/resendActivationMail";

export default function Activate() {
  const [responseMessage, setResponseMessage] = useState("");
  const [success, setSuccess] = useState(true);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const token = useParams().token;

  // Tente d'activer le compte via l'API avec le token
  async function activateAccount() {
    const toastId = toast.loading("Activation en cours...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/auth/activate/${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, {
          id: toastId,
          duration: 2000,
        });
        setResponseMessage(data.message);
      } else {
        setSuccess(false);
        toast.error(data.message, {
          id: toastId,
          duration: 2000,
        });
        setResponseMessage(data.message);
      }
    } catch (error) {
      setSuccess(false);
      toast.error("Erreur lors de l'activation", {
        id: toastId,
        duration: 2000,
      });
    }
  }

  // Lance l'activation du compte au montage du composant
  useEffect(() => {
    activateAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Affichage principal de la page d'activation
  return (
    <section>
      <CardForm height={"200px"}>
        <h2>{responseMessage}</h2>
        {!success && (
          <>
            <p>Entrez votre email pour renvoyer l'email d'activation</p>
            <input
              type="email"
              placeholder="Votre email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="btn btnLogin"
              onClick={(e) => handleResendActivationEmail(e, email, navigate)}
            >
              Envoyer
            </button>
          </>
        )}
        {success && (
          <button className="btn btnLogin" onClick={() => navigate("/")}>
            Retour
          </button>
        )}
      </CardForm>
    </section>
  );
}
